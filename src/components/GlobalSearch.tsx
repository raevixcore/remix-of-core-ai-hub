import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, FileText, MessageSquare, ShieldCheck, CalendarDays,
  Users, CreditCard, Settings, Bot, UsersRound, Share2, LifeBuoy,
  ScrollText, Bell, BarChart3, User, Search, Sparkles,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

const pages = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, keywords: "home inicio painel" },
  { label: "Conteúdo", path: "/content", icon: FileText, keywords: "posts publicações" },
  { label: "Conversas", path: "/conversations", icon: MessageSquare, keywords: "chat mensagens whatsapp telegram" },
  { label: "Aprovações", path: "/approvals", icon: ShieldCheck, keywords: "aprovar revisar" },
  { label: "Calendário", path: "/calendar", icon: CalendarDays, keywords: "tarefas agenda agendamento" },
  { label: "Estatísticas", path: "/statistics", icon: BarChart3, keywords: "métricas analytics dados" },
  { label: "Redes Sociais", path: "/social-stats", icon: Share2, keywords: "instagram telegram whatsapp social" },
  { label: "Integrações", path: "/profiles", icon: Users, keywords: "whatsapp telegram instagram conectar" },
  { label: "Equipe", path: "/team", icon: UsersRound, keywords: "membros agentes admin" },
  { label: "Assinatura", path: "/subscription", icon: CreditCard, keywords: "plano pagamento billing" },
  { label: "Configurações", path: "/settings", icon: Settings, keywords: "tema idioma aparência empresa" },
  { label: "Logs", path: "/logs", icon: ScrollText, keywords: "histórico ações eventos" },
  { label: "AI Assistant", path: "/ai-assistant", icon: Bot, keywords: "inteligência artificial chat ia" },
  { label: "Suporte", path: "/support", icon: LifeBuoy, keywords: "ajuda faq ticket" },
  { label: "Notificações", path: "/notifications", icon: Bell, keywords: "alertas avisos" },
  { label: "Meu Perfil", path: "/profile", icon: User, keywords: "conta avatar dados pessoais" },
  { label: "CRM", path: "/crm", icon: Sparkles, keywords: "clientes contatos leads" },
  { label: "Marketing", path: "/marketing", icon: BarChart3, keywords: "funil swot seo sem kpi persona growth automação branding copywriting" },
  { label: "Base de Conhecimento", path: "/knowledge-base", icon: Search, keywords: "artigos templates scripts faq respostas" },
  { label: "Analytics Pro", path: "/analytics-pro", icon: BarChart3, keywords: "métricas metas projeções agentes performance avançado" },
  { label: "Automações", path: "/automations", icon: Sparkles, keywords: "fluxos workflows triggers ações automático" },
];

const quickActions = [
  { label: "Nova Conversa", keywords: "criar iniciar chat", path: "/conversations" },
  { label: "Nova Tarefa", keywords: "criar agendar", path: "/calendar" },
  { label: "Novo Membro", keywords: "adicionar usuário", path: "/team" },
  { label: "Novo Ticket", keywords: "suporte problema", path: "/support" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runAction = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-mono text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar páginas, ações, membros..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          <CommandGroup heading="Páginas">
            {pages.map((p) => (
              <CommandItem key={p.path} value={`${p.label} ${p.keywords}`} onSelect={() => runAction(p.path)} className="gap-2 cursor-pointer">
                <p.icon className="h-4 w-4 text-muted-foreground" />
                <span>{p.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Ações Rápidas">
            {quickActions.map((a) => (
              <CommandItem key={a.label} value={`${a.label} ${a.keywords}`} onSelect={() => runAction(a.path)} className="gap-2 cursor-pointer">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{a.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
