import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from "recharts";
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

interface PublicChartsProps {
  data: any[];
  isLoading: boolean;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

export default function PublicCharts({ data, isLoading }: PublicChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum dado disponível para gráficos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dados por seção
  const sectionData = data.reduce((acc, item) => {
    const section = item._section || 'Outros';
    acc[section] = (acc[section] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sectionChartData = Object.entries(sectionData)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
    .sort((a, b) => (b.value as number) - (a.value as number));

  // Dados por status/tipo (se disponível)
  const statusField = data.find(item => item.Status || item.Tipo || item.Categoria)
    ? Object.keys(data[0] || {}).find(key => ['Status', 'Tipo', 'Categoria'].includes(key))
    : null;

  const statusData = statusField 
    ? data.reduce((acc, item) => {
        const status = item[statusField] || 'N/A';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};

  const statusChartData = Object.entries(statusData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 6); // Top 6

  // Dados por data (últimas 2 semanas)
  const dateField = data.find(item => item.Data || item['Data da análise'])
    ? Object.keys(data[0] || {}).find(key => ['Data', 'Data da análise'].includes(key))
    : null;

  const dateData = dateField 
    ? data.reduce((acc, item) => {
        const date = item[dateField];
        if (!date) return acc;
        
        try {
          const dateObj = new Date(date);
          const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
          acc[dateStr] = (acc[dateStr] || 0) + 1;
        } catch {
          // Data inválida, ignora
        }
        return acc;
      }, {} as Record<string, number>)
    : {};

  const sortedDates = Object.entries(dateData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14); // Últimas 2 semanas

  const timelineData = sortedDates.map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    value: count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Gráfico de Barras - Seções */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Por Seção
          </CardTitle>
          <CardDescription>
            Distribuição de registros por seção do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sectionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Status/Tipo */}
      {statusChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Por {statusField}
            </CardTitle>
            <CardDescription>
              Distribuição por {statusField?.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Linha - Timeline */}
      {timelineData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendência (14 dias)
            </CardTitle>
            <CardDescription>
              Evolução dos registros ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Card de fallback quando não há dados para status ou timeline */}
      {statusChartData.length === 0 && timelineData.length === 0 && (
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Gráficos adicionais aparecerão aqui quando mais dados estiverem disponíveis
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}