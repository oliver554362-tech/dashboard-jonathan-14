import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { atendimentoData } from "@/data/atendimento";

interface AtendimentoChartsProps {
  data: any[];
}

const COLORS = {
  CERTIFICADOS: '#3b82f6',
  DOCUMENTOS: '#10b981',
  PLATAFORMA: '#8b5cf6',
  TRABALHOS: '#f59e0b',
  UNIMAIS: '#6366f1',
  PROVA: '#ec4899',
  CANCELAMENTO: '#ef4444'
};

export function AtendimentoCharts({ data }: AtendimentoChartsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'hoje' | 'semana' | 'mes'>('mes');
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
  
  // Usar dados locais se não houver dados sincronizados
  const currentData = data.length > 0 ? data : Object.values(atendimentoData).flat();

  // Preparar dados para gráficos por período
  const getPeriodData = () => {
    const periodData: { [key: string]: any } = {};
    
    Object.entries(atendimentoData).forEach(([date, records]) => {
      const totals = {
        DATA: date,
        CERTIFICADOS: 0,
        DOCUMENTOS: 0,
        PLATAFORMA: 0,
        TRABALHOS: 0,
        UNIMAIS: 0,
        PROVA: 0,
        CANCELAMENTO: 0,
        TOTAL_ALUNOS: 0
      };
      
      records.forEach(record => {
        Object.keys(totals).forEach(key => {
          if (key !== 'DATA' && key !== 'TOTAL_ALUNOS') {
            totals[key] += parseFloat(record[key] || '0');
          }
        });
        totals.TOTAL_ALUNOS += parseFloat(record.ALUNO || '0');
      });
      
      periodData[date] = totals;
    });
    
    return Object.values(periodData);
  };

  // Dados para gráfico de distribuição por categoria
  const getCategoryData = () => {
    const categories = ['CERTIFICADOS', 'DOCUMENTOS', 'PLATAFORMA', 'TRABALHOS', 'UNIMAIS', 'PROVA', 'CANCELAMENTO'];
    
    return categories.map(category => {
      const total = currentData.reduce((sum, item) => {
        return sum + parseFloat(item[category] || '0');
      }, 0);
      
      return {
        name: category,
        value: total,
        color: COLORS[category as keyof typeof COLORS]
      };
    }).filter(item => item.value > 0);
  };

  // Top 10 polos com mais atendimentos
  const getTopPolos = () => {
    const polosMap: { [key: string]: number } = {};
    
    currentData.forEach(item => {
      const total = ['CERTIFICADOS', 'DOCUMENTOS', 'PLATAFORMA', 'TRABALHOS', 'UNIMAIS', 'PROVA', 'CANCELAMENTO']
        .reduce((sum, category) => sum + parseFloat(item[category] || '0'), 0);
      
      if (polosMap[item.POLOS]) {
        polosMap[item.POLOS] += total;
      } else {
        polosMap[item.POLOS] = total;
      }
    });
    
    return Object.entries(polosMap)
      .map(([polo, total]) => ({ polo, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  };

  const periodData = getPeriodData();
  const categoryData = getCategoryData();
  const topPolos = getTopPolos();

  // Cards de estatísticas por período
  const getPeriodStats = () => {
    const now = new Date();
    const today = now.getDate().toString().padStart(2, '0') + (now.getMonth() + 1).toString().padStart(2, '0');
    
    const todayData = periodData.find(d => d.DATA === today) || {};
    const weekData = periodData.slice(-7);
    const monthData = periodData;

    const calculateTotals = (data: any[]) => {
      return data.reduce((acc, item) => {
        acc.total += (item.CERTIFICADOS || 0) + (item.DOCUMENTOS || 0) + (item.PLATAFORMA || 0) + 
                   (item.TRABALHOS || 0) + (item.UNIMAIS || 0) + (item.PROVA || 0) + (item.CANCELAMENTO || 0);
        acc.alunos += item.TOTAL_ALUNOS || 0;
        return acc;
      }, { total: 0, alunos: 0 });
    };

    const todayStats = { total: Object.values(todayData).slice(1, -1).reduce((a: any, b: any) => a + b, 0), alunos: todayData.TOTAL_ALUNOS || 0 };
    const weekStats = calculateTotals(weekData);
    const monthStats = calculateTotals(monthData);

    return { today: todayStats, week: weekStats, month: monthStats };
  };

  const periodStats = getPeriodStats();

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas por período */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            period: 'hoje', 
            title: 'Hoje', 
            stats: periodStats.today, 
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          { 
            period: 'semana', 
            title: 'Esta Semana', 
            stats: periodStats.week, 
            icon: BarChart3,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          { 
            period: 'mes', 
            title: 'Este Mês', 
            stats: periodStats.month, 
            icon: PieChartIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ].map(({ period, title, stats, icon: Icon, color, bgColor }) => (
          <Card 
            key={period}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedPeriod === period ? 'ring-2 ring-primary shadow-md' : ''
            }`}
            onClick={() => setSelectedPeriod(period as 'hoje' | 'semana' | 'mes')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <div className={`p-2 rounded-lg ${bgColor}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.alunos} alunos atendidos
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico temporal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Atendimentos por Data
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                >
                  Barras
                </Button>
                <Button
                  variant={chartType === 'line' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('line')}
                >
                  Linha
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'bar' ? (
                <BarChart data={periodData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="DATA" 
                    fontSize={12}
                    tickFormatter={(value) => `${value.slice(0,2)}/${value.slice(2,4)}`}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => `Data: ${value.slice(0,2)}/${value.slice(2,4)}`}
                  />
                  <Bar dataKey="CERTIFICADOS" fill={COLORS.CERTIFICADOS} name="Certificados" />
                  <Bar dataKey="DOCUMENTOS" fill={COLORS.DOCUMENTOS} name="Documentos" />
                  <Bar dataKey="PLATAFORMA" fill={COLORS.PLATAFORMA} name="Plataforma" />
                </BarChart>
              ) : (
                <LineChart data={periodData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="DATA" 
                    fontSize={12}
                    tickFormatter={(value) => `${value.slice(0,2)}/${value.slice(2,4)}`}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => `Data: ${value.slice(0,2)}/${value.slice(2,4)}`}
                  />
                  <Line type="monotone" dataKey="TOTAL_ALUNOS" stroke={COLORS.CERTIFICADOS} name="Total Alunos" strokeWidth={3} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Polos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Top 10 Polos com Mais Atendimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topPolos} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" fontSize={12} />
              <YAxis 
                dataKey="polo" 
                type="category" 
                fontSize={12} 
                width={200}
                tickFormatter={(value) => value.length > 25 ? `${value.slice(0, 25)}...` : value}
              />
              <Tooltip />
              <Bar dataKey="total" fill={COLORS.CERTIFICADOS} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}