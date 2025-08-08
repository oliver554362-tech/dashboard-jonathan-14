export interface Section {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const SECTIONS: Section[] = [
  {
    id: 'matriculas',
    name: 'Matrículas',
    icon: 'GraduationCap',
    description: 'Gestão de matrículas e cursos'
  },
  {
    id: 'atendimento',
    name: 'Atendimento',
    icon: 'Headphones',
    description: 'Central de atendimento ao cliente'
  },
  {
    id: 'central-licenciados',
    name: 'Central de Atendimento aos Licenciados',
    icon: 'Users',
    description: 'Atendimento especializado para licenciados'
  },
  {
    id: 'secretaria',
    name: 'Secretaria Acadêmica',
    icon: 'FileText',
    description: 'Documentação e processos acadêmicos'
  },
  {
    id: 'pedagogia',
    name: 'Pedagogia',
    icon: 'BookOpen',
    description: 'Coordenação pedagógica e metodológica'
  },
  {
    id: 'certificacao',
    name: 'Certificação',
    icon: 'Award',
    description: 'Emissão e controle de certificados'
  },
  {
    id: 'competencia',
    name: 'Competência',
    icon: 'Target',
    description: 'Avaliação de competências e habilidades'
  },
  {
    id: 'ouvidoria',
    name: 'Ouvidoria',
    icon: 'MessageSquare',
    description: 'Canal de comunicação e feedback'
  }
];