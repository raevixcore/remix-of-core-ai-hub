import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Bell, Search, CheckCheck, Trash2, MessageSquare, UserPlus, AlertTriangle,
  Settings, Bot, Webhook, Shield, Clock, Filter, MailOpen, Mail,
} from "lucide-react";

type NotifType = "message" | "team" | "system" | "integration" | "ai" | "security";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const typeConfig: Record<NotifType, { label: string; icon: typeof Bell; color: string }> = {
  message: { label: "Mensagem", icon: MessageSquare, color: "text-primary" },
  team: { label: "Equipe", icon: UserPlus, color: "text-success" },
  system: { label: "Sistema", icon: Settings, color: "text-muted-foreground" },
  integration: { label: "Integração", icon: Webhook, color: "text-warning" },
  ai: { label: "IA", icon: Bot, color: "text-info" },
  security: { label: "Segurança", icon: Shield, color: "text-destructive" },
};

const initialNotifications: Notification[] = [
  { id: 1, type: "message", title: "Nova mensagem de Carlos", description: "Conversa #4521 no WhatsApp — 'Preciso de ajuda com o pedido'", time: "2 min", read: false },
  { id: 2, type: "team", title: "Pedro Santos adicionado", description: "Novo agente adicionado à equipe por Ana Costa.", time: "15 min", read: false },
  { id: 3, type: "integration", title: "Instagram reconectado", description: "A conta @empresa_oficial foi reconectada com sucesso.", time: "1h", read: false },
  { id: 4, type: "ai", title: "Sentimento negativo detectado", description: "Conversa #4518 escalada para atendimento humano automaticamente.", time: "1h", read: false },
  { id: 5, type: "security", title: "Tentativa de login bloqueada", description: "3 tentativas inválidas do IP 203.0.113.42 — Bloqueado por 15min.", time: "2h", read: true },
  { id: 6, type: "system", title: "Backup concluído", description: "Backup diário automático finalizado — 2.4GB compactado.", time: "3h", read: true },
  { id: 7, type: "message", title: "Conversa encerrada", description: "Conversa #4508 no Telegram — Resolvida pelo agente Ana Costa.", time: "3h", read: true },
  { id: 8, type: "integration", title: "WhatsApp — Token expirado", description: "Reconexão automática iniciada. Verifique em Integrações se persistir.", time: "4h", read: true },
  { id: 9, type: "ai", title: "3 sugestões de resposta", description: "IA gerou sugestões para Conversa #4512 — Clique para revisar.", time: "4h", read: true },
  { id: 10, type: "system", title: "Atualização v2.4.2", description: "Correções de segurança e melhorias de performance aplicadas.", time: "5h", read: true },
  { id: 11, type: "team", title: "Papel atualizado", description: "Maria Oliveira foi promovida de Agente para Manager.", time: "6h", read: true },
  { id: 12, type: "security", title: "Senha alterada", description: "Lucas Ferreira atualizou sua senha de acesso.", time: "8h", read: true },
  { id: 13, type: "message", title: "5 mensagens não lidas", description: "Conversas pendentes no Telegram e WhatsApp aguardando resposta.", time: "12h", read: true },
  { id: 14, type: "ai", title: "Modelo fallback ativado", description: "GPT-4 indisponível — Fallback para GPT-3.5 automático.", time: "1d", read: true },
  { id: 15, type: "integration", title: "Telegram bot online", description: "Bot @empresa_bot reconectado — 142 chats ativos.", time: "1d", read: true },
];

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.3 } }),
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const unread = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    const matchSearch = search === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || n.type === typeFilter;
    return matchSearch && matchType;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: number) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));
  const deleteNotif = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearAll = () => setNotifications([]);

  const unreadNotifs = filtered.filter((n) => !n.read);
  const readNotifs = filtered.filter((n) => n.read);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            Notificações
            {unread > 0 && (
              <Badge className="text-[10px] h-5 px-1.5 bg-destructive text-destructive-foreground">{unread}</Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Central de alertas, eventos e atualizações do sistema.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={markAllRead} disabled={unread === 0}>
            <CheckCheck className="h-3.5 w-3.5" /> Marcar todas como lidas
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs text-destructive hover:text-destructive" onClick={clearAll}>
            <Trash2 className="h-3.5 w-3.5" /> Limpar
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total", value: notifications.length, icon: Bell },
          { label: "Não Lidas", value: unread, icon: Mail },
          { label: "Mensagens", value: notifications.filter((n) => n.type === "message").length, icon: MessageSquare },
          { label: "Alertas", value: notifications.filter((n) => n.type === "security" || n.type === "integration").length, icon: AlertTriangle },
        ].map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar notificações..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[{ key: "all", label: "Todas" }, ...Object.entries(typeConfig).map(([key, v]) => ({ key, label: v.label }))].map((f) => (
            <Button key={f.key} size="sm" variant={typeFilter === f.key ? "default" : "outline"}
              className="text-[10px] h-7 px-2.5" onClick={() => setTypeFilter(f.key)}>
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="h-9 mb-4 bg-muted/50">
          <TabsTrigger value="all" className="text-xs">Todas ({filtered.length})</TabsTrigger>
          <TabsTrigger value="unread" className="text-xs">Não Lidas ({unreadNotifs.length})</TabsTrigger>
          <TabsTrigger value="read" className="text-xs">Lidas ({readNotifs.length})</TabsTrigger>
        </TabsList>

        {["all", "unread", "read"].map((tab) => {
          const items = tab === "unread" ? unreadNotifs : tab === "read" ? readNotifs : filtered;
          return (
            <TabsContent key={tab} value={tab}>
              <div className="space-y-2">
                {items.map((notif, i) => {
                  const tc = typeConfig[notif.type];
                  return (
                    <motion.div key={notif.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                      className={cn(
                        "rounded-xl border bg-card p-4 flex items-start gap-3 transition-all",
                        notif.read ? "border-border/50 opacity-70" : "border-primary/20 bg-primary/[0.02]"
                      )}
                    >
                      <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                        notif.read ? "bg-muted" : "bg-primary/10"
                      )}>
                        <tc.icon className={cn("h-4 w-4", notif.read ? "text-muted-foreground" : tc.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {!notif.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                          <h4 className={cn("text-xs truncate", notif.read ? "text-muted-foreground" : "font-medium text-foreground")}>{notif.title}</h4>
                          <Badge variant="outline" className={cn("text-[8px] shrink-0 ml-auto", tc.color)}>{tc.label}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{notif.description}</p>
                        <span className="text-[9px] text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-2.5 w-2.5" /> {notif.time} atrás
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toggleRead(notif.id)}
                          title={notif.read ? "Marcar como não lida" : "Marcar como lida"}>
                          {notif.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteNotif(notif.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
                {items.length === 0 && (
                  <div className="text-center py-12 text-xs text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    Nenhuma notificação encontrada.
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </DashboardLayout>
  );
};

export default NotificationsPage;
