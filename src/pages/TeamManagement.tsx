import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Users, Plus, Search, MoreHorizontal, Shield, UserCog, Headphones,
  Mail, Trash2, Pencil, CheckCircle2, Clock,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Role = "admin" | "manager" | "agent";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
  lastActive: string;
  messagesHandled: number;
}

const initialMembers: TeamMember[] = [
  { id: 1, name: "João Silva", email: "joao@empresa.com", role: "admin", status: "active", lastActive: "Agora", messagesHandled: 1280 },
  { id: 2, name: "Ana Costa", email: "ana@empresa.com", role: "manager", status: "active", lastActive: "5 min", messagesHandled: 1160 },
  { id: 3, name: "Pedro Santos", email: "pedro@empresa.com", role: "agent", status: "active", lastActive: "12 min", messagesHandled: 980 },
  { id: 4, name: "Maria Oliveira", email: "maria@empresa.com", role: "agent", status: "active", lastActive: "1h", messagesHandled: 840 },
  { id: 5, name: "Lucas Ferreira", email: "lucas@empresa.com", role: "agent", status: "inactive", lastActive: "3 dias", messagesHandled: 572 },
];

const roleConfig: Record<Role, { label: string; icon: typeof Shield; color: string; desc: string }> = {
  admin: { label: "Admin", icon: Shield, color: "text-primary", desc: "Acesso total ao sistema" },
  manager: { label: "Manager", icon: UserCog, color: "text-warning", desc: "Gerencia equipe e relatórios" },
  agent: { label: "Agente", icon: Headphones, color: "text-success", desc: "Atende conversas e tarefas" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

const TeamManagement = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "agent" as Role });

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => setForm({ name: "", email: "", password: "", role: "agent" });

  const handleCreate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;
    const newMember: TeamMember = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      role: form.role,
      status: "active",
      lastActive: "Agora",
      messagesHandled: 0,
    };
    setMembers((prev) => [...prev, newMember]);
    setCreateOpen(false);
    resetForm();
    toast({ title: "Usuário criado!", description: `${newMember.name} adicionado como ${roleConfig[newMember.role].label}.` });
  };

  const handleEdit = () => {
    if (!editTarget) return;
    setMembers((prev) => prev.map((m) => m.id === editTarget.id ? { ...m, name: form.name, email: form.email, role: form.role } : m));
    setEditTarget(null);
    resetForm();
    toast({ title: "Atualizado!", description: "Dados do usuário atualizados." });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast({ title: "Removido", description: `${deleteTarget.name} foi removido da equipe.` });
  };

  const openEdit = (m: TeamMember) => {
    setForm({ name: m.name, email: m.email, password: "", role: m.role });
    setEditTarget(m);
  };

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "active").length,
    admins: members.filter((m) => m.role === "admin").length,
    agents: members.filter((m) => m.role === "agent").length,
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Equipe</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gerencie os membros e permissões da sua empresa.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: Users },
          { label: "Ativos", value: stats.active, icon: CheckCircle2 },
          { label: "Admins", value: stats.admins, icon: Shield },
          { label: "Agentes", value: stats.agents, icon: Headphones },
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

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar membro..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs" />
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => { resetForm(); setCreateOpen(true); }}>
          <Plus className="h-3.5 w-3.5" /> Novo Membro
        </Button>
      </div>

      {/* Table */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Membro</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Função</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Mensagens</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Última Atividade</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const rc = roleConfig[m.role];
                return (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-[10px] font-semibold text-primary">
                            {m.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Mail className="h-2.5 w-2.5" /> {m.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={cn("text-[10px] gap-1", rc.color)}>
                        <rc.icon className="h-2.5 w-2.5" /> {rc.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-medium",
                        m.status === "active" ? "text-success" : "text-muted-foreground"
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", m.status === "active" ? "bg-success" : "bg-muted-foreground")} />
                        {m.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">{m.messagesHandled.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" /> {m.lastActive}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-xs gap-2 cursor-pointer" onClick={() => openEdit(m)}>
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(m)}>
                            <Trash2 className="h-3.5 w-3.5" /> Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">Nenhum membro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Permissions legend */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}
        className="mt-6 rounded-xl border border-border bg-card p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Funções e Permissões</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.entries(roleConfig) as [Role, typeof roleConfig.admin][]).map(([key, r]) => (
            <div key={key} className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
              <div className={cn("h-8 w-8 rounded-lg bg-accent/50 flex items-center justify-center shrink-0", r.color)}>
                <r.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{r.label}</p>
                <p className="text-[10px] text-muted-foreground">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Novo Membro</DialogTitle>
            <DialogDescription>Adicione um novo usuário à sua equipe.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Nome *</Label><Input placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Email *</Label><Input type="email" placeholder="email@empresa.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Senha de Acesso *</Label><Input type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div className="space-y-2">
              <Label className="text-xs">Função</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button disabled={!form.name.trim() || !form.email.trim() || !form.password.trim() || form.password.length < 6} onClick={handleCreate}>Criar Membro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pencil className="h-5 w-5 text-primary" /> Editar Membro</DialogTitle>
            <DialogDescription>Atualize os dados do membro.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2">
              <Label className="text-xs">Função</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancelar</Button>
            <Button onClick={handleEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover membro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{deleteTarget?.name}</strong> da equipe? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default TeamManagement;
