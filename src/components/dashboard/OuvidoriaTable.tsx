import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OuvidoriaData } from "@/data/ouvidoria";
import { Search, Filter, MessageSquare } from "lucide-react";

interface OuvidoriaTableProps {
  data: OuvidoriaData[];
}

export function OuvidoriaTable({ data }: OuvidoriaTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [plataformaFilter, setPlataformaFilter] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVIDO":
      case "IMPLEMENTADO":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
      case "EM ANÁLISE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "AGUARDANDO VERIFICAÇÃO DO SETOR":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "REGISTRADO":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "LA EDUCAÇÃO":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "FAMAR":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "UNIMAIS":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "LA FACULDADES":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800";
      case "ITECC":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.Colaborador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Atividade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Curso.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.STATUS === statusFilter;
    const matchesPlataforma = plataformaFilter === "all" || item.Plataforma === plataformaFilter;
    
    return matchesSearch && matchesStatus && matchesPlataforma;
  });

  const uniqueStatuses = Array.from(new Set(data.map(item => item.STATUS))).filter(status => status && status.trim() !== '');
  const uniquePlataformas = Array.from(new Set(data.map(item => item.Plataforma))).filter(plataforma => plataforma && plataforma.trim() !== '');

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Filter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Registro de Ocorrências da Ouvidoria
        </CardTitle>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar por colaborador, aluno, atividade ou curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-600"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={plataformaFilter} onValueChange={setPlataformaFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as plataformas</SelectItem>
              {uniquePlataformas.map(plataforma => (
                <SelectItem key={plataforma} value={plataforma}>{plataforma}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableHead className="font-semibold">Colaborador</TableHead>
                <TableHead className="font-semibold">Aluno</TableHead>
                <TableHead className="font-semibold">Atividade</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Plataforma</TableHead>
                <TableHead className="font-semibold">Curso</TableHead>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold">Conclusão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{item.Colaborador}</TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{item.Aluno}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{item.Atividade}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.STATUS)}>
                      {item.STATUS}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlatformColor(item.Plataforma)}>
                      {item.Plataforma}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{item.Curso}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {(() => {
                      const date = new Date(item["Data "]);
                      return isNaN(date.getTime()) ? "Data inválida" : date.toLocaleDateString('pt-BR');
                    })()}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {item["Data da conclusão"] 
                      ? (() => {
                          const date = new Date(item["Data da conclusão"]);
                          return isNaN(date.getTime()) ? "Data inválida" : date.toLocaleDateString('pt-BR');
                        })()
                      : "-"
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhuma ocorrência encontrada</p>
              <p className="text-sm">Tente ajustar os filtros de pesquisa</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Mostrando {filteredData.length} de {data.length} ocorrências
        </div>
      </CardContent>
    </Card>
  );
}