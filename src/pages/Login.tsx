import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de autenticação (substituir por Supabase auth)
    if (email && password) {
      localStorage.setItem("isAdmin", "true");
      toast.success("Login realizado com sucesso!");
      navigate("/admin");
    } else {
      toast.error("Por favor, preencha todos os campos");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Lado Esquerdo - Informações */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Sistema de Gestão
            </h1>
            <p className="text-xl text-muted-foreground">
              Conecte suas planilhas e visualize dados em tempo real
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
              <Shield className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Área Administrativa</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie planilhas, configure conexões e monitore dados
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
              <Eye className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Painel Público</h3>
                <p className="text-sm text-muted-foreground">
                  Dashboard acessível para visualização de dados por qualquer visitante
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border">
              <Database className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Integração Google Sheets</h3>
                <p className="text-sm text-muted-foreground">
                  Conecte planilhas públicas e sincronize dados automaticamente
                </p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/public")}
              className="w-full md:w-auto"
            >
              <Eye className="w-4 h-4 mr-2" />
              Acessar Painel Público
            </Button>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Login Administrativo</CardTitle>
            <CardDescription>
              Acesse o painel de controle do sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail ou Usuário</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sistema.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar como Administrador"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}