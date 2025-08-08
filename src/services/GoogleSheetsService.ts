export interface SectionData {
  [key: string]: any;
}

export interface SpreadsheetConfig {
  id: string;
  name: string;
  gid?: number;
  sectionId: string;
}

// Configurações de planilhas por seção
export interface SectionSpreadsheets {
  [sectionId: string]: SpreadsheetConfig[];
}

const DEBUG = false;

export class GoogleSheetsService {
  // Configuração principal da planilha - todas as seções apontam para abas diferentes da mesma planilha
  private static MAIN_SPREADSHEET_ID = '1-8rZ9MMXQ4dbYY6HYg04Fl0EwmqRye5Mc6fs3jbg9BM';
  
  // Mapeamento das seções para suas respectivas abas (GIDs)
  private static SECTION_MAPPINGS = {
    matriculas: { name: 'Matrícula', gid: 236430456 },
    atendimento: { name: 'Atendimento', gid: 1 },
    ouvidoria: { name: 'Ouvidoria', gid: 2 },
    secretaria: { name: 'Secretaria Acadêmica', gid: 3 },
    pedagogia: { name: 'Pedagogia', gid: 4 },
    certificacao: { name: 'Certificação', gid: 5 },
    competencia: { name: 'Competência', gid: 6 }
  };

