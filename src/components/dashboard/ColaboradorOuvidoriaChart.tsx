import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { OuvidoriaData } from "@/data/ouvidoria";
import { MessageSquare, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";

interface ColaboradorOuvidoriaChartProps {
  data: OuvidoriaData[];
}

export function ColaboradorOuvidoriaChart({ data }: ColaboradorOuvidoriaChartProps) {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month'>('week');
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("all");

  const collaborators = useMemo(() => {
    const uniqueCollaborators = Array.from(new Set(data.map(item => item.Colaborador)))
      .filter(collaborator => collaborator && collaborator.trim() !== '');
    return uniqueCollaborators.sort();
  }, [data]);

  const getStatsData = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const filteredData = selectedCollaborator === "all" 
      ? data 
      : data.filter(item => item.Colaborador === selectedCollaborator);

    const todayCount = filteredData.filter(item => {
      const itemDate = new Date(item["Data "]);
      return !isNaN(itemDate.getTime()) && itemDate >= today;
    }).length;

    const weekCount = filteredData.filter(item => {
      const itemDate = new Date(item["Data "]);
      return !isNaN(itemDate.getTime()) && itemDate >= weekAgo;
    }).length;

    const monthCount = filteredData.filter(item => {
      const itemDate = new Date(item["Data "]);
      return !isNaN(itemDate.getTime()) && itemDate >= monthAgo;
    }).length;

    return { todayCount, weekCount, monthCount };
  };

  const getChartData = () => {
    const filteredData = selectedCollaborator === "all" 
      ? data 
      : data.filter(item => item.Colaborador === selectedCollaborator);

    if (selectedCollaborator === "all") {
      // Dados dos últimos 7 dias
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayData = filteredData.filter(item => {
          const itemDate = new Date(item["Data "]);
          if (isNaN(itemDate.getTime())) return false; // Skip invalid dates
          const itemDateStr = itemDate.toISOString().split('T')[0];
          return itemDateStr === dateStr;
        });

        last7Days.push({
          day: date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
          ocorrencias: dayData.length,
          resolvidas: dayData.filter(item => item.STATUS === "RESOLVIDO" || item.STATUS === "IMPLEMENTADO").length,
          emAndamento: dayData.filter(item => item.STATUS === "EM ANÁLISE" || item.STATUS === "AGUARDANDO VERIFICAÇÃO DO SETOR").length
        });
      }
      return last7Days;
    } else {
      // Dados por dia da semana para colaborador específico
      const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const weekData = daysOfWeek.map((day, index) => {
        const dayData = filteredData.filter(item => {
          const itemDate = new Date(item["Data "]);
          return !isNaN(itemDate.getTime()) && itemDate.getDay() === index;
        });

        return {
          day,
          ocorrencias: dayData.length,
          resolvidas: dayData.filter(item => item.STATUS === "RESOLVIDO" || item.STATUS === "IMPLEMENTADO").length,
          emAndamento: dayData.filter(item => item.STATUS === "EM ANÁLISE" || item.STATUS === "AGUARDANDO VERIFICAÇÃO DO SETOR").length
        };
      });
      return weekData;
    }
  };

  const { todayCount, weekCount, monthCount } = getStatsData();
  const chartData = getChartData();

  const chartConfig = {
    ocorrencias: {
      label: "Ocorrências",
      color: "hsl(var(--primary))",
    },
    resolvidas: {
      label: "Resolvidas",
      color: "hsl(142, 76%, 36%)",
    },
    emAndamento: {
      label: "Em Andamento",
      color: "hsl(38, 92%, 50%)",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header com seletor */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Atividades da Ouvidoria por Colaborador
          </h2>
          <p className="text-muted-foreground">
            {selectedCollaborator === "all" ? "Todos os colaboradores" : selectedCollaborator}
          </p>
        </div>
        
        <Select value={selectedCollaborator} onValueChange={setSelectedCollaborator}>
          <SelectTrigger className="w-full md:w-64 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800">
            <SelectValue placeholder="Selecione um colaborador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os colaboradores</SelectItem>
            {collaborators.map(collaborator => (
              <SelectItem key={collaborator} value={collaborator}>
                {collaborator}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Hoje"
          value={todayCount.toString()}
          icon={<MessageSquare className="h-4 w-4" />}
          variant="primary"
          trend={{ value: 0, isPositive: true }}
        />
        
        <MetricCard
          title="Esta Semana"
          value={weekCount.toString()}
          icon={<Clock className="h-4 w-4" />}
          variant="default"
          trend={{ value: 0, isPositive: true }}
        />
        
        <MetricCard
          title="Este Mês"
          value={monthCount.toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          variant="success"
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {/* Gráfico */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            {selectedCollaborator === "all" 
              ? "Tendência de Ocorrências (Últimos 7 dias)" 
              : `Atividades de ${selectedCollaborator} por Dia da Semana`
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedCollaborator === "all" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="ocorrencias" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolvidas" 
                      stroke="hsl(142, 76%, 36%)" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="emAndamento" 
                      stroke="hsl(38, 92%, 50%)" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(38, 92%, 50%)", strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="ocorrencias" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="resolvidas" 
                      fill="hsl(142, 76%, 36%)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="emAndamento" 
                      fill="hsl(38, 92%, 50%)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
              <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhuma ocorrência encontrada</p>
              <p className="text-sm">
                {selectedCollaborator === "all" 
                  ? "Não há dados para exibir no período selecionado" 
                  : `${selectedCollaborator} não possui ocorrências registradas`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}