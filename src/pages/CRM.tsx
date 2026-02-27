import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Users, Plus, Search, MoreHorizontal, MessageSquare, Phone, Mail,
  Tag, Clock, Star, TrendingUp, UserCheck, Filter, Eye, Pencil, Trash2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ClientStatus = "active" | "inactive" | "lead" | "vip";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: ClientStatus;
  tags: string[];
  channel: string;
  totalMessages: number;
  lastContact: string;
  satisfaction: number;
  notes: string;
  createdAt: string;
}

const statusConfig: Record<ClientStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Ativo", color: "text-success", bg: "bg-success/10" },
  inactive: { label: "Inativo", color: "text-muted-foreground", bg: "bg-muted/50" },
  lead: { label: "Lead", color: "text-warning", bg: "bg-warning/10" },
  vip: { label: "VIP", color: "text-primary", bg: "bg-primary/10" },
};

const allTags = ["Premium", "Recorrente", "Novo", "Suporte Prioridade", "Parceiro", "Enterprise", "Trial", "Churn Risk"];

const initialClients: Client[] = [
  { id: 1, name: "Maria Santos", email: "maria@techcorp.com", phone: "(11) 98765-4321", company: "TechCorp", status: "vip", tags: ["Premium", "Recorrente"], channel: "WhatsApp", totalMessages: 342, lastContact: "Hoje, 15:30", satisfaction: 98, notes: "Cliente desde 2022. Interessada em plano Enterprise.", createdAt: "2022-03-15" },
  { id: 2, name: "Carlos Oliveira", email: "carlos@startup.io", phone: "(21) 97654-3210", company: "Startup.io", status: "active", tags: ["Novo", "Trial"], channel: "Telegram", totalMessages: 87, lastContact: "Hoje, 14:20", satisfaction: 92, notes: "Em período de trial. Demonstrou interesse no módulo de IA.", createdAt: "2024-01-05" },
  { id: 3, name: "Ana Ferreira", email: "ana@designlab.com", phone: "(31) 96543-2109", company: "DesignLab", status: "active", tags: ["Recorrente", "Parceiro"], channel: "Instagram", totalMessages: 156, lastContact: "Ontem", satisfaction: 95, notes: "Parceira de conteúdo. Faz co-marketing conosco.", createdAt: "2023-06-20" },
  { id: 4, name: "Roberto Lima", email: "roberto@megacorp.com", phone: "(41) 95432-1098", company: "MegaCorp", status: "vip", tags: ["Enterprise", "Premium"], channel: "WhatsApp", totalMessages: 523, lastContact: "Hoje, 10:45", satisfaction: 99, notes: "Conta Enterprise. 50 usuários ativos. Renovação em março.", createdAt: "2021-11-08" },
  { id: 5, name: "Juliana Costa", email: "juliana@edu.org", phone: "(51) 94321-0987", company: "EduOrg", status: "lead", tags: ["Novo"], channel: "Telegram", totalMessages: 12, lastContact: "3 dias atrás", satisfaction: 0, notes: "Solicitou demonstração do produto. Agendar call.", createdAt: "2024-01-12" },
  { id: 6, name: "Pedro Mendes", email: "pedro@shop.com", phone: "(61) 93210-9876", company: "ShopOnline", status: "inactive", tags: ["Churn Risk"], channel: "WhatsApp", totalMessages: 245, lastContact: "2 semanas atrás", satisfaction: 72, notes: "Não responde há 2 semanas. Risco de churn alto.", createdAt: "2023-01-30" },
  { id: 7, name: "Fernanda Souza", email: "fernanda@health.com", phone: "(71) 92109-8765", company: "HealthTech", status: "active", tags: ["Recorrente", "Suporte Prioridade"], channel: "Instagram", totalMessages: 189, lastContact: "Ontem", satisfaction: 94, notes: "Suporte prioritário ativo. Satisfeita com o produto.", createdAt: "2023-04-10" },
  { id: 8, name: "Lucas Almeida", email: "lucas@fintech.com", phone: "(81) 91098-7654", company: "FinTech Plus", status: "lead", tags: ["Enterprise"], channel: "Telegram", totalMessages: 28, lastContact: "5 dias atrás", satisfaction: 0, notes: "Interessado em integração com API. Enviar documentação.", createdAt: "2024-01-08" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.3 } }),
};

