import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search, Filter, Download, Clock, User, Bot, Webhook, Shield, Settings,
  MessageSquare, LogIn, LogOut, UserPlus, Trash2, RefreshCw, AlertTriangle,
  CheckCircle2, Info, ChevronLeft, ChevronRight,
} from "lucide-react";

type LogLevel = "info" | "warning" | "error" | "success";
type LogCategory = "auth" | "user" | "integration" | "system" | "ai" | "conversation";

interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  actor: string;
  action: string;
  details: string;
  ip?: string;
}

const levelConfig: Record<LogLevel, { label: string; color: string; icon: typeof Info }> = {
  info: { label: "Info", color: "text-primary", icon: Info },
  warning: { label: "Aviso", color: "text-warning", icon: AlertTriangle },
  error: { label: "Erro", color: "text-destructive", icon: AlertTriangle },
  success: { label: "Sucesso", color: "text-success", icon: CheckCircle2 },
};

const categoryConfig: Record<LogCategory, { label: string; icon: typeof User }> = {
  auth: { label: "Autenticação", icon: Shield },
  user: { label: "Usuário", icon: User },
  integration: { label: "Integração", icon: Webhook },
  system: { label: "Sistema", icon: Settings },
  ai: { label: "IA", icon: Bot },
  conversation: { label: "Conversa", icon: MessageSquare },
};

const mockLogs: LogEntry[] = [
  { id: 1, timestamp: "2024-01-16 17:45:12", level: "success", category: "auth", actor: "João Silva", action: "Login realizado", details: "Autenticação via email/senha", ip: "192.168.1.100" },
  { id: 2, timestamp: "2024-01-16 17:42:08", level: "info", category: "conversation", actor: "IA CoreAI", action: "Resposta automática enviada", details: "Conversa #4521 — WhatsApp — Cliente: Maria Santos" },
  { id: 3, timestamp: "2024-01-16 17:38:55", level: "warning", category: "integration", actor: "Sistema", action: "Reconexão WhatsApp", details: "Token expirado — reconexão automática iniciada" },
  { id: 4, timestamp: "2024-01-16 17:35:20", level: "success", category: "user", actor: "Ana Costa", action: "Membro adicionado", details: "Pedro Santos (Agente) adicionado à equipe" },
  { id: 5, timestamp: "2024-01-16 17:30:00", level: "info", category: "ai", actor: "IA CoreAI", action: "Análise de sentimento", details: "Detectado sentimento negativo — Conversa #4518 escalada para humano" },
  { id: 6, timestamp: "2024-01-16 17:25:44", level: "error", category: "integration", actor: "Sistema", action: "Falha no Telegram", details: "Erro 429 — Rate limit excedido — Retry em 60s" },
  { id: 7, timestamp: "2024-01-16 17:20:30", level: "info", category: "system", actor: "Sistema", action: "Backup automático", details: "Backup diário concluído — 2.4GB compactado" },
  { id: 8, timestamp: "2024-01-16 17:15:18", level: "success", category: "auth", actor: "Lucas Ferreira", action: "Senha alterada", details: "Senha atualizada com sucesso", ip: "10.0.0.55" },
  { id: 9, timestamp: "2024-01-16 17:10:05", level: "info", category: "conversation", actor: "Pedro Santos", action: "Conversa assumida", details: "Conversa #4515 — Telegram — Takeover humano ativado" },
  { id: 10, timestamp: "2024-01-16 17:05:40", level: "warning", category: "system", actor: "Sistema", action: "Uso de CPU elevado", details: "CPU em 87% — Monitoramento ativo" },
  { id: 11, timestamp: "2024-01-16 17:00:22", level: "success", category: "integration", actor: "Admin", action: "Instagram conectado", details: "Conta @empresa_oficial vinculada com sucesso" },
  { id: 12, timestamp: "2024-01-16 16:55:10", level: "info", category: "ai", actor: "IA CoreAI", action: "Sugestão gerada", details: "3 sugestões de resposta para Conversa #4512" },
  { id: 13, timestamp: "2024-01-16 16:50:00", level: "error", category: "system", actor: "Sistema", action: "Webhook falhou", details: "POST /api/webhooks/events — Timeout 30s — Endpoint não respondeu" },
  { id: 14, timestamp: "2024-01-16 16:45:33", level: "info", category: "auth", actor: "Maria Oliveira", action: "Logout", details: "Sessão encerrada", ip: "172.16.0.12" },
  { id: 15, timestamp: "2024-01-16 16:40:15", level: "success", category: "user", actor: "João Silva", action: "Configurações atualizadas", details: "Tema alterado para escuro — Idioma: pt-BR" },
  { id: 16, timestamp: "2024-01-16 16:35:00", level: "warning", category: "ai", actor: "IA CoreAI", action: "Modelo indisponível", details: "GPT-4 timeout — Fallback para GPT-3.5 ativado" },
  { id: 17, timestamp: "2024-01-16 16:30:45", level: "info", category: "conversation", actor: "Ana Costa", action: "Conversa encerrada", details: "Conversa #4508 — WhatsApp — Resolvida pelo agente" },
  { id: 18, timestamp: "2024-01-16 16:25:20", level: "success", category: "integration", actor: "Sistema", action: "Telegram reconectado", details: "Bot @empresa_bot online — 142 chats ativos" },
  { id: 19, timestamp: "2024-01-16 16:20:08", level: "error", category: "auth", actor: "Desconhecido", action: "Tentativa de login falhou", details: "3 tentativas inválidas — IP bloqueado por 15min", ip: "203.0.113.42" },
  { id: 20, timestamp: "2024-01-16 16:15:00", level: "info", category: "system", actor: "Sistema", action: "Atualização aplicada", details: "Versão 2.4.1 → 2.4.2 — Correções de segurança" },
];

