import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar,
  Database,
  BarChart3
} from "lucide-react";

interface PublicKPIsProps {
  data: any[];
  isLoading: boolean;
}

export default function PublicKPIs({ data, isLoading }: PublicKPIsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-10 w-10 bg-muted rounded-lg mb-3"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Cálculo dos KPIs
  const totalRecords = data.length;
  
  // Registros únicos por seção
  const sectionCounts = data.reduce((acc, item) => {
    const section = item._section || 'Outros';
    acc[section] = (acc[section] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Registros dos últimos 7 dias
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentRecords = data.filter(item => {
    const itemDate = item.Data || item['Data da análise'];
    if (!itemDate) return false;
    
    try {
      const date = new Date(itemDate);
      return date >= sevenDaysAgo;
    } catch {
      return false;
    }
  }).length;

  // Principais categorias/tipos
  const categoryField = data.find(item => item.Tipo || item.Status || item.Categoria)
    ? Object.keys(data[0]).find(key => ['Tipo', 'Status', 'Categoria', 'Atividade'].includes(key))
    : null;
  
  const categoryCount = categoryField 
    ? new Set(data.map(item => item[categoryField]).filter(Boolean)).size
    : 0;

  // Top seção
  const topSection = Object.entries(sectionCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number))[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total de Registros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalRecords.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total de Registros</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registros Recentes */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{recentRecords}</p>
              <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seções Ativas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Object.keys(sectionCounts).length}</p>
              <p className="text-sm text-muted-foreground">Seções Ativas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorias */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{categoryCount || '-'}</p>
              <p className="text-sm text-muted-foreground">
                {categoryField ? `${categoryField}s Diferentes` : 'Categorias'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Seção */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Distribuição por Seção</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(sectionCounts)
                .sort((a, b) => (b[1] as number) - (a[1] as number))
                .map(([section, count]) => (
                  <div key={section} className="text-center p-3 border rounded-lg">
                    <p className="text-lg font-bold">{String(count)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{section}</p>
                    {section === topSection?.[0] && (
                      <Badge variant="secondary" className="mt-1 text-xs">Top</Badge>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}