const channelColor = (ch: string) => {
  if (ch === "WhatsApp") return "text-success";
  if (ch === "Telegram") return "text-warning";
  return "text-primary";
};

const CRMPage = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", status: "lead" as ClientStatus,
    tags: [] as string[], channel: "WhatsApp", notes: "",
  });

  const filtered = clients.filter((c) => {
    const matchSearch = search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const newClient: Client = {
      id: Date.now(), name: form.name, email: form.email, phone: form.phone,
      company: form.company, status: form.status, tags: form.tags,
      channel: form.channel, totalMessages: 0, lastContact: "Agora",
      satisfaction: 0, notes: form.notes, createdAt: new Date().toISOString().split("T")[0],
    };
    setClients((prev) => [newClient, ...prev]);
    setCreateOpen(false);
    setForm({ name: "", email: "", phone: "", company: "", status: "lead", tags: [], channel: "WhatsApp", notes: "" });
    toast({ title: "Cliente adicionado!", description: `${newClient.name} — ${newClient.company}` });
  };

  const handleDelete = (client: Client) => {
    setClients((prev) => prev.filter((c) => c.id !== client.id));
    setSelectedClient(null);
    toast({ title: "Removido", description: `${client.name} foi removido do CRM.` });
  };

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active" || c.status === "vip").length,
    leads: clients.filter((c) => c.status === "lead").length,
    vip: clients.filter((c) => c.status === "vip").length,
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">CRM de Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie contatos, interações e segmentação.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Novo Cliente
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Clientes", value: stats.total, icon: Users },
          { label: "Ativos", value: stats.active, icon: UserCheck },
          { label: "Leads", value: stats.leads, icon: TrendingUp },
          { label: "VIP", value: stats.vip, icon: Star },
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
          <Input placeholder="Buscar cliente, empresa..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs" />
        </div>
        <div className="flex gap-1.5">
          {[{ key: "all", label: "Todos" }, ...Object.entries(statusConfig).map(([k, v]) => ({ key: k, label: v.label }))].map((f) => (
            <Button key={f.key} size="sm" variant={statusFilter === f.key ? "default" : "outline"}
              className="text-[10px] h-7 px-2.5" onClick={() => setStatusFilter(f.key)}>
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Client Cards */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="h-9 mb-4 bg-muted/50">
          <TabsTrigger value="grid" className="text-xs">Cards</TabsTrigger>
          <TabsTrigger value="table" className="text-xs">Tabela</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((client, i) => {
              const sc = statusConfig[client.status];
              return (
                <motion.div key={client.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                  onClick={() => setSelectedClient(client)}
                  className="rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {client.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{client.name}</p>
                        <p className="text-[10px] text-muted-foreground">{client.company}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", sc.color, sc.bg)}>{sc.label}</Badge>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                    <span className={cn("flex items-center gap-1", channelColor(client.channel))}>
                      <MessageSquare className="h-2.5 w-2.5" /> {client.channel}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-2.5 w-2.5" /> {client.totalMessages}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {client.lastContact}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {client.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[8px] px-1.5 py-0 h-4">{tag}</Badge>
                    ))}
                    {client.tags.length > 3 && (
                      <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4">+{client.tags.length - 3}</Badge>
                    )}
                  </div>

                  {client.satisfaction > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Satisfação</span>
                      <span className={cn("text-xs font-bold", client.satisfaction >= 90 ? "text-success" : client.satisfaction >= 70 ? "text-warning" : "text-destructive")}>
                        {client.satisfaction}%
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Canal</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Msgs</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Satisfação</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => {
                  const sc = statusConfig[client.status];
                  return (
                    <tr key={client.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-primary">
                              {client.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{client.name}</p>
                            <p className="text-[9px] text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground">{client.company}</td>
                      <td className="py-2.5 px-4"><span className={channelColor(client.channel)}>{client.channel}</span></td>
                      <td className="py-2.5 px-4">
                        <Badge variant="outline" className={cn("text-[10px]", sc.color, sc.bg)}>{sc.label}</Badge>
                      </td>
                      <td className="py-2.5 px-4 text-right text-foreground">{client.totalMessages}</td>
                      <td className="py-2.5 px-4 text-right">
                        {client.satisfaction > 0 ? (
                          <span className={cn("font-bold", client.satisfaction >= 90 ? "text-success" : "text-warning")}>{client.satisfaction}%</span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-xs gap-2 cursor-pointer" onClick={() => setSelectedClient(client)}>
                              <Eye className="h-3.5 w-3.5" /> Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={() => handleDelete(client)}>
                              <Trash2 className="h-3.5 w-3.5" /> Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Novo Cliente</DialogTitle>
            <DialogDescription>Adicione um novo contato ao CRM.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Nome *</Label><Input placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Email *</Label><Input type="email" placeholder="email@empresa.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Telefone</Label><Input placeholder="(00) 00000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Empresa</Label><Input placeholder="Nome da empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ClientStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Canal Principal</Label>
                <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Telegram">Telegram</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <Badge key={tag} variant={form.tags.includes(tag) ? "default" : "outline"}
                    className="text-[10px] cursor-pointer" onClick={() => toggleTag(tag)}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Observações</Label>
              <Textarea placeholder="Notas sobre o cliente..." rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button disabled={!form.name.trim() || !form.email.trim()} onClick={handleCreate}>Adicionar Cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <DialogContent className="max-w-lg">
          {selectedClient && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {selectedClient.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <DialogTitle className="text-sm">{selectedClient.name}</DialogTitle>
                    <DialogDescription className="text-[10px]">{selectedClient.company} · Cliente desde {selectedClient.createdAt}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center rounded-lg border border-border p-2">
                    <p className="text-lg font-bold text-foreground">{selectedClient.totalMessages}</p>
                    <p className="text-[9px] text-muted-foreground">Mensagens</p>
                  </div>
                  <div className="text-center rounded-lg border border-border p-2">
                    <p className={cn("text-lg font-bold", selectedClient.satisfaction >= 90 ? "text-success" : "text-warning")}>
                      {selectedClient.satisfaction > 0 ? `${selectedClient.satisfaction}%` : "—"}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Satisfação</p>
                  </div>
                  <div className="text-center rounded-lg border border-border p-2">
                    <p className={cn("text-lg font-bold", channelColor(selectedClient.channel))}>{selectedClient.channel}</p>
                    <p className="text-[9px] text-muted-foreground">Canal</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /> {selectedClient.email}</div>
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /> {selectedClient.phone}</div>
                  <div className="flex items-center gap-2"><Clock className="h-3 w-3 text-muted-foreground" /> Último contato: {selectedClient.lastContact}</div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedClient.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px]"><Tag className="h-2 w-2 mr-0.5" />{tag}</Badge>
                    ))}
                  </div>
                </div>

                {selectedClient.notes && (
                  <div className="rounded-lg border border-border p-3 bg-muted/30">
                    <Label className="text-[10px] text-muted-foreground">Observações</Label>
                    <p className="text-xs text-foreground mt-1">{selectedClient.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" className="text-destructive gap-1.5 text-xs" onClick={() => handleDelete(selectedClient)}>
                  <Trash2 className="h-3.5 w-3.5" /> Remover
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CRMPage;
