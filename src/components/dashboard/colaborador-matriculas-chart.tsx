import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, CalendarDays, Clock, Calendar, TrendingUp, Filter, BarChart3 } from "lucide-react";
import { Matricula } from "@/data/matriculas";

interface ColaboradorMatriculasChartProps {
  data: Matricula[];
}

type TimePeriod = "total" | "day" | "week" | "month";

export function ColaboradorMatriculasChart({ data }: ColaboradorMatriculasChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("total");
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>("all");

  // Get unique collaborators for the filter
  const collaborators = useMemo(() => {
    const uniqueCollaborators = Array.from(
      new Set(data.filter(m => m.Atividade === "Matricula").map(m => m.Colaborador))
    ).filter(collaborator => collaborator && collaborator.trim() !== '').sort();
    return uniqueCollaborators;
  }, [data]);

  const getStatsData = () => {
    const matriculas = data.filter(m => m.Atividade === "Matricula");
    const today = new Date();
    
    // Matrículas hoje
    const todayCount = matriculas.filter(m => {
      const [day, month, year] = m.Data.split('/');
      const matriculaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return matriculaDate.toDateString() === today.toDateString();
    }).length;

    // Matrículas esta semana
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const weekCount = matriculas.filter(m => {
      const [day, month, year] = m.Data.split('/');
      const matriculaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return matriculaDate >= startOfWeek && matriculaDate <= today;
    }).length;

    // Matrículas este mês
    const monthCount = matriculas.filter(m => {
      const [day, month, year] = m.Data.split('/');
      const matriculaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return matriculaDate.getMonth() === today.getMonth() && 
             matriculaDate.getFullYear() === today.getFullYear();
    }).length;

    return { todayCount, weekCount, monthCount };
  };

  const getChartData = () => {
    const matriculas = data.filter(m => m.Atividade === "Matricula");
    
    if (selectedCollaborator === "all") {
      // Dados dos últimos 7 dias
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayMatriculas = matriculas.filter(m => {
          const [day, month, year] = m.Data.split('/');
          const matriculaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          return matriculaDate.toDateString() === date.toDateString();
        }).length;
        
        last7Days.push({
          day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          matriculas: dayMatriculas
        });
      }
      return last7Days;
    } else {
      // Dados do colaborador específico por dia da semana
      const colaboradorMatriculas = matriculas.filter(m => m.Colaborador === selectedCollaborator);
      const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      
      const weekData = weekdays.map(day => ({
        day,
        matriculas: 0
      }));
      
      colaboradorMatriculas.forEach(m => {
        const [day, month, year] = m.Data.split('/');
        const matriculaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const dayOfWeek = matriculaDate.getDay();
        weekData[dayOfWeek].matriculas++;
      });
      
      return weekData;
    }
  };

  const statsData = getStatsData();
  const chartData = getChartData();

  return (
    <div className="space-y-6">
      {/* Header com seletor de colaborador */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Estatísticas de Matrículas
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedCollaborator === "all" ? "Visão geral do sistema" : `Performance de ${selectedCollaborator}`}
            </p>
          </div>
        </div>
        
        <Select value={selectedCollaborator} onValueChange={setSelectedCollaborator}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecionar colaborador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os colaboradores</SelectItem>
            {collaborators.map((collaborator) => (
              <SelectItem key={collaborator} value={collaborator}>
                {collaborator}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Matrículas Hoje</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{statsData.todayCount}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Matrículas Esta Semana</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{statsData.weekCount}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Matrículas Este Mês</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{statsData.monthCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico principal */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {selectedCollaborator === "all" ? "Matrículas dos Últimos 7 Dias" : `Distribuição Semanal - ${selectedCollaborator}`}
          </CardTitle>
          <CardDescription>
            {selectedCollaborator === "all" 
              ? "Evolução diária das matrículas registradas" 
              : "Matrículas por dia da semana do colaborador selecionado"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer
            config={{
              matriculas: {
                label: "Matrículas",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              {selectedCollaborator === "all" ? (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg"
                        formatter={(value) => [value, "Matrículas"]}
                      />
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="matriculas" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg"
                        formatter={(value) => [value, "Matrículas"]}
                      />
                    }
                  />
                  <Bar 
                    dataKey="matriculas" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
          
          {chartData.every(item => item.matriculas === 0) && (
            <div className="text-center py-8">
              <div className="p-4 rounded-full bg-muted/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg font-medium">
                Nenhuma matrícula encontrada
              </p>
              <p className="text-muted-foreground/70 text-sm mt-1">
                {selectedCollaborator === "all" 
                  ? "Não há dados para os últimos 7 dias"
                  : `${selectedCollaborator} não possui matrículas registradas`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}