import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCentralAtendimentoStats, type CentralAtendimento } from "@/data/centralAtendimento";
import { HeadphonesIcon, CheckCircle, Clock, AlertCircle, Users, Building, Hash } from "lucide-react";

interface CentralAtendimentoStatsOverviewProps {
  data: CentralAtendimento[];
}

export function CentralAtendimentoStatsOverview({ data }: CentralAtendimentoStatsOverviewProps) {
  const stats = getCentralAtendimentoStats(data);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <MetricCard
        title="Total de Atendimentos"
        value={stats.totalAtendimentos}
        icon={<HeadphonesIcon className="h-4 w-4" />}
      />
      
      <MetricCard
        title="Resolvidos"
        value={stats.resolvidos}
        icon={<CheckCircle className="h-4 w-4" />}
        className="text-green-600"
      />
      
      <MetricCard
        title="Em Andamento"
        value={stats.emAndamento}
        icon={<Clock className="h-4 w-4" />}
        className="text-yellow-600"
      />
      
      <MetricCard
        title="Pendentes"
        value={stats.pendentes}
        icon={<AlertCircle className="h-4 w-4" />}
        className="text-red-600"
      />

      <MetricCard
        title="Categorias"
        value={stats.categorias}
        icon={<Hash className="h-4 w-4" />}
      />
      
      <MetricCard
        title="Polos Ativos"
        value={stats.polos}
        icon={<Building className="h-4 w-4" />}
      />
      
      <MetricCard
        title="Colaboradores"
        value={stats.colaboradores}
        icon={<Users className="h-4 w-4" />}
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(stats.statusCount).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{status}</span>
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
    </div>
  );
}