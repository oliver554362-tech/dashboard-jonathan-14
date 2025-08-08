import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Headphones, Calendar, TrendingUp, Users } from "lucide-react";
import { atendimentoData } from "@/data/atendimento";

interface AtendimentoStatsOverviewProps {
  data: any[];
}

export function AtendimentoStatsOverview({ data }: AtendimentoStatsOverviewProps) {
  // Usar dados locais se não houver dados sincronizados
  const currentData = data.length > 0 ? data : Object.values(atendimentoData).flat();

  // Calcular estatísticas
  const totalAtendimentos = currentData.length;
  const totalPolos = new Set(currentData.map(item => item.POLOS)).size;
  
  // Calcular totais por categoria
  const categorias = ['CERTIFICADOS', 'DOCUMENTOS', 'PLATAFORMA', 'TRABALHOS', 'UNIMAIS', 'PROVA', 'CANCELAMENTO'];
  const totaisPorCategoria = categorias.reduce((acc, categoria) => {
    acc[categoria] = currentData.reduce((sum, item) => {
      const valor = parseFloat(item[categoria] || '0');
      return sum + valor;
    }, 0);
    return acc;
  }, {} as Record<string, number>);

  const totalAlunos = currentData.reduce((sum, item) => {
    const valor = parseFloat(item.ALUNO || '0');
    return sum + valor;
  }, 0);

  // Categoria mais demandada
  const categoriaMaisDemandada = Object.entries(totaisPorCategoria)
    .reduce((max, [categoria, total]) => total > max.total ? { categoria, total } : max, 
    { categoria: 'CERTIFICADOS', total: 0 });

  const stats = [
    {
      title: "Total de Atendimentos",
      value: totalAtendimentos.toString(),
      description: "Registros de atendimento",
      icon: Headphones,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Polos Ativos",
      value: totalPolos.toString(),
      description: "Polos com atendimentos",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total de Alunos",
      value: totalAlunos.toString(),
      description: "Alunos atendidos",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Categoria Principal",
      value: categoriaMaisDemandada.categoria,
      description: `${categoriaMaisDemandada.total} atendimentos`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
      
      {/* Cards por categoria */}
      <div className="md:col-span-2 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atendimentos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {categorias.map((categoria) => (
                <div key={categoria} className="text-center">
                  <Badge 
                    variant="outline" 
                    className="mb-1 text-xs"
                  >
                    {categoria}
                  </Badge>
                  <div className="text-lg font-semibold text-primary">
                    {totaisPorCategoria[categoria]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}