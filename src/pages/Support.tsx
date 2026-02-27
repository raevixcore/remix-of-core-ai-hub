import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  HelpCircle, MessageCircle, Plus, Search, Clock, CheckCircle2,
  AlertCircle, ChevronRight, Send, Paperclip, LifeBuoy, BookOpen,
  Ticket, ArrowUpCircle,
} from "lucide-react";

/* ─── Types ─── */
type TicketPriority = "low" | "medium" | "high" | "urgent";
type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
  messages: { sender: "user" | "support"; text: string; time: string }[];
}

/* ─── Mock Data ─── */
const faqItems = [
  { q: "Como integrar o WhatsApp ao sistema?", a: "Acesse Integrações > WhatsApp, escaneie o QR Code com seu dispositivo e aguarde a sincronização. O processo leva cerca de 2 minutos." },
  { q: "Como funciona a IA de respostas automáticas?", a: "A IA analisa as mensagens recebidas e sugere respostas baseadas no contexto. Você pode ativar o modo automático em Configurações > IA para que ela responda quando o agente estiver offline." },
  { q: "Como adicionar novos membros à equipe?", a: "Vá em Equipe > Novo Membro, preencha nome, email, senha e selecione a função (Admin, Manager ou Agente). O novo membro receberá um email de boas-vindas." },
  { q: "Quais canais de comunicação são suportados?", a: "Atualmente suportamos WhatsApp, Telegram e Instagram. Cada canal pode ser configurado individualmente na página de Integrações." },
  { q: "Como exportar relatórios de conversas?", a: "Em Estatísticas, clique no botão 'Exportar' no canto superior direito. Você pode escolher o formato (PDF ou CSV) e o período desejado." },
  { q: "Como alterar o idioma da interface?", a: "Clique no ícone de globo no header ou acesse Configurações > Aparência > Idioma. Suportamos Português, Inglês e Espanhol." },
  { q: "Qual o limite de conversas simultâneas?", a: "Depende do seu plano. O plano Starter suporta até 500, o Professional até 5.000 e o Enterprise é ilimitado." },
  { q: "Como configurar webhooks?", a: "Acesse Configurações > Webhooks. Lá você encontra a URL do webhook e o signing secret para integrar com seus sistemas externos." },
];

const initialTickets: SupportTicket[] = [
  {
    id: 1001, subject: "Erro ao conectar WhatsApp", description: "O QR Code não aparece na tela de integração.",
    priority: "high", status: "in_progress", category: "Integrações",
    createdAt: "2024-01-15 14:30", updatedAt: "2024-01-15 16:45",
    messages: [
      { sender: "user", text: "O QR Code não aparece na tela de integração do WhatsApp. Já tentei recarregar a página.", time: "14:30" },
      { sender: "support", text: "Olá! Vamos verificar. Poderia limpar o cache do navegador e tentar novamente?", time: "15:10" },
      { sender: "user", text: "Limpei o cache mas o problema persiste.", time: "15:25" },
      { sender: "support", text: "Entendi. Estamos investigando o problema. Vou escalar para a equipe técnica.", time: "16:45" },
    ],
  },
  {
    id: 1002, subject: "Relatório não exporta em PDF", description: "Ao clicar em exportar PDF, o download não inicia.",
    priority: "medium", status: "open", category: "Relatórios",
    createdAt: "2024-01-16 09:15", updatedAt: "2024-01-16 09:15",
    messages: [
      { sender: "user", text: "Quando clico em exportar PDF na página de estatísticas, nada acontece. Testei no Chrome e Firefox.", time: "09:15" },
    ],
  },
  {
    id: 1003, subject: "Sugestão: modo escuro para emails", description: "Gostaria de ter templates de email com modo escuro.",
    priority: "low", status: "resolved", category: "Sugestão",
    createdAt: "2024-01-10 11:00", updatedAt: "2024-01-14 08:30",
    messages: [
      { sender: "user", text: "Seria ótimo ter templates de email compatíveis com modo escuro.", time: "11:00" },
      { sender: "support", text: "Obrigado pela sugestão! Já adicionamos ao nosso roadmap para Q2 2024.", time: "08:30" },
    ],
  },
];