  // Cache temporário local para dados por seção
  private static CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos
  private static cacheKey(sectionId: string) { return `googleSheets_cache_${sectionId}`; }
  private static loadCache(sectionId: string): { data: SectionData[]; timestamp: number } | null {
    try {
      const raw = localStorage.getItem(this.cacheKey(sectionId));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  private static saveCache(sectionId: string, data: SectionData[]) {
    try {
      const payload = { data, timestamp: Date.now() };
      localStorage.setItem(this.cacheKey(sectionId), JSON.stringify(payload));
    } catch {}
  }

  // Armazenamento dinâmico das planilhas por seção
  private static sectionSpreadsheets: SectionSpreadsheets = {};
  // Inicializar configurações persistentes ao carregar o serviço
  static {
    this.initializePersistentConnections();
  }

  // Inicializar conexões persistentes para todas as seções
  private static initializePersistentConnections() {
    DEBUG && console.log('[GoogleSheets] Inicializando conexões persistentes...');
    
    // Configurar todas as seções automaticamente
    Object.entries(this.SECTION_MAPPINGS).forEach(([sectionId, config]) => {
      this.sectionSpreadsheets[sectionId] = [{
        id: this.MAIN_SPREADSHEET_ID,
        name: `Planilha ${config.name}`,
        gid: config.gid,
        sectionId
      }];
    });

    // Restaurar configurações customizadas do localStorage se existirem
    this.restoreCustomConfigurations();
    
    DEBUG && console.log('[GoogleSheets] Conexões persistentes configuradas:', Object.keys(this.sectionSpreadsheets));
  }

  // Restaurar configurações customizadas salvas no localStorage
  private static restoreCustomConfigurations() {
    try {
      const saved = localStorage.getItem('googleSheets_sectionConfigs');
      if (saved) {
        const customConfigs = JSON.parse(saved);
        Object.entries(customConfigs).forEach(([sectionId, configs]: [string, any]) => {
          if (Array.isArray(configs)) {
            this.sectionSpreadsheets[sectionId] = configs;
          }
        });
        DEBUG && console.log('[GoogleSheets] Configurações customizadas restauradas');
      }
    } catch (error) {
      DEBUG && console.warn('[GoogleSheets] Erro ao restaurar configurações customizadas:', error);
    }
  }

  // Salvar configurações no localStorage para persistência
  private static saveConfigurations() {
    try {
      const customConfigs: any = {};
      
      // Salvar apenas configurações que diferem do padrão
      Object.entries(this.sectionSpreadsheets).forEach(([sectionId, configs]) => {
        const defaultConfig = this.SECTION_MAPPINGS[sectionId as keyof typeof this.SECTION_MAPPINGS];
        
        if (!defaultConfig || 
            configs.length > 1 || 
            configs[0]?.id !== this.MAIN_SPREADSHEET_ID ||
            configs[0]?.gid !== defaultConfig.gid) {
          customConfigs[sectionId] = configs;
        }
      });
      
      localStorage.setItem('googleSheets_sectionConfigs', JSON.stringify(customConfigs));
    } catch (error) {
      DEBUG && console.warn('[GoogleSheets] Erro ao salvar configurações:', error);
    }
  }

  // Buscar dados de uma seção específica com reconexão automática
  static async fetchSectionData(sectionId: string): Promise<{ success: boolean; data?: SectionData[]; error?: string; reconnected?: boolean; fromCache?: boolean }> {
    try {
      let spreadsheets = this.sectionSpreadsheets[sectionId] || [];
      let reconnected = false;
      const cachedPayload = this.loadCache(sectionId);
      // Se não há configuração, tentar reconectar automaticamente
      if (spreadsheets.length === 0) {
        DEBUG && console.log(`[GoogleSheets] Seção ${sectionId} sem configuração. Tentando reconexão automática...`);
        
        const mapping = this.SECTION_MAPPINGS[sectionId as keyof typeof this.SECTION_MAPPINGS];
        if (mapping) {
          this.sectionSpreadsheets[sectionId] = [{
            id: this.MAIN_SPREADSHEET_ID,
            name: `Planilha ${mapping.name}`,
            gid: mapping.gid,
            sectionId
          }];
          spreadsheets = this.sectionSpreadsheets[sectionId];
          reconnected = true;
          this.saveConfigurations();
          DEBUG && console.log(`[GoogleSheets] Reconexão automática realizada para ${sectionId}`);
        } else {
          return { success: false, error: `Seção ${sectionId} não encontrada no mapeamento de abas` };
        }
      }

      const allData: SectionData[] = [];
      
      DEBUG && console.log(`Buscando dados de ${spreadsheets.length} planilha(s) da seção ${sectionId}...`);
      
      for (const spreadsheet of spreadsheets) {
        DEBUG && console.log(`Sincronizando planilha: ${spreadsheet.name}...`);
        
        const response = await fetch(
          `https://docs.google.com/spreadsheets/d/${spreadsheet.id}/export?format=csv&gid=${spreadsheet.gid || 0}`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          DEBUG && console.warn(`Erro ao buscar planilha ${spreadsheet.name}: HTTP ${response.status} - ${response.statusText}. URL: https://docs.google.com/spreadsheets/d/${spreadsheet.id}/export?format=csv&gid=${spreadsheet.gid || 0}`);
          continue;
        }

        const csvText = await response.text();
        
        if (!csvText || csvText.trim() === '') {
          DEBUG && console.warn(`Planilha ${spreadsheet.name} está vazia`);
          continue;
        }

        // Parse do CSV melhorado para lidar com caracteres especiais e dados vazios
        let lines = csvText.split('\n').filter(line => line.trim() !== '');
        
        // Remover possível BOM (Byte Order Mark) da primeira linha
        if (lines.length > 0 && lines[0].charCodeAt(0) === 0xFEFF) {
          lines[0] = lines[0].substring(1);
        }
        
        if (lines.length === 0) {
          DEBUG && console.warn(`Planilha ${spreadsheet.name} não possui dados válidos`);
          continue;
        }

        DEBUG && console.log(`Total de linhas no CSV (incluindo header): ${lines.length}`);

        // A primeira linha contém os cabeçalhos
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const dataLines = lines.slice(1);
        
        DEBUG && console.log(`Cabeçalhos encontrados: ${headers.join(', ')}`);
        DEBUG && console.log(`Linhas de dados para processar: ${dataLines.length}`);

        // Mapeia os dados para o formato esperado com melhor parsing de CSV
        const allRows = dataLines.map((line, index) => {
          // Melhor parsing de CSV considerando vírgulas dentro de aspas
          const values = this.parseCSVLine(line);
          const rowData: any = {};
          
          headers.forEach((header, headerIndex) => {
            const value = values[headerIndex] || '';
            rowData[header] = value.replace(/"/g, '').trim();
          });
          
          return { data: rowData as SectionData, lineNumber: index + 2 };
        });

        DEBUG && console.log(`Exemplo de dados parseados: ${JSON.stringify(allRows[0]?.data || {}, null, 2)}`);

        // Filtro mais permissivo - qualquer linha que tenha pelo menos 2 campos preenchidos
        const sectionData = allRows.filter(({ data, lineNumber }) => {
          const fieldValues = Object.values(data).filter(value => 
            value && typeof value === 'string' && value.trim() !== ''
          );
          
          const isValid = fieldValues.length >= 2; // Pelo menos 2 campos preenchidos
          
          if (!isValid) {
            DEBUG && console.log(`Linha ${lineNumber} filtrada (muito vazia): ${JSON.stringify(data).substring(0, 150)}...`);
          }
          
          return isValid;
        }).map(item => item.data);

        allData.push(...sectionData);
        DEBUG && console.log(`${sectionData.length} registros válidos carregados da planilha ${spreadsheet.name}`);
      }

      if (allData.length === 0) {
        // Fallback: usar cache recente se existir
        if (cachedPayload && Date.now() - cachedPayload.timestamp <= this.CACHE_TTL_MS) {
          DEBUG && console.warn(`[GoogleSheets] Sem novos dados para a seção ${sectionId}. Usando dados em cache (${new Date(cachedPayload.timestamp).toLocaleString()}).`);
          return { success: true, data: cachedPayload.data, reconnected, fromCache: true };
        }
        return { success: false, error: `Planilha sem registros no momento` };
      }

      // Remover duplicatas baseado em uma chave única
      const uniqueData = this.removeDuplicates(allData);
      
      DEBUG && console.log(`Total: ${allData.length} registros carregados, ${uniqueData.length} únicos da seção ${sectionId}`);
      // Salvar cache
      this.saveCache(sectionId, uniqueData);
      return { success: true, data: uniqueData, reconnected, fromCache: false };

    } catch (error) {
      console.error(`Erro ao buscar dados da seção ${sectionId}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao acessar as planilhas' 
      };
    }
  }

  // Adicionar uma planilha a uma seção com persistência
  static addSpreadsheetToSection(sectionId: string, spreadsheet: Omit<SpreadsheetConfig, 'sectionId'>): void {
    if (!this.sectionSpreadsheets[sectionId]) {
      this.sectionSpreadsheets[sectionId] = [];
    }
    
    const configWithSection = { ...spreadsheet, sectionId };
    this.sectionSpreadsheets[sectionId].push(configWithSection);
    
    // Salvar configuração persistente
    this.saveConfigurations();
    
    DEBUG && console.log(`Planilha ${spreadsheet.name} adicionada à seção ${sectionId} e configuração salva`);
  }

  // Reconectar uma seção específica
  static reconnectSection(sectionId: string): boolean {
    const mapping = this.SECTION_MAPPINGS[sectionId as keyof typeof this.SECTION_MAPPINGS];
    if (mapping) {
      this.sectionSpreadsheets[sectionId] = [{
        id: this.MAIN_SPREADSHEET_ID,
        name: `Planilha ${mapping.name}`,
        gid: mapping.gid,
        sectionId
      }];
      this.saveConfigurations();
      DEBUG && console.log(`[GoogleSheets] Seção ${sectionId} reconectada à aba ${mapping.name}`);
      return true;
    }
    return false;
  }

  // Verificar status da conexão de uma seção
  static getSectionConnectionStatus(sectionId: string): { connected: boolean; configExists: boolean; mapping: any } {
    const configExists = this.sectionSpreadsheets[sectionId]?.length > 0;
    const mapping = this.SECTION_MAPPINGS[sectionId as keyof typeof this.SECTION_MAPPINGS];
    
    return {
      connected: configExists,
      configExists,
      mapping
    };
  }

  // Obter todas as seções disponíveis
  static getAvailableSections(): string[] {
    return Object.keys(this.SECTION_MAPPINGS);
  }

  // Obter planilhas de uma seção
  static getSectionSpreadsheets(sectionId: string): SpreadsheetConfig[] {
    return this.sectionSpreadsheets[sectionId] || [];
  }

  // Remover uma planilha de uma seção com persistência
  static removeSpreadsheetFromSection(sectionId: string, spreadsheetId: string): void {
    if (this.sectionSpreadsheets[sectionId]) {
      this.sectionSpreadsheets[sectionId] = this.sectionSpreadsheets[sectionId].filter(
        s => s.id !== spreadsheetId
      );
      // Salvar configuração após remoção
      this.saveConfigurations();
      DEBUG && console.log(`Planilha ${spreadsheetId} removida da seção ${sectionId}`);
    }
  }

  // Método para testar conexão com uma planilha
  static async testSpreadsheetConnection(spreadsheetId: string, gid: number = 0): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const status = response.status;
        let msg = `Erro HTTP ${status}: Não foi possível acessar a planilha`;
        if (status === 403) msg = 'Acesso negado (403). Torne a planilha pública ou compartilhe com permissão de leitura.';
        if (status === 404 || status === 400) msg = 'Página não encontrada/GID inválido. Verifique se a aba existe e se a planilha está publicada (Arquivo > Compartilhar > Publicar na Web).';
        return { success: false, error: msg };
      }

      const csvText = await response.text();
      
      if (!csvText || csvText.trim() === '') {
        return { success: false, error: 'Planilha sem registros no momento' };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao testar conexão com a planilha' 
      };
    }
  }

  // Extrair ID da planilha de uma URL do Google Sheets
  static extractSpreadsheetId(url: string): string | null {
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Extrair GID de uma URL do Google Sheets
  static extractGid(url: string): number {
    const regex = /[#&]gid=([0-9]+)/;
    const match = url.match(regex);
    return match ? parseInt(match[1]) : 0;
  }

  // Remover duplicatas baseado em chave única
  private static removeDuplicates(data: SectionData[]): SectionData[] {
    const seen = new Set<string>();
    const uniqueData: SectionData[] = [];

    for (const item of data) {
      // Criar chave única baseada em campos importantes
      const key = this.createUniqueKey(item);
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(item);
      }
    }

    return uniqueData;
  }

  // Parser de linha CSV melhorado para lidar com vírgulas dentro de aspas
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Aspas duplas escapadas
          current += '"';
          i += 2;
        } else {
          // Início ou fim de campo com aspas
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Vírgula fora de aspas = separador de campo
        result.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    // Adicionar o último campo
    result.push(current);
    return result;
  }

  // Criar chave única para identificar duplicatas
  private static createUniqueKey(item: SectionData): string {
    // Para matrículas: Aluno + Curso + Data + Plataforma
    // Para outras seções: Colaborador + Atividade + Data + Plataforma
    const aluno = item.Aluno || '';
    const colaborador = item.Colaborador || '';
    const curso = item.Curso || '';
    const atividade = item.Atividade || '';
    const data = item['Data da análise'] || item.Data || '';
    const plataforma = item.Plataforma || '';

    // Se tem aluno, é matrícula
    if (aluno) {
      return `${aluno.toLowerCase()}-${curso.toLowerCase()}-${data}-${plataforma.toLowerCase()}`;
    }
    
    // Senão, usar colaborador
    return `${colaborador.toLowerCase()}-${atividade.toLowerCase()}-${data}-${plataforma.toLowerCase()}`;
  }
}