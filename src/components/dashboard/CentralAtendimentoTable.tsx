import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type CentralAtendimento } from "@/data/centralAtendimento";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CentralAtendimentoTableProps {
  data: CentralAtendimento[];
}

export function CentralAtendimentoTable({ data }: CentralAtendimentoTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Resolvido':
        return 'default';
      case 'Em Andamento':
        return 'secondary';
      case 'Pendente':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPrioridadeVariant = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta':
        return 'destructive';
      case 'Média':
        return 'secondary';
      case 'Baixa':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atendimentos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Polo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Colaborador</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum atendimento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((atendimento) => (
                <TableRow key={atendimento.id}>
                  <TableCell className="font-medium">
                    {format(parseISO(atendimento.data), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{atendimento.polo}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{atendimento.categoria}</div>
                      {atendimento.subcategoria && (
                        <div className="text-sm text-muted-foreground">
                          {atendimento.subcategoria}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{atendimento.colaborador}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={atendimento.descricao}>
                      {atendimento.descricao}
                    </div>
                  </TableCell>
                  <TableCell>
                    {atendimento.prioridade && (
                      <Badge variant={getPrioridadeVariant(atendimento.prioridade)}>
                        {atendimento.prioridade}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(atendimento.status)}>
                      {atendimento.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}