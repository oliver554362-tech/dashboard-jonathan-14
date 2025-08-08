import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SecretariaData } from "@/data/secretaria";
import { SectionData } from "@/services/GoogleSheetsService";
import { Search } from "lucide-react";

interface SecretariaTableProps {
  data: SecretariaData[] | SectionData[];
}

// Helper para converter SectionData para formato compatível
const convertToSecretariaFormat = (item: SectionData | SecretariaData): SecretariaData => {
  if ('Aluno' in item) {
    // É SectionData, converter
    return {
      colaborador: item.Colaborador || '',
      aluno: item.Aluno || '',
      atividade: item.Atividade || '',
      plataforma: item.Plataforma || '',
      nivel_ensino: item['Nível de ensino'] || '',
      curso: item.Curso || null,
      data_analise: item['Data'] || null,
      observacoes: item['Observações'] || null,
      gestor: item.Gestor || null,
    };
  }
  // Já é SecretariaData
  return item as SecretariaData;
};

export function SecretariaTable({ data }: SecretariaTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroAtividade, setFiltroAtividade] = useState("all");
  const [filtroPlataforma, setFiltroPlataforma] = useState("all");

  // Converter dados para formato unificado
  const convertedData = data.map(convertToSecretariaFormat);

  // Filtrar dados
  const filteredData = convertedData.filter(item => {
    const matchesSearch = 
      item.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.colaborador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.curso && item.curso.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAtividade = filtroAtividade === "all" || item.atividade === filtroAtividade;
    const matchesPlataforma = filtroPlataforma === "all" || item.plataforma === filtroPlataforma;
    
    return matchesSearch && matchesAtividade && matchesPlataforma;
  });

  // Obter listas únicas para filtros
  const atividades = [...new Set(convertedData.map(item => item.atividade).filter(a => a && a.trim() !== ""))];
  const plataformas = [...new Set(convertedData.map(item => item.plataforma).filter(p => p && p.trim() !== ""))];

  const getStatusBadge = (atividade: string) => {
    if (atividade.includes("Aprovado")) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Aprovado</Badge>;
    } else if (atividade.includes("Negado")) {
      return <Badge variant="destructive">Negado</Badge>;
    } else if (atividade.includes("Validação")) {
      return <Badge variant="secondary">Em Validação</Badge>;
    } else if (atividade.includes("certificadora")) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Certificadora</Badge>;
    }
    return <Badge variant="outline">{atividade}</Badge>;
  };

  const getPlatformColor = (plataforma: string) => {
    const colors = {
      "FAMAR": "bg-primary text-primary-foreground",
      "UNIMAIS": "bg-accent text-accent-foreground", 
      "LA EDUCAÇÃO": "bg-success text-success-foreground",
      "LA FACULDADES": "bg-warning text-warning-foreground",
      "ITECC": "bg-muted text-muted-foreground",
      "IPEMIG": "bg-secondary text-secondary-foreground",
      "VICINT": "bg-destructive text-destructive-foreground"
    };
    return colors[plataforma as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const getNivelBadge = (nivel: string) => {
    const colors = {
      "TÉCNICO": "bg-purple-100 text-purple-800",
      "Graduação": "bg-blue-100 text-blue-800",
      "Pós-graduação": "bg-green-100 text-green-800",
      "Segunda Licenciatura": "bg-orange-100 text-orange-800",
      "Extensão Universitária": "bg-yellow-100 text-yellow-800",
      "Formação Pedagógica": "bg-pink-100 text-pink-800",
      "Superior Sequencial": "bg-indigo-100 text-indigo-800"
    };
    
    const colorClass = colors[nivel as keyof typeof colors] || "bg-gray-100 text-gray-800";
    
    return <Badge variant="outline" className={colorClass}>{nivel}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registros da Secretaria Acadêmica</CardTitle>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por aluno, colaborador ou curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filtroAtividade} onValueChange={setFiltroAtividade}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as atividades</SelectItem>
              {atividades.map(atividade => (
                <SelectItem key={atividade} value={atividade}>
                  {atividade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filtroPlataforma} onValueChange={setFiltroPlataforma}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as plataformas</SelectItem>
              {plataformas.map(plataforma => (
                <SelectItem key={plataforma} value={plataforma}>
                  {plataforma}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Gestor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aluno</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.slice(0, 50).map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.colaborador}</TableCell>
                  <TableCell className="max-w-xs truncate" title={item.curso || "N/A"}>
                    {item.curso || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlatformColor(item.plataforma)}>
                      {item.plataforma}
                    </Badge>
                  </TableCell>
                  <TableCell>{getNivelBadge(item.nivel_ensino)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.gestor || "N/A"}
                  </TableCell>
                  <TableCell>
                    {item.data_analise ? new Date(item.data_analise).toLocaleDateString('pt-BR') : "N/A"}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.atividade)}</TableCell>
                  <TableCell className="font-medium text-sm">{item.aluno}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredData.length > 50 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Mostrando 50 de {filteredData.length} registros filtrados
          </p>
        )}
        
        {filteredData.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Nenhum registro encontrado com os filtros aplicados.
          </p>
        )}
      </CardContent>
    </Card>
  );
}