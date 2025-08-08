import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Shield, Database, BarChart3, Lock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Database className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Sistema de Gestão de Dados
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conecte suas planilhas do Google Sheets e transforme dados em insights poderosos
          </p>
        </div>
      </header>

      {/* Main Options */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Área Administrativa */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Área Administrativa</CardTitle>
              <CardDescription className="text-base">
                Acesso restrito para gestão e configuração do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Login com usuário e senha</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Database className="w-4 h-4 text-primary" />
                  <span>Gerenciar planilhas Google Sheets</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span>Estatísticas avançadas e logs</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full mt-6"
                onClick={() => navigate("/login")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Entrar como Administrador
              </Button>
            </CardContent>
          </Card>

          {/* Área Pública */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary/50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <Eye className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Painel Público</CardTitle>
              <CardDescription className="text-base">
                Dashboard aberto para visualização de dados por qualquer visitante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>Acesso livre sem login</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BarChart3 className="w-4 h-4 text-secondary" />
                  <span>Gráficos e KPIs dinâmicos</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Database className="w-4 h-4 text-secondary" />
                  <span>Tabelas filtráveis e responsivas</span>
                </div>
              </div>
              
              <Button 
                variant="secondary"
                size="lg" 
                className="w-full mt-6"
                onClick={() => navigate("/public")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Acessar Painel Público
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8">Recursos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-lg bg-card border">
              <Database className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Integração Google Sheets</h3>
              <p className="text-sm text-muted-foreground">
                Conecte planilhas públicas e sincronize dados automaticamente
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-card border">
              <BarChart3 className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Dashboards Dinâmicos</h3>
              <p className="text-sm text-muted-foreground">
                Visualize dados com gráficos interativos e KPIs em tempo real
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-card border">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Segurança Avançada</h3>
              <p className="text-sm text-muted-foreground">
                Controle de acesso e proteção de dados administrativos
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}