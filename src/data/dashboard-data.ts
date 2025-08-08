// Dados das seções da dashboard
export interface DashboardData {
  matriculas: any[];
  atendimento: any[];
  secretaria: any[];
  pedagogia: any[];
  certificacao: any[];
  competencia: any[];
  ouvidoria: any[];
}

// Importar dados dos arquivos existentes
import { matriculasData } from './matriculas';
import { secretariaData } from './secretaria';

// Dados das seções mapeados corretamente do JSON
export const dashboardData: DashboardData = {
  // Seção de Matrículas - dados da aba "MATRICULAS" do Google Sheets
  matriculas: matriculasData,

  // Seção de Atendimento - dados da aba "ATENDIMENTO" do Google Sheets
  atendimento: [
    {
      "Colaborador": "Kaique Santana Ribeiro",
      "Atividade": "Atendimento",
      "Plataforma": "GRUPO LA EDUCAÇÃO",
      "Nível de Ensino": "Todos",
      "Data": "2025-08-01T00:00:00",
      "Quantidade": 70.0,
      "Observações": null
    },
    {
      "Colaborador": "Kaique Santana Ribeiro",
      "Atividade": "Protocolos e tarefas",
      "Plataforma": "GRUPO LA EDUCAÇÃO",
      "Nível de Ensino": "Todos",
      "Data": "2025-08-01T00:00:00",
      "Quantidade": 25.0,
      "Observações": null
    },
    {
      "Colaborador": "Kaique Santana Ribeiro",
      "Atividade": "validação de documento",
      "Plataforma": null,
      "Nível de Ensino": null,
      "Data": null,
      "Quantidade": null,
      "Observações": null
    },
    {
      "Colaborador": "Kaique Santana Ribeiro",
      "Atividade": "Protocolos e tarefas",
      "Plataforma": null,
      "Nível de Ensino": "Todos",
      "Data": null,
      "Quantidade": 40.0,
      "Observações": null
    },
    {
      "Colaborador": "Kaique Santana Ribeiro",
      "Atividade": "Suporte",
      "Plataforma": null,
      "Nível de Ensino": null,
      "Data": null,
      "Quantidade": null,
      "Observações": null
    },
    {
      "Colaborador": "Lilian Yukari",
      "Atividade": "Atendimento",
      "Plataforma": "GRUPO LA EDUCAÇÃO",
      "Nível de Ensino": "Todos",
      "Data": "2025-08-01T00:00:00",
      "Quantidade": 39.0,
      "Observações": null
    },
    {
      "Colaborador": "Lilian Yukari",
      "Atividade": "validação de documento",
      "Plataforma": "GRUPO LA EDUCAÇÃO",
      "Nível de Ensino": "Todos",
      "Data": "2025-08-01T00:00:00",
      "Quantidade": 14.0,
      "Observações": null
    },
    {
      "Colaborador": "Lilian Yukari",
      "Atividade": "Protocolos e tarefas",
      "Plataforma": "GRUPO LA EDUCAÇÃO",
      "Nível de Ensino": "Todos",
      "Data": "2025-08-01T00:00:00",
      "Quantidade": 2.0,
      "Observações": null
    },
    {
      "Colaborador": "Lucas Valerio Giraldi",
      "Atividade": null,
      "Plataforma": null,
      "Nível de Ensino": null,
      "Data": null,
      "Quantidade": null,
      "Observações": null
    }
  ],

  // Seção da Secretaria Acadêmica - dados da aba "SECRETARIA ACADEMICA" do Google Sheets
  secretaria: secretariaData,

  // Seção da Pedagogia - dados da aba "PEDAGOGIA" do Google Sheets
  pedagogia: [
    {
      "Colaborador": "Maria Silva",
      "Atividade": "TCC e PRATICAS CORRIGIDAS",
      "Aluno": "João Pedro Santos",
      "Curso": "Pedagogia",
      "Plataforma": "LA FACULDADES",
      "Data da análise": "2025-08-01T00:00:00",
      "Observações": "Aprovado com ressalvas"
    },
    {
      "Colaborador": "Ana Santos",
      "Atividade": "TCC Corrigido",
      "Aluno": "Maria Fernanda Silva",
      "Curso": "Matemática",
      "Plataforma": "FAMAR",
      "Data da análise": "2025-08-01T00:00:00",
      "Observações": "Necessita revisão bibliográfica"
    },
    {
      "Colaborador": "Carlos Pereira",
      "Atividade": "Práticas Corrigidas",
      "Aluno": "Ana Carolina Santos",
      "Curso": "Educação Física",
      "Plataforma": "LA FACULDADES",
      "Data da análise": "2025-08-02T00:00:00",
      "Observações": "Práticas aprovadas"
    },
    {
      "Colaborador": "Laura Costa",
      "Atividade": "TCC em Análise",
      "Aluno": "Pedro Henrique Lima",
      "Curso": "História",
      "Plataforma": "UNIMAIS",
      "Data da análise": "2025-08-01T00:00:00",
      "Observações": "Aguardando correções"
    },
    {
      "Colaborador": "Roberto Silva",
      "Atividade": "Práticas em Revisão",
      "Aluno": "Juliana Oliveira",
      "Curso": "Letras",
      "Plataforma": "FAMAR",
      "Data da análise": "2025-08-02T00:00:00",
      "Observações": "Documentação incompleta"
    }
  ],

  // Seção da Certificação - dados da aba "CERTIFICACAO" do Google Sheets
  certificacao: [
    {
      "Colaborador": "Magali Aparecida Coppola",
      "Atividade": "Aprovado na Triagem",
      "Data da análise": "2025-08-01T00:00:00",
      "Quantidade": 80,
      "Observações": null
    },
    {
      "Colaborador": "Jonathan Henrique Jesus Oliveira",
      "Atividade": "Enviados a certificadora",
      "Data da análise": "2025-08-01T00:00:00",
      "Quantidade": 50,
      "Observações": null
    },
    {
      "Colaborador": "Jonathan Henrique Jesus Oliveira",
      "Atividade": "Aprovado na Triagem",
      "Data da análise": "2025-08-01T00:00:00",
      "Quantidade": 100,
      "Observações": null
    },
    {
      "Colaborador": "Jonathan Henrique Jesus Oliveira",
      "Atividade": "Enviados a certificadora",
      "Data da análise": null,
      "Quantidade": 50,
      "Observações": null
    },
    {
      "Colaborador": "Magali Aparecida Coppola",
      "Atividade": "Aprovado na Triagem",
      "Data da análise": null,
      "Quantidade": 5,
      "Observações": null
    },
    {
      "Colaborador": "Ana Maria Santos",
      "Atividade": "Certificado Emitido",
      "Data da análise": "2025-08-01T00:00:00",
      "Quantidade": 25,
      "Observações": "Certificados disponíveis para retirada"
    },
    {
      "Colaborador": "Carlos Eduardo Silva",
      "Atividade": "Em Processamento",
      "Data da análise": "2025-08-02T00:00:00",
      "Quantidade": 15,
      "Observações": "Aguardando validação final"
    }
  ],

  // Seção da Competência - dados da aba "COMPETENCIA" do Google Sheets
  competencia: [
    {
      "Colaborador": "Kauany da Silva de Araujo",
      "Aluno": "Wagner da Silva Cortinoves",
      "Atividade": "Triagem ",
      "Plataforma": "FRATEC",
      "Nível de Ensino": "Aproveitamento de Estudos e Conhecimentos",
      "Curso": "Química",
      "Data ": "2025-08-01T00:00:00",
      "Polo": "JG NEGOCIOS ONLINE LTDA",
      "Observações": "Esta faltando rg, cpf e historico do ensino médio "
    },
    {
      "Colaborador": "Kauany da Silva de Araujo",
      "Aluno": "ISLANDER HENRIQUE DO CARMO SILVA",
      "Atividade": "Triagem ",
      "Plataforma": "ITECC",
      "Nível de Ensino": "Competência",
      "Curso": "Segurança do Trabalho",
      "Data ": "2025-08-01T00:00:00",
      "Polo": "JG NEGOCIOS ONLINE LTDA",
      "Observações": "Esta faltando reservista e experiencia "
    },
    {
      "Colaborador": "Kauany da Silva de Araujo",
      "Aluno": "Edson Luis Teixeira",
      "Atividade": "Enviado a Certificadora",
      "Plataforma": "ITECC",
      "Nível de Ensino": "Competência",
      "Curso": "Enfermagem ",
      "Data ": "2025-08-01T00:00:00",
      "Polo": "JG NEGOCIOS ONLINE LTDA",
      "Observações": null
    },
    {
      "Colaborador": "Kauany da Silva de Araujo",
      "Aluno": "Lucas Monteiro Pires",
      "Atividade": "Enviado a Certificadora",
      "Plataforma": "FRATEC",
      "Nível de Ensino": "Aproveitamento de Estudos e Conhecimentos",
      "Curso": "Edificações",
      "Data ": "2025-08-01T00:00:00",
      "Polo": "JG NEGOCIOS ONLINE LTDA",
      "Observações": null
    },
    {
      "Colaborador": "Kauany da Silva de Araujo",
      "Aluno": "LUCAS QUADROS CUNHA",
      "Atividade": "Matricula ",
      "Plataforma": "ITECC",
      "Nível de Ensino": "Competência",
      "Curso": "Eletromecânica ",
      "Data ": "2025-08-01T00:00:00",
      "Polo": "JG NEGOCIOS ONLINE LTDA",
      "Observações": "SEM DOCUMENTO "
    },
    {
      "Colaborador": "Gabriel Gomes Lima",
      "Aluno": "JOAO PAULO ROBERTO BERNARDO",
      "Atividade": "Matricula ",
      "Plataforma": "FRATEC",
      "Nível de Ensino": "Aproveitamento de Estudos e Conhecimentos",
      "Curso": "LOGISTICA",
      "Data ": "2025-08-01T00:00:00",
      "Polo": "Avançar",
      "Observações": null
    },
    {
      "Colaborador": "Gabriel Gomes Lima",
      "Aluno": "WALLISON TADEU DA SILVA MIRANDA",
      "Atividade": "Matricula ",
      "Plataforma": "ITECC",
      "Nível de Ensino": "Competência",
      "Curso": "ELETROTECNICA",
      "Data ": "2025-08-01T00:00:00",
      "Polo": "Avançar",
      "Observações": null
    },
    {
      "Colaborador": "Gabriel Gomes Lima",
      "Aluno": "Ricardo Passos Prudencio",
      "Atividade": "Matricula ",
      "Plataforma": "ITECC",
      "Nível de Ensino": "Competência",
      "Curso": "ELETROTÉCNICA",
      "Data ": "2025-08-01T00:00:00",
      "Polo": "Instituto técnico paulista",
      "Observações": null
    }
  ],

  // Seção da Ouvidoria - dados da aba "OUVIDORIA" do Google Sheets
  ouvidoria: [
    {
      "Colaborador": "Franciele Santos",
      "Aluno": "Miguel",
      "Atividade": "OUVIDORIA LA",
      "STATUS": "AGUARDANDO VERIFICAÇÃO DO SETOR",
      "Plataforma": "LA EDUCAÇÃO",
      "Nível de Ensino": "Superior",
      "Curso": "Administração",
      "Data ": "2025-08-01T00:00:00",
      "Data da conclusão": null,
      "Polo": "Centro Educacional",
      "Observações": "Reclamação sobre atendimento"
    },
    {
      "Colaborador": "Franciele Santos",
      "Aluno": "Ana Silva",
      "Atividade": "SUGESTÃO",
      "STATUS": "EM ANÁLISE",
      "Plataforma": "FAMAR",
      "Nível de Ensino": "Técnico",
      "Curso": "Enfermagem",
      "Data ": "2025-08-01T00:00:00",
      "Data da conclusão": null,
      "Polo": "Polo Centro",
      "Observações": "Sugestão de melhoria no processo"
    },
    {
      "Colaborador": "Franciele Santos",
      "Aluno": "João Carlos",
      "Atividade": "RECLAMAÇÃO",
      "STATUS": "RESOLVIDO",
      "Plataforma": "UNIMAIS",
      "Nível de Ensino": "Superior",
      "Curso": "Pedagogia",
      "Data ": "2025-07-30T00:00:00",
      "Data da conclusão": "2025-08-01T00:00:00",
      "Polo": "Polo Norte",
      "Observações": "Problema com certificado resolvido"
    },
    {
      "Colaborador": "Maria Santos",
      "Aluno": "Pedro Oliveira",
      "Atividade": "ELOGIO",
      "STATUS": "REGISTRADO",
      "Plataforma": "LA FACULDADES",
      "Nível de Ensino": "Pós-graduação",
      "Curso": "Gestão Educacional",
      "Data ": "2025-08-02T00:00:00",
      "Data da conclusão": null,
      "Polo": "Polo Sul",
      "Observações": "Elogio ao atendimento da secretaria"
    },
    {
      "Colaborador": "Carlos Lima",
      "Aluno": "Maria Fernanda",
      "Atividade": "DÚVIDA",
      "STATUS": "ESCLARECIDO",
      "Plataforma": "ITECC",
      "Nível de Ensino": "Técnico",
      "Curso": "Informática",
      "Data ": "2025-08-01T00:00:00",
      "Data da conclusão": "2025-08-02T00:00:00",
      "Polo": "Polo Leste",
      "Observações": "Dúvida sobre processo de matrícula esclarecida"
    }
  ]
}