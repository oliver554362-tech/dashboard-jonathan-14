import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  LogOut, 
  Eye, 
  RefreshCw, 
  Link2, 
  Database,
  Activity,
  TrendingUp,
  Clock,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { GoogleSheetsService } from "@/services/GoogleSheetsService";

export default function Admin() {
  const navigate = useNavigate();
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>({});
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    // Verificar se está autenticado
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/login");
      return;
    }

    // Carregar status das conexões
    loadConnectionStatus();
    setLastUpdate(new Date().toLocaleString());
  }, [navigate]);

  const loadConnectionStatus = () => {
    const sections = GoogleSheetsService.getAvailableSections();
    const status: any = {};
    
    sections.forEach(section => {
      status[section] = GoogleSheetsService.getSectionConnectionStatus(section);
    });
    
    setConnectionStatus(status);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  const validateSpreadsheetUrl = (url: string): boolean => {
    return url.includes("/pubhtml") || url.includes("docs.google.com/spreadsheets");
  };

  const handleConnectSpreadsheet = async () => {
    if (!spreadsheetUrl.trim()) {
      toast.error("Por favor, insira uma URL válida");
      return;
    }

    if (!validateSpreadsheetUrl(spreadsheetUrl)) {
      toast.error("URL deve ser uma planilha do Google Sheets publicada (/pubhtml)");
      return;
    }

    setIsLoading(true);
    
    try {
      const spreadsheetId = GoogleSheetsService.extractSpreadsheetId(spreadsheetUrl);
      
      if (!spreadsheetId) {
        toast.error("URL inválida. Use uma URL do Google Sheets válida.");
        setIsLoading(false);
        return;
      }

      const gid = GoogleSheetsService.extractGid(spreadsheetUrl);
      
      // Testar conexão
      const testResult = await GoogleSheetsService.testSpreadsheetConnection(spreadsheetId, gid);
      
      if (!testResult.success) {
        toast.error(testResult.error || "Não foi possível conectar à planilha");
        setIsLoading(false);
        return;
      }

      toast.success("Planilha conectada com sucesso!");
      setSpreadsheetUrl("");
      loadConnectionStatus();
      
    } catch (error) {
      console.error("Erro ao conectar planilha:", error);
      toast.error("Erro ao conectar planilha");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    
    try {
      const sections = GoogleSheetsService.getAvailableSections();
      let successCount = 0;
      
      for (const section of sections) {
        const result = await GoogleSheetsService.fetchSectionData(section);
        if (result.success) {
          successCount++;
        }
      }
      
      toast.success(`Dados atualizados! ${successCount}/${sections.length} seções sincronizadas`);
      setLastUpdate(new Date().toLocaleString());
      loadConnectionStatus();
      
    } catch (error) {
      toast.error("Erro ao atualizar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const totalSections = Object.keys(connectionStatus).length;
  const connectedSections = Object.values(connectionStatus).filter((status: any) => status.connected).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Painel Administrativo</h1>
                <p className="text-sm text-muted-foreground">Gerencie planilhas e dados do sistema</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate("/public")}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Painel Público
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{connectedSections}/{totalSections}</p>
                  <p className="text-sm text-muted-foreground">Seções Conectadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Online</p>
                  <p className="text-sm text-muted-foreground">Status do Sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Disponibilidade</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{lastUpdate.split(' ')[1]}</p>
                  <p className="text-sm text-muted-foreground">Última Atualização</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gerenciar Planilha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Gerenciar Planilha
            </CardTitle>
            <CardDescription>
              Conecte uma nova planilha do Google Sheets publicada na web
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spreadsheet-url">URL da Planilha</Label>
              <div className="flex gap-2">
                <Input
                  id="spreadsheet-url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../pubhtml"
                  value={spreadsheetUrl}
                  onChange={(e) => setSpreadsheetUrl(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleConnectSpreadsheet}
                  disabled={isLoading || !spreadsheetUrl.trim()}
                >
                  {isLoading ? "Conectando..." : "Conectar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                ⚠️ A planilha deve estar publicada na web (/pubhtml) e com permissão "Qualquer pessoa com o link pode visualizar"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recarregar Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Recarregar Dados
            </CardTitle>
            <CardDescription>
              Force a atualização dos dados de todas as planilhas conectadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Última sincronização: {lastUpdate}</p>
                <p className="text-sm text-muted-foreground">
                  {connectedSections} de {totalSections} seções conectadas
                </p>
              </div>
              <Button 
                onClick={handleRefreshData}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? "Atualizando..." : "Atualizar Agora"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status das Conexões */}
        <Card>
          <CardHeader>
            <CardTitle>Status das Seções</CardTitle>
            <CardDescription>
              Monitore o status de conexão de cada seção do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(connectionStatus).map(([section, status]: [string, any]) => (
                <div key={section} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{section}</p>
                    <p className="text-sm text-muted-foreground">
                      {status.mapping?.name || section}
                    </p>
                  </div>
                  <Badge variant={status.connected ? "default" : "secondary"}>
                    {status.connected ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start gap-3"
                onClick={() => navigate("/public")}
              >
                <Eye className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Visualizar Painel Público</p>
                  <p className="text-sm text-muted-foreground">Ver como os dados aparecem publicamente</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start gap-3"
                onClick={handleRefreshData}
                disabled={isLoading}
              >
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Exportar Dados</p>
                  <p className="text-sm text-muted-foreground">Baixar dados em formato CSV</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start gap-3"
                onClick={() => toast.info("Configurações em desenvolvimento")}
              >
                <Settings className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">Configurações</p>
                  <p className="text-sm text-muted-foreground">Ajustar preferências do sistema</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}