import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import type { Matricula } from "@/data/matriculas";

interface CoursesRankingProps {
  data: Matricula[];
}

export function CoursesRanking({ data }: CoursesRankingProps) {
  const courseStats = data.reduce((acc, curr) => {
    if (curr.Atividade === 'Matricula') {
      acc[curr.Curso] = (acc[curr.Curso] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCourses = Object.entries(courseStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-warning" />;
    if (index === 1) return <Medal className="h-4 w-4 text-muted-foreground" />;
    if (index === 2) return <Award className="h-4 w-4 text-warning/70" />;
    return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-warning text-warning-foreground";
    if (index === 1) return "bg-muted text-muted-foreground";
    if (index === 2) return "bg-warning/70 text-warning-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Cursos Mais Procurados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topCourses.map(([course, count], index) => (
            <div 
              key={course} 
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>
                <span className="text-sm font-medium truncate" title={course}>
                  {course}
                </span>
              </div>
              <Badge className={getRankColor(index)}>
                {count} matrícula{count !== 1 ? 's' : ''}
              </Badge>
            </div>
          ))}
        </div>
        
        {topCourses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum curso encontrado.
          </div>
        )}
      </CardContent>
    </Card>
  );
}