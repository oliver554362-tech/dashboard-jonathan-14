export interface OuvidoriaData {
  Colaborador: string;
  Aluno: string;
  Atividade: string;
  STATUS: string;
  Plataforma: string;
  "Nível de Ensino": string;
  Curso: string;
  "Data ": string;
  "Data da conclusão": string | null;
  Polo: string;
  Observações: string | null;
}

// Dados da Ouvidoria - dados da aba "OUVIDORIA" do Google Sheets
export const ouvidoriaData: OuvidoriaData[] = [
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
    "Curso": "Psicologia",
    "Data ": "2025-08-02T00:00:00",
    "Data da conclusão": null,
    "Polo": "Polo Sul",
    "Observações": "Elogio ao atendimento"
  },
  {
    "Colaborador": "Carlos Rodrigues",
    "Aluno": "Mariana Costa",
    "Atividade": "RECLAMAÇÃO",
    "STATUS": "EM ANÁLISE",
    "Plataforma": "ITECC",
    "Nível de Ensino": "Técnico",
    "Curso": "Eletrotécnica",
    "Data ": "2025-08-02T00:00:00",
    "Data da conclusão": null,
    "Polo": "Instituto técnico paulista",
    "Observações": "Problema com material didático"
  },
  {
    "Colaborador": "Ana Paula",
    "Aluno": "Roberto Silva",
    "Atividade": "SUGESTÃO",
    "STATUS": "IMPLEMENTADO",
    "Plataforma": "LA EDUCAÇÃO",
    "Nível de Ensino": "Superior",
    "Curso": "Direito",
    "Data ": "2025-07-28T00:00:00",
    "Data da conclusão": "2025-08-02T00:00:00",
    "Polo": "Centro Educacional",
    "Observações": "Sugestão de melhoria implementada"
  }
];