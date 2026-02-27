import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Zap, Plus, ArrowRight, MessageSquare, Mail, Bell, Shield,
  AlertTriangle, UserCheck, Clock, CheckCircle2, Trash2, Play,
  Pause, BarChart3, TrendingUp, Workflow,
} from "lucide-react";

interface AutomationFlow {
  id: number;
  name: string;
  description: string;
  trigger: { type: string; label: string; icon: any };
  conditions: { label: string }[];
  actions: { type: string; label: string; icon: any }[];
  active: boolean;
  executions: number;
  lastRun: string;
  successRate: number;
}

const triggerOptions = [
  { type: "new_message", label: "Nova mensagem recebida", icon: MessageSquare },
  { type: "negative_sentiment", label: "Sentimento negativo detectado", icon: AlertTriangle },
  { type: "no_response", label: "Sem resposta há X minutos", icon: Clock },
  { type: "new_lead", label: "Novo lead cadastrado", icon: UserCheck },
  { type: "keyword", label: "Palavra-chave detectada", icon: MessageSquare },
  { type: "high_score", label: "Lead score > limite", icon: TrendingUp },
];

const actionOptions = [
  { type: "notify_admin", label: "Notificar administrador", icon: Bell },
  { type: "assign_agent", label: "Atribuir a agente", icon: UserCheck },
  { type: "send_email", label: "Enviar email", icon: Mail },
  { type: "send_message", label: "Enviar mensagem automática", icon: MessageSquare },
  { type: "escalate", label: "Escalar para humano", icon: Shield },
  { type: "add_tag", label: "Adicionar tag ao contato", icon: CheckCircle2 },
  { type: "move_pipeline", label: "Mover no pipeline", icon: ArrowRight },
];

const initialFlows: AutomationFlow[] = [
  {
    id: 1, name: "Escalar Sentimento Negativo", description: "Quando IA detecta sentimento negativo, escala para humano e notifica admin.",
    trigger: { type: "negative_sentiment", label: "Sentimento negativo detectado", icon: AlertTriangle },
    conditions: [{ label: "Score de sentimento < 0.3" }, { label: "Canal: WhatsApp ou Telegram" }],
    actions: [
      { type: "escalate", label: "Escalar para humano", icon: Shield },
      { type: "notify_admin", label: "Notificar administrador", icon: Bell },
      { type: "add_tag", label: "Tag: urgente", icon: CheckCircle2 },
    ],
    active: true, executions: 342, lastRun: "Há 12 min", successRate: 98,
  },
  {
    id: 2, name: "Welcome Sequence", description: "Envia sequência de boas-vindas para novos leads.",
    trigger: { type: "new_lead", label: "Novo lead cadastrado", icon: UserCheck },
    conditions: [{ label: "Canal: qualquer" }],
    actions: [
      { type: "send_message", label: "Mensagem de boas-vindas", icon: MessageSquare },
      { type: "send_email", label: "Email de onboarding", icon: Mail },
      { type: "assign_agent", label: "Atribuir ao time de vendas", icon: UserCheck },
    ],
    active: true, executions: 1250, lastRun: "Há 5 min", successRate: 99,
  },
  {
    id: 3, name: "SLA — Tempo de Resposta", description: "Alerta quando conversa fica sem resposta por mais de 5 minutos.",
    trigger: { type: "no_response", label: "Sem resposta há 5 minutos", icon: Clock },
    conditions: [{ label: "Status: em andamento" }, { label: "Prioridade: alta" }],
    actions: [
      { type: "notify_admin", label: "Notificar supervisor", icon: Bell },
      { type: "assign_agent", label: "Reatribuir a agente disponível", icon: UserCheck },
    ],
    active: true, executions: 567, lastRun: "Há 30 min", successRate: 95,
  },
  {
    id: 4, name: "Lead Scoring Auto", description: "Move lead no pipeline quando score ultrapassa 80.",
    trigger: { type: "high_score", label: "Lead score > 80", icon: TrendingUp },
    conditions: [{ label: "Status atual: Lead ou MQL" }],
    actions: [
      { type: "move_pipeline", label: "Mover para SQL", icon: ArrowRight },
      { type: "notify_admin", label: "Notificar time comercial", icon: Bell },
      { type: "send_email", label: "Enviar proposta automática", icon: Mail },
    ],
    active: false, executions: 89, lastRun: "Há 2 dias", successRate: 92,
  },
  {
    id: 5, name: "Keyword: Cancelar", description: "Detecta intenção de cancelamento e aciona retenção.",
    trigger: { type: "keyword", label: 'Palavra-chave: "cancelar", "desistir"', icon: MessageSquare },
    conditions: [{ label: "Cliente ativo com plano pago" }],
    actions: [
      { type: "escalate", label: "Transferir para retenção", icon: Shield },
      { type: "add_tag", label: "Tag: churn-risk", icon: CheckCircle2 },
      { type: "notify_admin", label: "Alerta: risco de churn", icon: Bell },
    ],
    active: true, executions: 45, lastRun: "Há 3h", successRate: 87,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3 } }),
};

