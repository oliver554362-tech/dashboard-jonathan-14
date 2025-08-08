import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PeriodIndicatorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  className?: string;
}

export function PeriodIndicator({ startDate, endDate, className }: PeriodIndicatorProps) {
  const formatPeriod = () => {
    if (!startDate && !endDate) {
      return "Todos os dados";
    }
    if (startDate && !endDate) {
      return `A partir de ${format(startDate, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    if (!startDate && endDate) {
      return `Até ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    if (startDate && endDate) {
      if (startDate.getTime() === endDate.getTime()) {
        return `${format(startDate, "dd/MM/yyyy", { locale: ptBR })}`;
      }
      return `${format(startDate, "dd/MM/yyyy", { locale: ptBR })} a ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`;
    }
    return "Todos os dados";
  };

  return (
    <Badge 
      variant="secondary" 
      className={`inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border-primary/20 ${className || ''}`}
    >
      <Calendar className="h-3 w-3" />
      <span className="text-sm font-medium">
        Período selecionado: {formatPeriod()}
      </span>
    </Badge>
  );
}