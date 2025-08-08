import { GoogleSheetsService } from './GoogleSheetsService';

class AutoSyncService {
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private syncCallbacks: Map<string, (data: any[]) => void> = new Map();
  private isAutoSyncEnabled: boolean = true;

  // Inicializar sincronização automática para uma seção
  startAutoSync(sectionId: string, callback: (data: any[]) => void, intervalMinutes: number = 5) {
    // Parar sincronização existente se houver
    this.stopAutoSync(sectionId);

    // Registrar callback
    this.syncCallbacks.set(sectionId, callback);

    // Configurar intervalo de sincronização
    const intervalMs = intervalMinutes * 60 * 1000; // Converter minutos para millisegundos
    
    const intervalId = setInterval(async () => {
      if (!this.isAutoSyncEnabled) return;
      
      try {
        console.log(`[AutoSync] Sincronizando seção: ${sectionId}`);
        const result = await GoogleSheetsService.fetchSectionData(sectionId);
        
        if (result.success && result.data) {
          // Chamar callback com os novos dados
          const callback = this.syncCallbacks.get(sectionId);
          if (callback) {
            callback(result.data);
          }
          
          // Informar sobre reconexão se ocorreu
          if (result.reconnected) {
            console.log(`[AutoSync] ⚡ Seção ${sectionId} foi reconectada automaticamente`);
          }
          
          console.log(`[AutoSync] Seção ${sectionId} sincronizada com sucesso. ${result.data.length} registros encontrados.`);
        } else {
          console.error(`[AutoSync] Erro ao sincronizar seção ${sectionId}:`, result.error);
          
          // Tentar reconectar em caso de erro
          console.log(`[AutoSync] Tentando reconectar seção ${sectionId}...`);
          const reconnected = GoogleSheetsService.reconnectSection(sectionId);
          if (reconnected) {
            console.log(`[AutoSync] Seção ${sectionId} reconectada. Tentando sincronizar novamente...`);
            // Tentar sincronizar novamente após reconexão
            try {
              const retryResult = await GoogleSheetsService.fetchSectionData(sectionId);
              if (retryResult.success && retryResult.data) {
                const callback = this.syncCallbacks.get(sectionId);
                if (callback) {
                  callback(retryResult.data);
                }
                console.log(`[AutoSync] Seção ${sectionId} sincronizada após reconexão. ${retryResult.data.length} registros encontrados.`);
              }
            } catch (retryError) {
              console.error(`[AutoSync] Erro na tentativa de sincronização após reconexão de ${sectionId}:`, retryError);
            }
          }
        }
      } catch (error) {
        console.error(`[AutoSync] Erro ao sincronizar seção ${sectionId}:`, error);
      }
    }, intervalMs);

    this.syncIntervals.set(sectionId, intervalId);
    
    console.log(`[AutoSync] Sincronização automática iniciada para ${sectionId} (a cada ${intervalMinutes} minutos)`);
  }

  // Parar sincronização automática para uma seção
  stopAutoSync(sectionId: string) {
    const intervalId = this.syncIntervals.get(sectionId);
    if (intervalId) {
      clearInterval(intervalId);
      this.syncIntervals.delete(sectionId);
      this.syncCallbacks.delete(sectionId);
      console.log(`[AutoSync] Sincronização automática parada para ${sectionId}`);
    }
  }

  // Parar todas as sincronizações
  stopAllAutoSync() {
    this.syncIntervals.forEach((intervalId, sectionId) => {
      clearInterval(intervalId);
      console.log(`[AutoSync] Sincronização automática parada para ${sectionId}`);
    });
    
    this.syncIntervals.clear();
    this.syncCallbacks.clear();
  }

  // Habilitar/desabilitar sincronização automática
  setAutoSyncEnabled(enabled: boolean) {
    this.isAutoSyncEnabled = enabled;
    console.log(`[AutoSync] Sincronização automática ${enabled ? 'habilitada' : 'desabilitada'}`);
  }

  // Verificar se uma seção tem sincronização ativa
  isAutoSyncActive(sectionId: string): boolean {
    return this.syncIntervals.has(sectionId);
  }