const AutomationsPage = () => {
  const { toast } = useToast();
  const [flows, setFlows] = useState(initialFlows);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<AutomationFlow | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", triggerIdx: 0,
    actionIdxs: [0] as number[],
  });

  const toggleFlow = (id: number) => {
    setFlows((prev) => prev.map((f) => f.id === id ? { ...f, active: !f.active } : f));
    const flow = flows.find((f) => f.id === id);
    toast({ title: flow?.active ? "Automação pausada" : "Automação ativada", description: flow?.name });
  };

  const deleteFlow = (id: number) => {
    setFlows((prev) => prev.filter((f) => f.id !== id));
    setSelectedFlow(null);
    toast({ title: "Removida", description: "Automação removida com sucesso." });
  };

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const trigger = triggerOptions[form.triggerIdx];
    const actions = form.actionIdxs.map((idx) => actionOptions[idx]);
    const newFlow: AutomationFlow = {
      id: Date.now(), name: form.name, description: form.description,
      trigger: { type: trigger.type, label: trigger.label, icon: trigger.icon },
      conditions: [], actions: actions.map((a) => ({ type: a.type, label: a.label, icon: a.icon })),
      active: true, executions: 0, lastRun: "Nunca", successRate: 0,
    };
    setFlows((prev) => [newFlow, ...prev]);
    setCreateOpen(false);
    setForm({ name: "", description: "", triggerIdx: 0, actionIdxs: [0] });
    toast({ title: "Automação criada!", description: newFlow.name });
  };

  const addAction = () => {
    setForm((f) => ({ ...f, actionIdxs: [...f.actionIdxs, 0] }));
  };

  const stats = {
    total: flows.length,
    active: flows.filter((f) => f.active).length,
    totalExecutions: flows.reduce((sum, f) => sum + f.executions, 0),
    avgSuccess: flows.length > 0 ? Math.round(flows.reduce((sum, f) => sum + f.successRate, 0) / flows.length) : 0,
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" /> Automações
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Crie fluxos automáticos com triggers, condições e ações.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Nova Automação
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: Zap },
          { label: "Ativas", value: stats.active, icon: Play },
          { label: "Execuções", value: stats.totalExecutions.toLocaleString(), icon: BarChart3 },
          { label: "Sucesso Médio", value: `${stats.avgSuccess}%`, icon: CheckCircle2 },
        ].map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Flows */}
      <div className="space-y-3">
        {flows.map((flow, i) => (
          <motion.div key={flow.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className={cn("rounded-xl border bg-card p-5 transition-all cursor-pointer hover:border-primary/30",
              flow.active ? "border-border" : "border-border/50 opacity-70"
            )}
            onClick={() => setSelectedFlow(flow)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", flow.active ? "bg-primary/10" : "bg-muted/50")}>
                  <Zap className={cn("h-5 w-5", flow.active ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{flow.name}</p>
                  <p className="text-[10px] text-muted-foreground">{flow.description}</p>
                </div>
              </div>
              <Switch checked={flow.active} onCheckedChange={() => { toggleFlow(flow.id); }} onClick={(e) => e.stopPropagation()} />
            </div>

            {/* Visual Flow */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge variant="outline" className="text-[10px] gap-1 py-1 px-2">
                <flow.trigger.icon className="h-3 w-3" /> {flow.trigger.label}
              </Badge>
              {flow.conditions.length > 0 && (
                <>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <Badge variant="outline" className="text-[10px] text-warning py-1 px-2">
                    {flow.conditions.length} condição(ões)
                  </Badge>
                </>
              )}
              <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
              {flow.actions.map((action, ai) => (
                <span key={ai} className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px] text-success gap-1 py-1 px-2">
                    <action.icon className="h-3 w-3" /> {action.label}
                  </Badge>
                  {ai < flow.actions.length - 1 && <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><BarChart3 className="h-2.5 w-2.5" /> {flow.executions.toLocaleString()} execuções</span>
              <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> Último: {flow.lastRun}</span>
              <span className={cn("flex items-center gap-1 font-bold", flow.successRate >= 90 ? "text-success" : "text-warning")}>
                <CheckCircle2 className="h-2.5 w-2.5" /> {flow.successRate}% sucesso
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Flow Detail Dialog */}
      <Dialog open={!!selectedFlow} onOpenChange={(open) => !open && setSelectedFlow(null)}>
        <DialogContent className="max-w-lg">
          {selectedFlow && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm">
                  <Zap className="h-5 w-5 text-primary" /> {selectedFlow.name}
                </DialogTitle>
                <DialogDescription className="text-[10px]">{selectedFlow.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="rounded-lg border border-border p-3">
                  <Label className="text-[10px] text-muted-foreground font-semibold">Trigger</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <selectedFlow.trigger.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs text-foreground">{selectedFlow.trigger.label}</span>
                  </div>
                </div>

                {selectedFlow.conditions.length > 0 && (
                  <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
                    <Label className="text-[10px] text-warning font-semibold">Condições</Label>
                    <ul className="mt-1 space-y-1">
                      {selectedFlow.conditions.map((c, i) => (
                        <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-warning" /> {c.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-lg border border-success/20 bg-success/5 p-3">
                  <Label className="text-[10px] text-success font-semibold">Ações</Label>
                  <div className="mt-1 space-y-1.5">
                    {selectedFlow.actions.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{i + 1}</Badge>
                        <a.icon className="h-3.5 w-3.5 text-success" />
                        <span className="text-xs text-foreground">{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center rounded-lg border border-border p-2">
                    <p className="text-lg font-bold text-foreground">{selectedFlow.executions.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Execuções</p>
                  </div>
                  <div className="text-center rounded-lg border border-border p-2">
                    <p className={cn("text-lg font-bold", selectedFlow.successRate >= 90 ? "text-success" : "text-warning")}>{selectedFlow.successRate}%</p>
                    <p className="text-[9px] text-muted-foreground">Sucesso</p>
                  </div>
                  <div className="text-center rounded-lg border border-border p-2">
                    <p className="text-sm font-bold text-foreground">{selectedFlow.lastRun}</p>
                    <p className="text-[9px] text-muted-foreground">Último Run</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" className="text-destructive gap-1.5 text-xs" onClick={() => deleteFlow(selectedFlow.id)}>
                  <Trash2 className="h-3.5 w-3.5" /> Remover
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Nova Automação</DialogTitle>
            <DialogDescription>Crie um fluxo automático com trigger e ações.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Nome *</Label><Input placeholder="Nome da automação" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Descrição</Label><Input placeholder="O que essa automação faz?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-2">
              <Label className="text-xs">Trigger (Quando?)</Label>
              <Select value={String(form.triggerIdx)} onValueChange={(v) => setForm({ ...form, triggerIdx: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{triggerOptions.map((t, i) => <SelectItem key={i} value={String(i)}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Ações (Então?)</Label>
                <Button variant="ghost" size="sm" className="text-[10px] h-6 gap-1" onClick={addAction}>
                  <Plus className="h-3 w-3" /> Ação
                </Button>
              </div>
              {form.actionIdxs.map((actionIdx, i) => (
                <Select key={i} value={String(actionIdx)} onValueChange={(v) => {
                  const newActions = [...form.actionIdxs];
                  newActions[i] = Number(v);
                  setForm({ ...form, actionIdxs: newActions });
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{actionOptions.map((a, ai) => <SelectItem key={ai} value={String(ai)}>{a.label}</SelectItem>)}</SelectContent>
                </Select>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button disabled={!form.name.trim()} onClick={handleCreate}>Criar Automação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AutomationsPage;
