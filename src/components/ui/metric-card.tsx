import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  trend,
  variant = 'default',
  className 
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-gradient-card hover:shadow-card-hover border-border",
    primary: "bg-gradient-primary text-primary-foreground hover:shadow-primary border-primary/20",
    success: "bg-gradient-success text-success-foreground hover:shadow-card-hover border-success/20",
    warning: "bg-gradient-warning text-warning-foreground hover:shadow-card-hover border-warning/20"
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:scale-105 border shadow-card",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === 'default' ? "text-muted-foreground" : "text-current opacity-90"
            )}>
              {title}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{value}</span>
              {trend && (
                <span className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  trend.isPositive ? "text-success" : "text-destructive",
                  variant !== 'default' && "text-current opacity-80"
                )}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className={cn(
              "p-3 rounded-lg",
              variant === 'default' ? "bg-primary/10 text-primary" : "bg-white/20 text-current"
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}