const priorityConfig: Record<TicketPriority, { label: string; color: string; icon: typeof ArrowUpCircle }> = {
  low: { label: "Baixa", color: "text-muted-foreground", icon: ArrowUpCircle },
  medium: { label: "Média", color: "text-warning", icon: ArrowUpCircle },
  high: { label: "Alta", color: "text-destructive", icon: ArrowUpCircle },
  urgent: { label: "Urgente", color: "text-destructive", icon: AlertCircle },
};

const statusConfig: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  open: { label: "Aberto", color: "text-primary", bg: "bg-primary/10" },
  in_progress: { label: "Em Andamento", color: "text-warning", bg: "bg-warning/10" },
  resolved: { label: "Resolvido", color: "text-success", bg: "bg-success/10" },
  closed: { label: "Fechado", color: "text-muted-foreground", bg: "bg-muted/50" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

/* ─── FAQ Tab ─── */
function FAQTab() {
  const [search, setSearch] = useState("");
  const filtered = faqItems.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar nas perguntas frequentes..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-xs" />
      </div>
      <Accordion type="single" collapsible className="space-y-2">
        {filtered.map((item, i) => (
          <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
            <AccordionItem value={`faq-${i}`} className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-xs font-medium text-foreground hover:no-underline py-3.5">
                <div className="flex items-center gap-2 text-left">
                  <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  {item.q}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground pb-4 pl-6">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground">Nenhuma pergunta encontrada.</div>
        )}
      </Accordion>
    </div>
  );
}

/* ─── Tickets Tab ─── */
function TicketsTab() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [form, setForm] = useState({ subject: "", description: "", category: "Geral", priority: "medium" as TicketPriority });

  const handleCreate = () => {
    if (!form.subject.trim() || !form.description.trim()) return;
    const newTicket: SupportTicket = {
      id: Date.now(),
      subject: form.subject,
      description: form.description,
      priority: form.priority,
      status: "open",
      category: form.category,
      createdAt: new Date().toLocaleString("pt-BR"),
      updatedAt: new Date().toLocaleString("pt-BR"),
      messages: [{ sender: "user", text: form.description, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }],
    };
    setTickets((prev) => [newTicket, ...prev]);
    setCreateOpen(false);
    setForm({ subject: "", description: "", category: "Geral", priority: "medium" });
    toast({ title: "Ticket criado!", description: `#${newTicket.id} — ${newTicket.subject}` });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedTicket) return;
    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, { sender: "user" as const, text: chatInput, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }],
      updatedAt: new Date().toLocaleString("pt-BR"),
    };
    setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
    setSelectedTicket(updatedTicket);
    setChatInput("");
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {(["open", "in_progress", "resolved"] as TicketStatus[]).map((s) => {
            const count = tickets.filter((t) => t.status === s).length;
            const sc = statusConfig[s];
            return (
              <Badge key={s} variant="outline" className={cn("text-[10px] gap-1", sc.color)}>
                {sc.label} ({count})
              </Badge>
            );
          })}
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Novo Ticket
        </Button>
      </div>

      <div className="space-y-2">
        {tickets.map((ticket, i) => {
          const pc = priorityConfig[ticket.priority];
          const sc = statusConfig[ticket.status];
          return (
            <motion.div key={ticket.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              onClick={() => { setSelectedTicket(ticket); setChatInput(""); }}
              className="rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-muted-foreground font-mono">#{ticket.id}</span>
                    <Badge variant="outline" className={cn("text-[10px]", sc.color, sc.bg)}>{sc.label}</Badge>
                    <Badge variant="outline" className={cn("text-[10px] gap-0.5", pc.color)}>
                      <pc.icon className="h-2.5 w-2.5" /> {pc.label}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-medium text-foreground truncate">{ticket.subject}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{ticket.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> {ticket.createdAt}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-2.5 w-2.5" /> {ticket.messages.length}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mt-1" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Ticket className="h-5 w-5 text-primary" /> Novo Ticket</DialogTitle>
            <DialogDescription>Descreva seu problema ou solicitação.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Assunto *</Label>
              <Input placeholder="Resumo do problema" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Descrição *</Label>
              <Textarea placeholder="Descreva em detalhes..." rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Categoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Geral">Geral</SelectItem>
                    <SelectItem value="Integrações">Integrações</SelectItem>
                    <SelectItem value="Relatórios">Relatórios</SelectItem>
                    <SelectItem value="Faturamento">Faturamento</SelectItem>
                    <SelectItem value="Sugestão">Sugestão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Prioridade</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TicketPriority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button disabled={!form.subject.trim() || !form.description.trim()} onClick={handleCreate}>Criar Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Chat Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="truncate">{selectedTicket?.subject}</span>
              <Badge variant="outline" className={cn("text-[10px] ml-auto shrink-0", selectedTicket && statusConfig[selectedTicket.status].color)}>
                {selectedTicket && statusConfig[selectedTicket.status].label}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-[10px]">
              Ticket #{selectedTicket?.id} · {selectedTicket?.category} · Criado em {selectedTicket?.createdAt}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col h-72 border border-border rounded-lg overflow-hidden">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {selectedTicket?.messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}>
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                    <span className={cn(
                      "text-[9px] mt-1 block",
                      msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedTicket && selectedTicket.status !== "closed" && (
              <div className="border-t border-border p-2 flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="h-8 text-xs"
                />
                <Button size="sm" className="shrink-0 h-8 w-8 p-0" onClick={handleSendMessage} disabled={!chatInput.trim()}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ─── Live Chat Tab ─── */
function LiveChatTab() {
  const [messages, setMessages] = useState<{ sender: "user" | "support"; text: string; time: string }[]>([
    { sender: "support", text: "Olá! 👋 Como posso ajudar você hoje?", time: "Agora" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user" as const, text: input, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const responses = [
        "Entendi sua dúvida! Deixe-me verificar isso para você.",
        "Ótima pergunta! Vou buscar a informação agora.",
        "Obrigado por entrar em contato. Estou analisando sua solicitação.",
        "Claro! Posso ajudar com isso. Me dê um momento.",
      ];
      setMessages((prev) => [
        ...prev,
        { sender: "support" as const, text: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 1500);
  };

  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border p-3 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <LifeBuoy className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">Suporte CoreAI</p>
            <p className="text-[10px] text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
            </p>
          </div>
        </div>

        <div className="h-80 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}
              >
                <div className={cn(
                  "max-w-[80%] rounded-xl px-3 py-2",
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  <span className={cn(
                    "text-[9px] mt-1 block",
                    msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="border-t border-border p-3 flex gap-2">
          <Button size="sm" variant="outline" className="shrink-0 h-9 w-9 p-0">
            <Paperclip className="h-3.5 w-3.5" />
          </Button>
          <Input
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="h-9 text-xs"
          />
          <Button size="sm" className="shrink-0 h-9 gap-1.5 text-xs" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-3.5 w-3.5" /> Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */
const tabConfig = [
  { id: "faq", label: "FAQ", icon: BookOpen },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "chat", label: "Chat ao Vivo", icon: MessageCircle },
];

const SupportPage = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Suporte</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Central de ajuda, tickets e chat com a equipe de suporte.</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "FAQ Disponíveis", value: faqItems.length, icon: HelpCircle },
          { label: "Tickets Abertos", value: initialTickets.filter((t) => t.status === "open").length, icon: AlertCircle },
          { label: "Em Andamento", value: initialTickets.filter((t) => t.status === "in_progress").length, icon: Clock },
          { label: "Resolvidos", value: initialTickets.filter((t) => t.status === "resolved").length, icon: CheckCircle2 },
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

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="h-9 mb-6 bg-muted/50">
          {tabConfig.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="text-xs gap-1.5 data-[state=active]:bg-card">
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="faq"><FAQTab /></TabsContent>
        <TabsContent value="tickets"><TicketsTab /></TabsContent>
        <TabsContent value="chat"><LiveChatTab /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SupportPage;
