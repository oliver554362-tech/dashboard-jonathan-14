import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionData } from "@/services/GoogleSheetsService";
import { Section } from "@/types/sections";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface GenericSectionProps {
  section: Section;
  data: SectionData[];
}

export function GenericSection({ 
  section, 
  data
}: GenericSectionProps) {
  const [activeTab, setActiveTab] = useState<'data' | 'settings'>('data');

  const totalRecords = data.length;
  const uniqueCollaborators = new Set(data.map(item => item.Colaborador)).size;
  const uniqueActivities = new Set(data.map(item => item.Atividade)).size;

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{totalRecords}</div>
            <p className="text-sm text-muted-foreground">Total de Registros</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{uniqueCollaborators}</div>
            <p className="text-sm text-muted-foreground">Colaboradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{uniqueActivities}</div>
            <p className="text-sm text-muted-foreground">Atividades</p>
          </CardContent>
        </Card>
      </div>

      {/* Navegação entre abas */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'data' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Dados
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'settings' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Configurações
        </button>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Dados de {section.name}</h3>

          <Card>
            <CardHeader>
              <CardTitle>Registros</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Atividade</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 10).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.Colaborador}</TableCell>
                      <TableCell>{item.Atividade}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.Plataforma}</Badge>
                      </TableCell>
                      <TableCell>{item.Data}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Ativo</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data.length > 10 && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Mostrando 10 de {data.length} registros
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações Avançadas de {section.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configurações avançadas e outras opções para {section.name} estarão disponíveis em breve.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}