  // Obter status de todas as sincronizações com informações de conexão
  getSyncStatus(): { sectionId: string; isActive: boolean; connected: boolean; mapping: any }[] {
    const allSections = GoogleSheetsService.getAvailableSections();
    
    return allSections.map(sectionId => {
      const connectionStatus = GoogleSheetsService.getSectionConnectionStatus(sectionId);
      return {
        sectionId,
        isActive: this.isAutoSyncActive(sectionId),
        connected: connectionStatus.connected,
        mapping: connectionStatus.mapping
      };
    });
  }

  // Reconectar uma seção específica
  reconnectSection(sectionId: string): boolean {
    return GoogleSheetsService.reconnectSection(sectionId);
  }

  // Inicializar todas as conexões automáticas
  initializeAllConnections(callbacks: Map<string, (data: any[]) => void>) {
    const availableSections = GoogleSheetsService.getAvailableSections();
    
    availableSections.forEach(sectionId => {
      const callback = callbacks.get(sectionId);
      if (callback) {
        // Verificar se já não está ativo
        if (!this.isAutoSyncActive(sectionId)) {
          this.startAutoSync(sectionId, callback, 5);
        }
      }
    });
    
    console.log(`[AutoSync] Inicialização completa para ${availableSections.length} seções`);
  }

  // Sincronização manual forçada com tentativa de reconexão
  async forceSyncSection(sectionId: string): Promise<any[]> {
    try {
      console.log(`[AutoSync] Sincronização manual forçada para ${sectionId}`);
      const result = await GoogleSheetsService.fetchSectionData(sectionId);
      
      if (result.success && result.data) {
        // Chamar callback se existir
        const callback = this.syncCallbacks.get(sectionId);
        if (callback) {
          callback(result.data);
        }
        
        if (result.reconnected) {
          console.log(`[AutoSync] ⚡ Seção ${sectionId} foi reconectada durante sincronização manual`);
        }
        
        console.log(`[AutoSync] Sincronização manual concluída para ${sectionId}. ${result.data.length} registros encontrados.`);
        return result.data;
      } else {
        console.error(`[AutoSync] Erro na sincronização manual de ${sectionId}:`, result.error);
        
        // Tentar reconectar se houve erro
        console.log(`[AutoSync] Tentando reconectar ${sectionId} antes de falhar...`);
        const reconnected = GoogleSheetsService.reconnectSection(sectionId);
        if (reconnected) {
          const retryResult = await GoogleSheetsService.fetchSectionData(sectionId);
          if (retryResult.success && retryResult.data) {
            const callback = this.syncCallbacks.get(sectionId);
            if (callback) {
              callback(retryResult.data);
            }
            console.log(`[AutoSync] Sincronização manual bem-sucedida após reconexão de ${sectionId}. ${retryResult.data.length} registros encontrados.`);
            return retryResult.data;
          }
        }
        
        throw new Error(result.error || 'Erro desconhecido na sincronização');
      }
    } catch (error) {
      console.error(`[AutoSync] Erro na sincronização manual de ${sectionId}:`, error);
      throw error;
    }
  }

  // Configurar sincronização para dados persistidos
  configurePersistentSync(sectionId: string, callback: (data: any[]) => void) {
    // Salvar configuração no localStorage para persistir entre sessões
    const syncConfig = {
      sectionId,
      intervalMinutes: 5,
      enabled: true,
      lastSync: Date.now()
    };
    
    localStorage.setItem(`autoSync_${sectionId}`, JSON.stringify(syncConfig));
    this.startAutoSync(sectionId, callback, 5);
  }

  // Restaurar sincronizações persistidas
  restorePersistentSyncs(callbacks: Map<string, (data: any[]) => void>) {
    const allSections = ['matriculas', 'atendimento', 'secretaria', 'pedagogia', 'certificacao', 'competencia', 'ouvidoria'];
    
    allSections.forEach(sectionId => {
      const configStr = localStorage.getItem(`autoSync_${sectionId}`);
      if (configStr) {
        try {
          const config = JSON.parse(configStr);
          if (config.enabled) {
            const callback = callbacks.get(sectionId);
            if (callback) {
              this.startAutoSync(sectionId, callback, config.intervalMinutes || 5);
            }
          }
        } catch (error) {
          console.error(`[AutoSync] Erro ao restaurar configuração para ${sectionId}:`, error);
        }
      }
    });
  }
}

// Instância singleton
export const autoSyncService = new AutoSyncService();

// Limpar todas as sincronizações quando a página for fechada
window.addEventListener('beforeunload', () => {
  autoSyncService.stopAllAutoSync();
});