const actionIcon = (action: string) => {
  if (action.includes("Login")) return LogIn;
  if (action.includes("Logout")) return LogOut;
  if (action.includes("adicionado") || action.includes("criado")) return UserPlus;
  if (action.includes("Remov") || action.includes("falhou")) return Trash2;
  if (action.includes("Reconex") || action.includes("reconectado")) return RefreshCw;
  return Info;
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.3 } }),
};

const ITEMS_PER_PAGE = 10;

const LogsPage = () => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = mockLogs.filter((log) => {
    const matchSearch = search === "" ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || log.level === levelFilter;
    const matchCategory = categoryFilter === "all" || log.category === categoryFilter;
    return matchSearch && matchLevel && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const stats = {
    total: mockLogs.length,
    errors: mockLogs.filter((l) => l.level === "error").length,
    warnings: mockLogs.filter((l) => l.level === "warning").length,
    today: mockLogs.length,
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Logs do Sistema</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Histórico completo de ações, eventos e integrações.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total de Logs", value: stats.total, icon: Clock, color: "text-primary" },
          { label: "Erros", value: stats.errors, icon: AlertTriangle, color: "text-destructive" },
          { label: "Avisos", value: stats.warnings, icon: AlertTriangle, color: "text-warning" },
          { label: "Hoje", value: stats.today, icon: CheckCircle2, color: "text-success" },
        ].map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div className={cn("h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center", s.color)}>
              <s.icon className="h-4 w-4" />
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
          <Input placeholder="Buscar em logs..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-xs" />
        </div>
        <Select value={levelFilter} onValueChange={(v) => { setLevelFilter(v); setPage(1); }}>
          <SelectTrigger className="w-32 h-9 text-xs">
            <Filter className="h-3 w-3 mr-1" /><SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Níveis</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="warning">Aviso</SelectItem>
            <SelectItem value="error">Erro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
          <SelectTrigger className="w-40 h-9 text-xs">
            <Filter className="h-3 w-3 mr-1" /><SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            {(Object.entries(categoryConfig) as [LogCategory, typeof categoryConfig.auth][]).map(([key, c]) => (
              <SelectItem key={key} value={key}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs ml-auto">
          <Download className="h-3.5 w-3.5" /> Exportar
        </Button>
      </div>

      {/* Logs Table */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-[150px]">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-[80px]">Nível</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-[110px]">Categoria</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-[120px]">Ator</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ação</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((log, i) => {
                const lc = levelConfig[log.level];
                const cc = categoryConfig[log.category];
                const ActionIcon = actionIcon(log.action);
                return (
                  <motion.tr key={log.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                    className="border-b border-border/50 hover:bg-accent/20 transition-colors"
                  >
                    <td className="py-2.5 px-4">
                      <span className="text-muted-foreground font-mono flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> {log.timestamp}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge variant="outline" className={cn("text-[10px] gap-0.5", lc.color)}>
                        <lc.icon className="h-2.5 w-2.5" /> {lc.label}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <cc.icon className="h-3 w-3" /> {cc.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-medium text-foreground">{log.actor}</span>
                      {log.ip && <span className="block text-[9px] text-muted-foreground font-mono">{log.ip}</span>}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <ActionIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground max-w-[300px] truncate">{log.details}</td>
                  </motion.tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">Nenhum log encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-border px-4 py-3 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" className="h-7 w-7 p-0" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button key={i} size="sm" variant={page === i + 1 ? "default" : "outline"}
                  className="h-7 w-7 p-0 text-[10px]" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </Button>
              ))}
              <Button size="sm" variant="outline" className="h-7 w-7 p-0" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default LogsPage;
