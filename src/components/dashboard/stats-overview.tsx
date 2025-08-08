import { GraduationCap, Users, Building2, UserCheck, User } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMatriculasStats } from "@/data/matriculas";
import type { Matricula } from "@/data/matriculas";

interface StatsOverviewProps {
  data: Matricula[];
}

export function StatsOverview({ data }: StatsOverviewProps) {
  const stats = getMatriculasStats(data);

  return (
    <div className="space-y-8">
      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total de Matrículas"
          value={stats.totalMatriculas}
          icon={<GraduationCap className="h-5 w-5" />}
          variant="primary"
          trend={{ value: 15, isPositive: true }}
        />
        
        <MetricCard
          title="Plataformas Ativas"
          value={stats.totalPlataformas}
          icon={<Building2 className="h-5 w-5" />}
          variant="success"
        />
        
        <MetricCard
          title="Gestores"
          value={stats.totalGestores}
          icon={<UserCheck className="h-5 w-5" />}
          variant="default"
        />

        <MetricCard
          title="Colaboradores"
          value={stats.totalColaboradores}
          icon={<User className="h-5 w-5" />}
          variant="default"
        />
        
        <MetricCard
          title="Cancelamentos"
          value={stats.totalCancelamentos}
          icon={<Users className="h-5 w-5" />}
          variant="warning"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      {/* Card com lista de colaboradores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Colaboradores - Matrículas Registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.colaboradores.map((colaborador, index) => (
              <div key={index} className="p-4 border rounded-lg bg-card">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm leading-tight">{colaborador.nome}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {colaborador.totalMatriculas} matrícula{colaborador.totalMatriculas !== 1 ? 's' : ''}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {colaborador.plataformasUsadas.length} plataforma{colaborador.plataformasUsadas.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Plataformas: {colaborador.plataformasUsadas.slice(0, 2).join(', ')}
                    {colaborador.plataformasUsadas.length > 2 && ` +${colaborador.plataformasUsadas.length - 2}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}