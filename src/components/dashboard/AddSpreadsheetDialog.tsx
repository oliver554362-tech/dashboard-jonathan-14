import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleSheetsService } from "@/services/GoogleSheetsService";
import { toast } from "sonner";

interface AddSpreadsheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: string;
  sectionName: string;
  onSpreadsheetAdded: () => void;
}

export function AddSpreadsheetDialog({
  open,
  onOpenChange,
  sectionId,
  sectionName,
  onSpreadsheetAdded
}: AddSpreadsheetDialogProps) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim() || !name.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    
    try {
      // Extrair ID e GID da URL
      const spreadsheetId = GoogleSheetsService.extractSpreadsheetId(url);
      
      if (!spreadsheetId) {
        toast.error("URL inválida. Use uma URL do Google Sheets válida.");
        setIsLoading(false);
        return;
      }

      const gid = GoogleSheetsService.extractGid(url);

      // Testar conexão
      const testResult = await GoogleSheetsService.testSpreadsheetConnection(spreadsheetId, gid);
      
      if (!testResult.success) {
        toast.error(testResult.error || "Não foi possível conectar à planilha");
        setIsLoading(false);
        return;
      }

      // Adicionar planilha à seção
      GoogleSheetsService.addSpreadsheetToSection(sectionId, {
        id: spreadsheetId,
        name: name.trim(),
        gid
      });

      toast.success(`Planilha "${name}" adicionada à seção ${sectionName}`);
      
      // Reset form
      setUrl("");
      setName("");
      onOpenChange(false);
      onSpreadsheetAdded();

    } catch (error) {
      console.error("Erro ao adicionar planilha:", error);
      toast.error("Erro ao adicionar planilha");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    
    // Auto-extrair nome da planilha se possível
    if (value.includes("spreadsheets") && !name) {
      const id = GoogleSheetsService.extractSpreadsheetId(value);
      if (id) {
        setName(`Planilha ${sectionName} - ${id.substring(0, 8)}`);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Planilha - {sectionName}</DialogTitle>
          <DialogDescription>
            Adicione uma nova planilha do Google Sheets para esta seção.
            A planilha deve ser pública ou compartilhada com permissão de visualização.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL da Planilha</Label>
            <Input
              id="url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Cole aqui a URL completa da planilha do Google Sheets
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Nome da Planilha</Label>
            <Input
              id="name"
              placeholder="Ex: Dados de Matrículas 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Nome para identificar esta planilha no sistema
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !url.trim() || !name.trim()}
          >
            {isLoading ? "Testando..." : "Adicionar Planilha"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}