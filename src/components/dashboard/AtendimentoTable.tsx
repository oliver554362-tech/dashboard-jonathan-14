import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { atendimentoData } from "@/data/atendimento";

interface AtendimentoTableProps {
  data: any[];
}

export function AtendimentoTable({ data }: AtendimentoTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Usar dados locais se não houver dados sincronizados
  const currentData = data.length > 0 ? data : Object.values(atendimentoData).flat();
  
  // Adicionar data aos registros para exibição
  const dataWithDates = currentData.map((item, index) => {
    const dateKey = Object.keys(atendimentoData).find(key => 
      atendimentoData[key as keyof typeof atendimentoData].includes(item)
    ) || '0101';
    
    return {
      ...item,
      DATA: dateKey
    };
  });

  // Filtrar dados baseado no termo de busca
  const filteredData = dataWithDates.filter(item =>
    item.POLOS?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.OBSERVAÇÃO?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para obter cor do badge baseado na categoria
  const getCategoryColor = (category: string, value: string) => {
    if (!value || value === "") return "secondary";
    
    const numValue = parseFloat(value);
    if (numValue === 0) return "secondary";
    
    switch (category) {
      case 'CERTIFICADOS': return "bg-blue-100 text-blue-800";
      case 'DOCUMENTOS': return "bg-green-100 text-green-800";
      case 'PLATAFORMA': return "bg-purple-100 text-purple-800";
      case 'TRABALHOS': return "bg-orange-100 text-orange-800";
      case 'UNIMAIS': return "bg-indigo-100 text-indigo-800";
      case 'PROVA': return "bg-pink-100 text-pink-800";
      case 'CANCELAMENTO': return "bg-red-100 text-red-800";
      default: return "secondary";
    }
  };

  // Função para formatar data
  const formatDate = (dateKey: string) => {
    if (dateKey.length === 4) {
      const day = dateKey.substring(0, 2);
      const month = dateKey.substring(2, 4);
      return `${day}/${month}`;
    }
    return dateKey;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Central de Atendimento aos Licenciados
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por polo ou observação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[300px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Polo</TableHead>
                  <TableHead className="font-semibold text-center">Certificados</TableHead>
                  <TableHead className="font-semibold text-center">Documentos</TableHead>
                  <TableHead className="font-semibold text-center">Plataforma</TableHead>
                  <TableHead className="font-semibold text-center">Trabalhos</TableHead>
                  <TableHead className="font-semibold text-center">Unimais</TableHead>
                  <TableHead className="font-semibold text-center">Prova</TableHead>
                  <TableHead className="font-semibold text-center">Cancelamento</TableHead>
                  <TableHead className="font-semibold text-center">Alunos</TableHead>
                  <TableHead className="font-semibold">Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="text-xs">
                        {formatDate(item.DATA)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px]">
                      <div className="truncate" title={item.POLOS}>
                        {item.POLOS}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.CERTIFICADOS && item.CERTIFICADOS !== "" ? (
                        <Badge className={getCategoryColor('CERTIFICADOS', item.CERTIFICADOS)}>
                          {item.CERTIFICADOS}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.DOCUMENTOS && item.DOCUMENTOS !== "" ? (
                        <Badge className={getCategoryColor('DOCUMENTOS', item.DOCUMENTOS)}>
                          {item.DOCUMENTOS}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.PLATAFORMA && item.PLATAFORMA !== "" ? (
                        <Badge className={getCategoryColor('PLATAFORMA', item.PLATAFORMA)}>
                          {item.PLATAFORMA}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.TRABALHOS && item.TRABALHOS !== "" ? (
                        <Badge className={getCategoryColor('TRABALHOS', item.TRABALHOS)}>
                          {item.TRABALHOS}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.UNIMAIS && item.UNIMAIS !== "" ? (
                        <Badge className={getCategoryColor('UNIMAIS', item.UNIMAIS)}>
                          {item.UNIMAIS}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.PROVA && item.PROVA !== "" ? (
                        <Badge className={getCategoryColor('PROVA', item.PROVA)}>
                          {item.PROVA}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.CANCELAMENTO && item.CANCELAMENTO !== "" ? (
                        <Badge className={getCategoryColor('CANCELAMENTO', item.CANCELAMENTO)}>
                          {item.CANCELAMENTO}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.ALUNO && item.ALUNO !== "" ? (
                        <Badge variant="default" className="bg-primary/10 text-primary">
                          {item.ALUNO}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      {item.OBSERVAÇÃO ? (
                        <div className="text-sm text-muted-foreground truncate" title={item.OBSERVAÇÃO}>
                          {item.OBSERVAÇÃO}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {filteredData.length} de {dataWithDates.length} registros
        </div>
      </CardContent>
    </Card>
  );
}