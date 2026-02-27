import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Instagram, Send, Phone, Settings, Loader2, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIntegrations, Platform, TelegramPayload, WhatsappPayload, InstagramPayload } from "@/hooks/useIntegrations";

const platformConfig = [
  { id: "telegram" as Platform, name: "Telegram", icon: Send, color: "text-primary" },
  { id: "whatsapp" as Platform, name: "WhatsApp", icon: Phone, color: "text-success" },
  { id: "instagram" as Platform, name: "Instagram", icon: Instagram, color: "text-destructive" },
];

const Profiles = () => {
  const { statuses, loading, saving, disconnecting, save, disconnect } = useIntegrations();

  const [modalOpen, setModalOpen] = useState<Platform | null>(null);
  const [disconnectTarget, setDisconnectTarget] = useState<Platform | null>(null);

  const [telegramForm, setTelegramForm] = useState<TelegramPayload>({ token: "", username: "", name: "", description: "" });
  const [whatsappForm, setWhatsappForm] = useState<WhatsappPayload>({ phone_number_id: "", access_token: "", business_account_id: "" });
  const [instagramForm, setInstagramForm] = useState<InstagramPayload>({ page_id: "", access_token: "" });

  const resetAndClose = () => {
    setModalOpen(null);
    setTelegramForm({ token: "", username: "", name: "", description: "" });
    setWhatsappForm({ phone_number_id: "", access_token: "", business_account_id: "" });
    setInstagramForm({ page_id: "", access_token: "" });
  };

  const handleSave = async (platform: Platform) => {
    let body: TelegramPayload | WhatsappPayload | InstagramPayload;
    if (platform === "telegram") body = telegramForm;
    else if (platform === "whatsapp") body = whatsappForm;
    else body = instagramForm;

    const ok = await save(platform, body);
    if (ok) resetAndClose();
  };

  const handleDisconnect = async () => {
    if (!disconnectTarget) return;
    const ok = await disconnect(disconnectTarget);
    if (ok) setDisconnectTarget(null);
  };

  const isFormValid = (p: Platform) => {
    if (p === "telegram") return telegramForm.token.trim().length > 0;
    if (p === "whatsapp") return whatsappForm.phone_number_id.trim().length > 0 && whatsappForm.access_token.trim().length > 0;
    return instagramForm.page_id.trim().length > 0 && instagramForm.access_token.trim().length > 0;
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Integrações</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure suas integrações de canais de comunicação.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {platformConfig.map((p, i) => {
          const connected = statuses[p.id];
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-accent/50 flex items-center justify-center">
                  <p.icon className={cn("h-5 w-5", p.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Canal de atendimento</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5", connected ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20")}>
                    {connected
                      ? <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Conectado</span>
                      : <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Não configurado</span>}
                  </Badge>
                )}
                <div className="flex gap-1">
                  {connected && (
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] text-destructive hover:text-destructive" onClick={() => setDisconnectTarget(p.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => setModalOpen(p.id)}>
                    <Settings className="h-3 w-3" /> {connected ? "Reconfigurar" : "Configurar"}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Telegram */}
      <Dialog open={modalOpen === "telegram"} onOpenChange={open => !open && resetAndClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Configurar Telegram</DialogTitle>
            <DialogDescription>Insira o token do seu bot obtido via @BotFather.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Bot Token *</Label><Input placeholder="123456:ABC-DEF..." value={telegramForm.token} onChange={e => setTelegramForm(f => ({ ...f, token: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Username</Label><Input placeholder="@meu_bot" value={telegramForm.username} onChange={e => setTelegramForm(f => ({ ...f, username: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Nome</Label><Input placeholder="Meu Bot" value={telegramForm.name} onChange={e => setTelegramForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Descrição</Label><Input placeholder="Descrição" value={telegramForm.description} onChange={e => setTelegramForm(f => ({ ...f, description: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetAndClose}>Cancelar</Button>
            <Button disabled={!isFormValid("telegram") || saving} onClick={() => handleSave("telegram")}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Salvar Integração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WhatsApp */}
      <Dialog open={modalOpen === "whatsapp"} onOpenChange={open => !open && resetAndClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Phone className="h-5 w-5 text-success" /> Configurar WhatsApp</DialogTitle>
            <DialogDescription>Credenciais da WhatsApp Cloud API.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Phone Number ID *</Label><Input placeholder="1234567890" value={whatsappForm.phone_number_id} onChange={e => setWhatsappForm(f => ({ ...f, phone_number_id: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Access Token *</Label><Input placeholder="EAAxxxxxxx..." value={whatsappForm.access_token} onChange={e => setWhatsappForm(f => ({ ...f, access_token: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Business Account ID</Label><Input placeholder="9876543210" value={whatsappForm.business_account_id} onChange={e => setWhatsappForm(f => ({ ...f, business_account_id: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetAndClose}>Cancelar</Button>
            <Button disabled={!isFormValid("whatsapp") || saving} onClick={() => handleSave("whatsapp")}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Salvar Integração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Instagram */}
      <Dialog open={modalOpen === "instagram"} onOpenChange={open => !open && resetAndClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Instagram className="h-5 w-5 text-destructive" /> Configurar Instagram</DialogTitle>
            <DialogDescription>Credenciais da Instagram Graph API.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Page ID *</Label><Input placeholder="1234567890" value={instagramForm.page_id} onChange={e => setInstagramForm(f => ({ ...f, page_id: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Access Token *</Label><Input placeholder="IGQVJxxxxxxx..." value={instagramForm.access_token} onChange={e => setInstagramForm(f => ({ ...f, access_token: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetAndClose}>Cancelar</Button>
            <Button disabled={!isFormValid("instagram") || saving} onClick={() => handleSave("instagram")}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Salvar Integração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect */}
      <AlertDialog open={!!disconnectTarget} onOpenChange={open => !open && setDisconnectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desconectar integração</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza? Isso removerá as credenciais de {disconnectTarget?.charAt(0).toUpperCase()}{disconnectTarget?.slice(1)}.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disconnecting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={disconnecting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDisconnect}>
              {disconnecting && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Desconectar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Profiles;
