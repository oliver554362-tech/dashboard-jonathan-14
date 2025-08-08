import { useState, useEffect } from "react";
import { Calendar, CalendarIcon, X, Check, AlertTriangle } from "lucide-react";
import { format, isValid, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeFilterProps {
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangeFilter({ onDateRangeChange, className }: DateRangeFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [inputErrors, setInputErrors] = useState<{
    from?: string;
    to?: string;
    range?: string;
  }>({});
  const [manualInput, setManualInput] = useState({
    from: "",
    to: ""
  });

  // Restaurar filtro persistente ao carregar
  useEffect(() => {
    const savedFilter = localStorage.getItem('dashboard_dateFilter');
    if (savedFilter) {
      try {
        const parsed = JSON.parse(savedFilter);
        if (parsed.from || parsed.to) {
          const range = {
            from: parsed.from ? new Date(parsed.from) : undefined,
            to: parsed.to ? new Date(parsed.to) : undefined,
          };
          setDateRange(range);
          setManualInput({
            from: range.from ? format(range.from, "dd/MM/yyyy") : "",
            to: range.to ? format(range.to, "dd/MM/yyyy") : ""
          });
        }
      } catch (error) {
        console.warn('Erro ao restaurar filtro de data:', error);
      }
    }
  }, []);

  // Validar entrada de data manual
  const parseManualDate = (input: string): Date | null => {
    if (!input.trim()) return null;
    
    // Aceitar diferentes formatos: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
    const cleanInput = input.replace(/[-\.]/g, '/');
    const parts = cleanInput.split('/');
    
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
    const year = parseInt(parts[2], 10);
    
    // Validar ranges básicos
    if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) {
      return null;
    }
    
    const date = new Date(year, month, day);
    
    // Verificar se a data é válida (ex: 32/13/2025 seria inválida)
    if (!isValid(date) || 
        date.getDate() !== day || 
        date.getMonth() !== month || 
        date.getFullYear() !== year) {
      return null;
    }
    
    return date;
  };

  // Validar range de datas
  const validateDateRange = (from?: Date, to?: Date): string | null => {
    if (from && to && isBefore(to, from)) {
      return "A Data Fim não pode ser menor que a Data Início.";
    }
    return null;
  };

  const handleDateRangeChange = (range: DateRange, skipValidation = false) => {
    if (!skipValidation) {
      const rangeError = validateDateRange(range.from, range.to);
      if (rangeError) {
        setInputErrors(prev => ({ ...prev, range: rangeError }));
        toast.error(rangeError);
        return;
      }
    }
    
    setDateRange(range);
    setInputErrors({});
    onDateRangeChange(range);
    
    // Persistir filtro no localStorage
    const filterData = {
      from: range.from?.toISOString(),
      to: range.to?.toISOString()
    };
    localStorage.setItem('dashboard_dateFilter', JSON.stringify(filterData));
  };

  const handleFromDateChange = (date: Date | undefined) => {
    const newRange = { ...dateRange, from: date };
    setManualInput(prev => ({ 
      ...prev, 
      from: date ? format(date, "dd/MM/yyyy") : "" 
    }));
    handleDateRangeChange(newRange);
  };

  const handleToDateChange = (date: Date | undefined) => {
    const newRange = { ...dateRange, to: date };
    setManualInput(prev => ({ 
      ...prev, 
      to: date ? format(date, "dd/MM/yyyy") : "" 
    }));
    handleDateRangeChange(newRange);
  };

  const handleManualInputChange = (field: 'from' | 'to', value: string) => {
    setManualInput(prev => ({ ...prev, [field]: value }));
    
    const parsedDate = parseManualDate(value);
    
    if (value.trim() === "") {
      // Campo vazio - limpar
      const newRange = { ...dateRange, [field]: undefined };
      handleDateRangeChange(newRange, true);
      setInputErrors(prev => ({ ...prev, [field]: undefined }));
    } else if (parsedDate) {
      // Data válida
      const newRange = { ...dateRange, [field]: parsedDate };
      handleDateRangeChange(newRange);
      setInputErrors(prev => ({ ...prev, [field]: undefined }));
    } else {
      // Data inválida
      setInputErrors(prev => ({ 
        ...prev, 
        [field]: "Data inválida. Use o formato DD/MM/AAAA." 
      }));
    }
  };

  const applyFilter = () => {
    const errors: typeof inputErrors = {};
    
    // Validar campos de entrada
    if (manualInput.from && !parseManualDate(manualInput.from)) {
      errors.from = "Data inválida. Use o formato DD/MM/AAAA.";
    }
    if (manualInput.to && !parseManualDate(manualInput.to)) {
      errors.to = "Data inválida. Use o formato DD/MM/AAAA.";
    }
    
    const rangeError = validateDateRange(dateRange.from, dateRange.to);
    if (rangeError) {
      errors.range = rangeError;
    }
    
    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }
    
    setInputErrors({});
    onDateRangeChange(dateRange);
    toast.success("Filtro de período aplicado com sucesso!");
  };

  const clearFilters = () => {
    const newRange = { from: undefined, to: undefined };
    setDateRange(newRange);
    setManualInput({ from: "", to: "" });
    setInputErrors({});
    onDateRangeChange(newRange);
    
    // Limpar persistência
    localStorage.removeItem('dashboard_dateFilter');
    toast.success("Filtros de período removidos!");
  };

  const hasActiveFilter = dateRange.from || dateRange.to;
  const hasErrors = Object.keys(inputErrors).length > 0;

  return (
    <Card className={cn(
      "p-6 mb-6 border shadow-lg",
      hasActiveFilter 
        ? "bg-gradient-to-r from-primary/10 to-primary/15 border-primary/30" 
        : "bg-gradient-to-r from-muted/30 to-muted/50 border-muted",
      hasErrors && "border-destructive/50",
      className
    )}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className={cn(
              "h-5 w-5",
              hasActiveFilter ? "text-primary" : "text-muted-foreground"
            )} />
            <h3 className={cn(
              "text-lg font-semibold",
              hasActiveFilter ? "text-primary" : "text-foreground"
            )}>
              Filtro de Período
            </h3>
            {hasActiveFilter && (
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                <Check className="h-3 w-3" />
                Ativo
              </div>
            )}
          </div>
          
          {hasErrors && (
            <div className="flex items-center gap-1 text-xs text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Atenção
            </div>
          )}
        </div>
        
        {/* Alertas de Erro */}
        {inputErrors.range && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{inputErrors.range}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Data Início */}
          <div className="space-y-2">
            <Label htmlFor="date-from" className="text-sm font-medium">
              Data Início
            </Label>
            <div className="space-y-2">
              {/* Input Manual */}
              <Input
                placeholder="DD/MM/AAAA"
                value={manualInput.from}
                onChange={(e) => handleManualInputChange('from', e.target.value)}
                className={cn(
                  "text-sm",
                  inputErrors.from && "border-destructive focus-visible:ring-destructive"
                )}
              />
              
              {/* Botão Calendário */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-from"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : "Calendário"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.from}
                    onSelect={handleFromDateChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              {inputErrors.from && (
                <p className="text-xs text-destructive">{inputErrors.from}</p>
              )}
            </div>
          </div>

          {/* Data Fim */}
          <div className="space-y-2">
            <Label htmlFor="date-to" className="text-sm font-medium">
              Data Fim
            </Label>
            <div className="space-y-2">
              {/* Input Manual */}
              <Input
                placeholder="DD/MM/AAAA"
                value={manualInput.to}
                onChange={(e) => handleManualInputChange('to', e.target.value)}
                className={cn(
                  "text-sm",
                  inputErrors.to && "border-destructive focus-visible:ring-destructive"
                )}
              />
              
              {/* Botão Calendário */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-to"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : "Calendário"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.to}
                    onSelect={handleToDateChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              {inputErrors.to && (
                <p className="text-xs text-destructive">{inputErrors.to}</p>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-transparent">
              Ações
            </Label>
            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={applyFilter}
                disabled={hasErrors}
                className="w-full"
              >
                <Check className="mr-2 h-4 w-4" />
                Aplicar Filtro
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={!hasActiveFilter}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Informações do Filtro */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-transparent">
              Status
            </Label>
            <div className="p-3 rounded-md bg-muted/50 border text-xs space-y-1">
              {!dateRange.from && !dateRange.to && (
                <p className="text-muted-foreground">
                  📊 Exibindo todos os dados
                </p>
              )}
              {dateRange.from && !dateRange.to && (
                <p className="text-foreground">
                  📅 A partir de {format(dateRange.from, "dd/MM/yyyy")}
                </p>
              )}
              {!dateRange.from && dateRange.to && (
                <p className="text-foreground">
                  📅 Até {format(dateRange.to, "dd/MM/yyyy")}
                </p>
              )}
              {dateRange.from && dateRange.to && (
                <p className="text-foreground">
                  📅 {format(dateRange.from, "dd/MM/yyyy")} até {format(dateRange.to, "dd/MM/yyyy")}
                </p>
              )}
              
              <p className="text-muted-foreground text-[10px] mt-1">
                💡 Aceita formatos: DD/MM/AAAA, DD-MM-AAAA, DD.MM.AAAA
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}