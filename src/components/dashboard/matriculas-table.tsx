import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Eye } from "lucide-react";
import type { Matricula } from "@/data/matriculas";

interface MatriculasTableProps {
  data: Matricula[];
}

export function MatriculasTable({ data }: MatriculasTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const platforms = [...new Set(data.map(m => m.Plataforma))];

  const filteredData = data.filter(matricula => {
    const matchesSearch = 
      matricula.Aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matricula.Curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matricula.Gestor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matricula.Colaborador.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = selectedPlatform === "all" || matricula.Plataforma === selectedPlatform;
    
    return matchesSearch && matchesPlatform;
  });

  const getActivityBadge = (atividade: string) => {
    return atividade === "Matricula" ? (
      <Badge variant="default" className="bg-success text-success-foreground">
        {atividade}
      </Badge>
    ) : (
      <Badge variant="destructive">{atividade}</Badge>
    );
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

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Matrículas Registradas
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por colaborador, curso ou gestor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="all">Todas as Plataformas</option>
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Gestor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((matricula, index) => (
                <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{matricula.Colaborador}</TableCell>
                  <TableCell className="font-medium">{matricula.Aluno}</TableCell>
                  <TableCell>{matricula.Curso}</TableCell>
                  <TableCell>
                    <Badge className={getPlatformColor(matricula.Plataforma)}>
                      {matricula.Plataforma}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {matricula["Nível de Ensino"]}
                  </TableCell>
                  <TableCell>{matricula.Gestor}</TableCell>
                  <TableCell>{matricula.Data}</TableCell>
                  <TableCell>{getActivityBadge(matricula.Atividade)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma matrícula encontrada com os filtros aplicados.
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {filteredData.length} de {data.length} matrículas
        </div>
      </CardContent>
    </Card>
  );
}