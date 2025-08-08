import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { Matricula } from "@/data/matriculas";

interface PlatformChartProps {
  data: Matricula[];
}

export function PlatformChart({ data }: PlatformChartProps) {
  const platformStats = data.reduce((acc, curr) => {
    if (curr.Atividade === 'Matricula') {
      acc[curr.Plataforma] = (acc[curr.Plataforma] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedPlatforms = Object.entries(platformStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const maxValue = Math.max(...sortedPlatforms.map(([,count]) => count));

  const getPlatformColor = (index: number) => {
    const colors = [
      "bg-primary",
      "bg-accent", 
      "bg-success",
      "bg-warning",
      "bg-destructive",
      "bg-secondary",
      "bg-muted",
      "bg-primary/70"
    ];
    return colors[index] || "bg-muted";
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Matrículas por Plataforma
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPlatforms.map(([platform, count], index) => (
            <div key={platform} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{platform}</span>
                <span className="text-sm text-muted-foreground">{count}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getPlatformColor(index)}`}
                  style={{ width: `${(count / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {sortedPlatforms.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma matrícula encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  );
}