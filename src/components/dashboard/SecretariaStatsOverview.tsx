import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCheck, XCircle, CheckCircle, TrendingUp } from "lucide-react";
import { SecretariaData } from "@/data/secretaria";
import { SectionData } from "@/services/GoogleSheetsService";

// Helper para converter SectionData para formato compatível
const convertToSecretariaFormat = (item: SectionData | SecretariaData): SecretariaData => {
  if ('Aluno' in item) {
    // É SectionData, converter
    return {
      colaborador: item.Colaborador || '',
      aluno: item.Aluno || '',
      atividade: item.Atividade || '',
      plataforma: item.Plataforma || '',
      nivel_ensino: item['Nível de ensino'] || '',
      curso: item.Curso || null,
      data_analise: item['Data'] || null,
      observacoes: item['Observações'] || null,
    };
  }
  // Já é SecretariaData
  return item as SecretariaData;
};

interface SecretariaStatsOverviewProps {
  data: SecretariaData[] | SectionData[];
}

export function SecretariaStatsOverview({ data }: SecretariaStatsOverviewProps) {
  // Converter dados para formato unificado
  const convertedData = data.map(convertToSecretariaFormat);
  
  const totalRegistros = convertedData.length;
  const uniqueAlunos = new Set(convertedData.map(item => item.aluno)).size;
  const uniqueColaboradores = new Set(convertedData.map(item => item.colaborador)).size;
  
  // Contar atividades
  const aprovados = convertedData.filter(item => item.atividade?.includes("Aprovado")).length;
  const negados = convertedData.filter(item => item.atividade?.includes("Negado")).length;
  const validacoes = convertedData.filter(item => item.atividade?.includes("Validação")).length;
  const certificados = convertedData.filter(item => item.atividade?.includes("certificadora")).length;

  const stats = [
    {
      title: "Total de Registros",
      value: totalRegistros,
      icon: FileCheck,
      description: "Processos em andamento"
    },
    {
      title: "Alunos Únicos",
      value: uniqueAlunos,
      icon: Users,
      description: "Estudantes atendidos"
    },
    {
      title: "Colaboradores",
      value: uniqueColaboradores,
      icon: TrendingUp,
      description: "Equipe ativa"
    },
    {
      title: "Aprovados",
      value: aprovados,
      icon: CheckCircle,
      description: "Triagens aprovadas"
    },
    {
      title: "Negados",
      value: negados,
      icon: XCircle,
      description: "Triagens negadas"
    },
    {
      title: "Validações",
      value: validacoes,
      icon: FileCheck,
      description: "Documentos em análise"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}