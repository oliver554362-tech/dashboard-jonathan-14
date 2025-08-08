import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
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

interface SecretariaChartsProps {
  data: SecretariaData[] | SectionData[];
}

export function SecretariaCharts({ data }: SecretariaChartsProps) {
  // Converter dados para formato unificado
  const convertedData = data.map(convertToSecretariaFormat);
  
  // Dados para gráfico de atividades
  const atividadesCount = convertedData.reduce((acc, item) => {
    acc[item.atividade] = (acc[item.atividade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const atividadesData = Object.entries(atividadesCount).map(([atividade, count]) => ({
    name: atividade,
    value: count
  }));

  // Dados para gráfico de plataformas
  const plataformasCount = convertedData.reduce((acc, item) => {
    acc[item.plataforma] = (acc[item.plataforma] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const plataformasData = Object.entries(plataformasCount).map(([plataforma, count]) => ({
    name: plataforma,
    value: count
  }));

  // Dados para gráfico de níveis de ensino
  const niveisCount = convertedData.reduce((acc, item) => {
    acc[item.nivel_ensino] = (acc[item.nivel_ensino] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const niveisData = Object.entries(niveisCount).map(([nivel, count]) => ({
    name: nivel,
    count
  }));

  // Cores para os gráficos
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Atividades */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={atividadesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {atividadesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Plataformas */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Plataformas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={plataformasData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {plataformasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Níveis de Ensino */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribuição por Níveis de Ensino</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={niveisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}