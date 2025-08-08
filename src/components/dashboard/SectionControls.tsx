import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, ExternalLink, Plus } from "lucide-react";
import { AddSpreadsheetDialog } from "./AddSpreadsheetDialog";
import { GoogleSheetsService } from "@/services/GoogleSheetsService";
import { toast } from "sonner";

interface SectionControlsProps {
  sectionId: string;
  sectionName: string;
  onSync: (sectionId: string) => void;
  onAdd: (sectionId: string) => void;
  onOpen: (sectionId: string) => void;
}

export function SectionControls({ 
  sectionId, 
  sectionName, 
  onSync, 
  onAdd, 
  onOpen 
}: SectionControlsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await GoogleSheetsService.fetchSectionData(sectionId);
      if (result.success) {
        toast.success(`Planilhas da seção ${sectionName} sincronizadas com sucesso!`);
        onSync(sectionId);
      } else {
        toast.error(result.error || "Erro ao sincronizar planilhas");
      }
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast.error("Erro ao sincronizar planilhas");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpen = () => {
    const spreadsheets = GoogleSheetsService.getSectionSpreadsheets(sectionId);
    if (spreadsheets.length === 0) {
      toast.info("Nenhuma planilha configurada para esta seção");
      return;
    }
    
    // Abrir a primeira planilha configurada
    const firstSpreadsheet = spreadsheets[0];
    const url = `https://docs.google.com/spreadsheets/d/${firstSpreadsheet.id}/edit#gid=${firstSpreadsheet.gid || 0}`;
    window.open(url, '_blank');
    onOpen(sectionId);
  };

  const handleSpreadsheetAdded = () => {
    onAdd(sectionId);
  };
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={() => setShowAddDialog(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Planilha
        </Button>
        
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Planilha'}
        </Button>
        
        <Button
          onClick={handleOpen}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Abrir Planilha
        </Button>
      </div>

      <AddSpreadsheetDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        sectionId={sectionId}
        sectionName={sectionName}
        onSpreadsheetAdded={handleSpreadsheetAdded}
      />
    </>
  );
}