export interface CentralAtendimento {
  id: string;
  data: string;
  polo: string;
  categoria: string;
  subcategoria?: string;
  colaborador: string;
  descricao?: string;
  status: string;
  prioridade?: string;
  observacoes?: string;
}

export const centralAtendimentoData: CentralAtendimento[] = [
  {
    id: "1",
    data: "2025-01-15",
    polo: "Polo São Paulo",
    categoria: "Suporte Técnico",
    subcategoria: "Plataforma",
    colaborador: "João Silva",
    descricao: "Dificuldade para acessar a plataforma",
    status: "Resolvido",
    prioridade: "Alta",
    observacoes: "Problema resolvido em 2 horas"
  },
  {
    id: "2",
    data: "2025-01-15",
    polo: "Polo Rio de Janeiro",
    categoria: "Documentação",
    subcategoria: "Certificados",
    colaborador: "Maria Santos",
    descricao: "Solicitação de segunda via de certificado",
    status: "Em Andamento",
    prioridade: "Média",
    observacoes: "Aguardando validação"
  },
  {
    id: "3",
    data: "2025-01-14",
    polo: "Polo Belo Horizonte",
    categoria: "Financeiro",
    subcategoria: "Pagamentos",
    colaborador: "Carlos Oliveira",
    descricao: "Questão sobre parcelamento",
    status: "Pendente",
    prioridade: "Baixa",
    observacoes: "Cliente solicitou mais informações"
  },
  {
    id: "4",
    data: "2025-01-14",
    polo: "Polo São Paulo",
    categoria: "Suporte Técnico",
    subcategoria: "Login",
    colaborador: "Ana Costa",
    descricao: "Esqueceu a senha de acesso",
    status: "Resolvido",
    prioridade: "Média",
    observacoes: "Senha redefinida com sucesso"
  },
  {
    id: "5",
    data: "2025-01-13",
    polo: "Polo Brasília",
    categoria: "Pedagógico",
    subcategoria: "Curso",
    colaborador: "Roberto Lima",
    descricao: "Dúvidas sobre cronograma do curso",
    status: "Resolvido",
    prioridade: "Alta",
    observacoes: "Orientações enviadas por email"
  },
  {
    id: "6",
    data: "2025-01-13",
    polo: "Polo Salvador",
    categoria: "Documentação",
    subcategoria: "Histórico",
    colaborador: "Fernanda Souza",
    descricao: "Solicitação de histórico escolar",
    status: "Em Andamento",
    prioridade: "Média",
    observacoes: "Documentos em análise"
  },
  {
    id: "7",
    data: "2025-01-12",
    polo: "Polo Recife",
    categoria: "Suporte Técnico",
    subcategoria: "Vídeoaulas",
    colaborador: "Paulo Mendes",
    descricao: "Problemas para reproduzir vídeoaulas",
    status: "Resolvido",
    prioridade: "Alta",
    observacoes: "Problema de cache resolvido"
  },
  {
    id: "8",
    data: "2025-01-12",
    polo: "Polo São Paulo",
    categoria: "Financeiro",
    subcategoria: "Boletos",
    colaborador: "Luciana Torres",
    descricao: "Segunda via de boleto",
    status: "Resolvido",
    prioridade: "Baixa",
    observacoes: "Boleto reenviado"
  },
  {
    id: "9",
    data: "2025-01-11",
    polo: "Polo Fortaleza",
    categoria: "Pedagógico",
    subcategoria: "Avaliação",
    colaborador: "Marcos Ferreira",
    descricao: "Questões sobre critérios de avaliação",
    status: "Em Andamento",
    prioridade: "Média",
    observacoes: "Aguardando resposta da coordenação"
  },
  {
    id: "10",
    data: "2025-01-11",
    polo: "Polo Curitiba",
    categoria: "Suporte Técnico",
    subcategoria: "Mobile",
    colaborador: "Silvia Rodrigues",
    descricao: "App não funciona no celular",
    status: "Pendente",
    prioridade: "Alta",
    observacoes: "Encaminhado para equipe técnica"
  }
];

export function getCentralAtendimentoStats(data: CentralAtendimento[]) {
  const totalAtendimentos = data.length;
  
  const statusCount = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoriaCount = data.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const poloCount = data.reduce((acc, item) => {
    acc[item.polo] = (acc[item.polo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPolos = Object.entries(poloCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([polo, count]) => ({ polo, count }));

  const prioridadeCount = data.reduce((acc, item) => {
    if (item.prioridade) {
      acc[item.prioridade] = (acc[item.prioridade] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    totalAtendimentos,
    resolvidos: statusCount['Resolvido'] || 0,
    emAndamento: statusCount['Em Andamento'] || 0,
    pendentes: statusCount['Pendente'] || 0,
    categorias: Object.keys(categoriaCount).length,
    polos: Object.keys(poloCount).length,
    colaboradores: [...new Set(data.map(item => item.colaborador))].length,
    topPolos,
    categoriaCount,
    statusCount,
    prioridadeCount
  };
}