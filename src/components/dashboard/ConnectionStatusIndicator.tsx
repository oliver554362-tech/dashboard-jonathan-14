import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { autoSyncService } from '@/services/AutoSyncService';
import { GoogleSheetsService } from '@/services/GoogleSheetsService';
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface ConnectionStatus {
  sectionId: string;
  isActive: boolean;
  connected: boolean;
  mapping: any;
}

interface ConnectionStatusIndicatorProps {
  sectionId: string;
  onReconnect?: (sectionId: string) => void;
  compact?: boolean;
}

export const ConnectionStatusIndicator = ({ 
  sectionId, 
  onReconnect,
  compact = false 
}: ConnectionStatusIndicatorProps) => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const checkConnectionStatus = () => {
    const allStatus = autoSyncService.getSyncStatus();
    const sectionStatus = allStatus.find(s => s.sectionId === sectionId);
    setStatus(sectionStatus || null);
  };

  const handleReconnect = async () => {
    if (!status) return;
    
    setIsReconnecting(true);
    try {
      console.log(`[UI] Iniciando reconexão manual para ${sectionId}...`);
      
      // Reconectar a seção
      const reconnected = autoSyncService.reconnectSection(sectionId);
      
      if (reconnected) {
        // Tentar sincronizar após reconexão
        try {
          await autoSyncService.forceSyncSection(sectionId);
          
          toast.success(`✅ Seção ${status.mapping?.name || sectionId} reconectada com sucesso!`);
          
          // Informar o componente pai sobre a reconexão
          if (onReconnect) {
            onReconnect(sectionId);
          }
          
          // Atualizar status
          checkConnectionStatus();
          
        } catch (syncError) {
          console.warn(`[UI] Reconexão realizada, mas sincronização falhou:`, syncError);
          toast.warning(`⚠️ Seção reconectada, mas a sincronização inicial falhou. Tentando novamente...`);
        }
      } else {
        toast.error(`❌ Não foi possível reconectar a seção ${sectionId}`);
      }
    } catch (error) {
      console.error(`[UI] Erro ao reconectar seção ${sectionId}:`, error);
      toast.error(`❌ Erro ao reconectar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsReconnecting(false);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkConnectionStatus, 30000);
    
    return () => clearInterval(interval);
  }, [sectionId]);

  if (!status) return null;

  const getStatusColor = () => {
    if (!status.connected) return 'destructive';
    if (!status.isActive) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!status.connected) return <WifiOff className="h-3 w-3" />;
    if (!status.isActive) return <AlertTriangle className="h-3 w-3" />;
    return <Wifi className="h-3 w-3" />;
  };

  const getStatusText = () => {
    if (!status.connected) return 'Desconectado';
    if (!status.isActive) return 'Inativo';
    return 'Conectado';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
        
        {!status.connected && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReconnect}
            disabled={isReconnecting}
            className="h-6 px-2"
          >
            {isReconnecting ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              'Reconectar'
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="p-3 border border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor()} className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
          
          <span className="text-sm text-muted-foreground">
            Aba: {status.mapping?.name || 'Não mapeada'}
          </span>
        </div>

        {!status.connected && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              ⚠️ Conexão perdida com a planilha
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReconnect}
              disabled={isReconnecting}
            >
              {isReconnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reconectando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconectar
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      {!status.connected && !isReconnecting && (
        <div className="mt-2 text-xs text-muted-foreground">
          A seção <strong>{status.mapping?.name || sectionId}</strong> perdeu a conexão com a planilha. 
          Clique em "Reconectar" para restabelecer a conexão automaticamente.
        </div>
      )}
    </Card>
  );
};