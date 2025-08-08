import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OuvidoriaData } from "@/data/ouvidoria";
import { MessageSquare, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface OuvidoriaStatsOverviewProps {
  data: OuvidoriaData[];
}

export function OuvidoriaStatsOverview({ data }: OuvidoriaStatsOverviewProps) {
  const totalOcorrencias = data.length;
  const resolvidas = data.filter(item => item.STATUS === "RESOLVIDO" || item.STATUS === "IMPLEMENTADO").length;
  const emAndamento = data.filter(item => item.STATUS === "EM ANÁLISE" || item.STATUS === "AGUARDANDO VERIFICAÇÃO DO SETOR").length;
  const registradas = data.filter(item => item.STATUS === "REGISTRADO").length;

  const hoje = new Date().toISOString().split('T')[0];
  const ocorrenciasHoje = data.filter(item => {
    const itemDate = new Date(item["Data "]);
    if (isNaN(itemDate.getTime())) return false; // Skip invalid dates
    const dataItem = itemDate.toISOString().split('T')[0];
    return dataItem === hoje;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Total de Ocorrências
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{totalOcorrencias}</div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            {ocorrenciasHoje} ocorrências hoje
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
            Resolvidas
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">{resolvidas}</div>
          <p className="text-xs text-green-600 dark:text-green-400">
            {totalOcorrencias > 0 ? Math.round((resolvidas / totalOcorrencias) * 100) : 0}% concluídas
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/10 border-yellow-200 dark:border-yellow-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
            Em Andamento
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{emAndamento}</div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            {totalOcorrencias > 0 ? Math.round((emAndamento / totalOcorrencias) * 100) : 0}% em análise
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Registradas
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{registradas}</div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Aguardando classificação
          </p>
        </CardContent>
      </Card>
    </div>
  );
}