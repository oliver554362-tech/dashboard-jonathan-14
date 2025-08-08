import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getCentralAtendimentoStats, type CentralAtendimento } from "@/data/centralAtendimento";
import { Calendar, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parseISO, isWithinInterval, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface CentralAtendimentoChartsProps {
  data: CentralAtendimento[];
}

const COLORS = {
  'Suporte Técnico': '#8884d8',
  'Documentação': '#82ca9d',
  'Financeiro': '#ffc658',
  'Pedagógico': '#ff7300',
  'Outros': '#0088fe'
};

export function CentralAtendimentoCharts({ data }: CentralAtendimentoChartsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Filter data based on selected date or date range
  const filteredData = data.filter(item => {
    const itemDate = parseISO(item.data);
    
    if (dateRange?.from && dateRange?.to) {
      return isWithinInterval(itemDate, {
        start: startOfDay(dateRange.from),
        end: startOfDay(dateRange.to)
      });
    }
    
    if (selectedDate) {
      return startOfDay(itemDate).getTime() === startOfDay(selectedDate).getTime();
    }
    
    return true;
  });

  const stats = getCentralAtendimentoStats(filteredData);

  // Prepare data for Top 10 Polos chart
  const topPolosData = stats.topPolos.map(item => ({
    name: item.polo.replace('Polo ', ''),
    value: item.count,
    fullName: item.polo
  }));

  // Prepare data for Categories pie chart
  const categoriesData = Object.entries(stats.categoriaCount).map(([categoria, count]) => ({
    name: categoria,
    value: count,
    color: COLORS[categoria as keyof typeof COLORS] || COLORS.Outros
  }));

  // Get daily summary for current period
  const getDailySummary = () => {
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    const todayData = data.filter(item => item.data === todayString);
    
    return {
      hoje: todayData.length,
      semana: data.filter(item => {
        const itemDate = parseISO(item.data);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo && itemDate <= today;
      }).length,
      mes: data.filter(item => {
        const itemDate = parseISO(item.data);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= monthAgo && itemDate <= today;
      }).length
    };
  };

  const summary = getDailySummary();

  return (
    <div className="space-y-6">
      {/* Date Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros de Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Data Específica</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      "Selecionar período"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                    numberOfMonths={2}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedDate(undefined);
                setDateRange(undefined);
              }}
            >
              Limpar Filtros
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{summary.hoje}</div>
                <div className="text-sm text-muted-foreground">Hoje</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{summary.semana}</div>
                <div className="text-sm text-muted-foreground">Esta Semana</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{summary.mes}</div>
                <div className="text-sm text-muted-foreground">Este Mês</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top 10 Polos Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Polos com Mais Atendimentos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredData.length} atendimentos
            </p>
          </CardHeader>
          <CardContent>
            {topPolosData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPolosData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} atendimentos`, 
                      props.payload?.fullName || name
                    ]}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <p className="text-sm text-muted-foreground">
              {stats.categorias} categorias diferentes
            </p>
          </CardHeader>
          <CardContent>
            {categoriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoriesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status and Priority Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status dos Atendimentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.statusCount).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="font-medium">{status}</span>
                <Badge variant={
                  status === 'Resolvido' ? 'default' : 
                  status === 'Em Andamento' ? 'secondary' : 
                  'destructive'
                }>
                  {count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prioridades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.prioridadeCount).map(([prioridade, count]) => (
              <div key={prioridade} className="flex items-center justify-between">
                <span className="font-medium">{prioridade}</span>
                <Badge variant={
                  prioridade === 'Alta' ? 'destructive' : 
                  prioridade === 'Média' ? 'secondary' : 
                  'outline'
                }>
                  {count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}