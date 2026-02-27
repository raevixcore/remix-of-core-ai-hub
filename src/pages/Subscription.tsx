import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  CreditCard, Zap, Check, ChevronRight, Crown, Rocket, Building2,
  ArrowUpRight, ArrowDownRight, Download, Calendar, Shield, Users,
  MessageSquare, Bot, HardDrive, BarChart3, Star,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

/* ─── Plans ─── */
interface Plan {
  id: string;
  name: string;
  icon: any;
  price: string;
  period: string;
  desc: string;
  features: string[];
  limits: { posts: number; conversations: number; storage: number; users: number };
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    id: "free", name: "Free", icon: Rocket, price: "R$ 0", period: "/mês",
    desc: "Para experimentar a plataforma.",
    features: ["1 canal", "100 mensagens/mês", "1 usuário", "Dashboard básico"],
    limits: { posts: 20, conversations: 100, storage: 1, users: 1 },
  },
  {
    id: "pro", name: "Pro", icon: Zap, price: "R$ 149", period: "/mês",
    desc: "Para equipes em crescimento.",
    features: ["3 canais", "Mensagens ilimitadas", "5 usuários", "IA integrada", "Estatísticas avançadas", "Suporte prioritário"],
    limits: { posts: 100, conversations: 500, storage: 5, users: 5 },
    highlighted: true,
  },
  {
    id: "business", name: "Business", icon: Crown, price: "R$ 397", period: "/mês",
    desc: "Para operações robustas.",
    features: ["10 canais", "Mensagens ilimitadas", "20 usuários", "IA personalizada", "API completa", "SLA dedicado", "Relatórios avançados"],
    limits: { posts: 500, conversations: 5000, storage: 20, users: 20 },
  },
  {
    id: "enterprise", name: "Enterprise", icon: Building2, price: "Sob consulta", period: "",
    desc: "Para grandes operações.",
    features: ["Canais ilimitados", "Mensagens ilimitadas", "Usuários ilimitados", "IA personalizada", "API completa", "SLA dedicado", "Onboarding VIP", "Suporte 24/7"],
    limits: { posts: 9999, conversations: 99999, storage: 100, users: 999 },
  },
];

const billingHistory = [
  { date: "01 Fev 2026", amount: "R$ 297,00", status: "Pago", invoice: "INV-2026-002" },
  { date: "01 Jan 2026", amount: "R$ 297,00", status: "Pago", invoice: "INV-2026-001" },
  { date: "01 Dez 2025", amount: "R$ 297,00", status: "Pago", invoice: "INV-2025-012" },
  { date: "01 Nov 2025", amount: "R$ 297,00", status: "Pago", invoice: "INV-2025-011" },
  { date: "01 Out 2025", amount: "R$ 297,00", status: "Pago", invoice: "INV-2025-010" },
];

const Subscription = () => {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState("pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const current = plans.find((p) => p.id === currentPlan)!;
  const selected = plans.find((p) => p.id === selectedPlan);

  const isUpgrade = (targetId: string) => {
    const order = ["free", "pro", "business", "enterprise"];
    return order.indexOf(targetId) > order.indexOf(currentPlan);
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) return;
    setSelectedPlan(planId);
    setShowConfirm(true);
  };

  const handleConfirmChange = () => {
    setProcessing(true);
    setTimeout(() => {
      setCurrentPlan(selectedPlan!);
      setProcessing(false);
      setShowConfirm(false);
      setShowChangePlan(false);
      toast({
        title: isUpgrade(selectedPlan!) ? "Upgrade realizado! 🚀" : "Plano alterado!",
        description: `Seu plano foi alterado para ${selected?.name}.`,
      });
    }, 1500);
  };

  // Mock usage
  const usage = { posts: 42, conversations: 128, storage: 1.2 };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Assinatura</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gerencie seu plano, uso e faturamento.</p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3 mb-6">
        {/* Current Plan */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="md:col-span-2 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <current.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">Plano {current.name}</h3>
                  <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Ativo</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{current.desc}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{current.price}<span className="text-sm font-normal text-muted-foreground">{current.period}</span></p>
            </div>
          </div>

          {/* Billing cycle toggle */}
          <div className="flex items-center gap-2 mb-5 p-1 bg-muted rounded-lg w-fit">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                billingCycle === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >Mensal</button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                billingCycle === "annual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Anual <Badge className="ml-1 text-[9px] bg-success/10 text-success border-success/20 px-1 py-0">-20%</Badge>
            </button>
          </div>

          {/* Subscription details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div className="rounded-lg bg-background/50 border border-border/50 p-3 text-center">
              <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">Próx. cobrança</p>
              <p className="text-xs font-semibold text-foreground">01 Mar 2026</p>
            </div>
            <div className="rounded-lg bg-background/50 border border-border/50 p-3 text-center">
              <Shield className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">Status</p>
              <p className="text-xs font-semibold text-success">Ativo</p>
            </div>
            <div className="rounded-lg bg-background/50 border border-border/50 p-3 text-center">
              <Users className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">Usuários</p>
              <p className="text-xs font-semibold text-foreground">3 / {current.limits.users}</p>
            </div>
            <div className="rounded-lg bg-background/50 border border-border/50 p-3 text-center">
              <BarChart3 className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">Canais</p>
              <p className="text-xs font-semibold text-foreground">2 / 3</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="sm" className="text-xs gap-1.5" onClick={() => setShowChangePlan(true)}>
              <ArrowUpRight className="h-3.5 w-3.5" /> Alterar Plano
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => {
              toast({ title: "Plano renovado! ✅", description: "Seu plano Pro foi renovado por mais 1 mês." });
            }}>
              <Zap className="h-3.5 w-3.5" /> Renovar Agora
            </Button>
            <Button size="sm" variant="ghost" className="text-xs text-destructive hover:text-destructive gap-1.5" onClick={() => {
              toast({ title: "Cancelamento solicitado", description: "Seu plano será encerrado ao fim do período atual." });
            }}>
              Cancelar Plano
            </Button>
          </div>
        </motion.div>

        {/* Usage */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Uso do Mês
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Posts gerados</span>
              <span className={cn("font-medium", usage.posts / current.limits.posts > 0.8 ? "text-warning" : "text-foreground")}>
                {usage.posts} / {current.limits.posts}
              </span>
            </div>
            <Progress value={(usage.posts / current.limits.posts) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1"><Bot className="h-3 w-3" /> Conversas IA</span>
              <span className="font-medium text-foreground">{usage.conversations} / {current.limits.conversations}</span>
            </div>
            <Progress value={(usage.conversations / current.limits.conversations) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1"><HardDrive className="h-3 w-3" /> Armazenamento</span>
              <span className="font-medium text-foreground">{usage.storage} GB / {current.limits.storage} GB</span>
            </div>
            <Progress value={(usage.storage / current.limits.storage) * 100} className="h-2" />
          </div>

          {usage.posts / current.limits.posts > 0.7 && (
            <div className="rounded-lg bg-warning/10 border border-warning/20 p-3">
              <p className="text-[10px] text-warning font-medium">⚠️ Uso de posts acima de 70%. Considere fazer upgrade.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Billing History */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-xl border border-border bg-card"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Histórico de Faturamento</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-xs gap-1.5">
            <Download className="h-3 w-3" /> Exportar
          </Button>
        </div>
        <div className="divide-y divide-border">
          {billingHistory.map((row, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground font-medium">{row.date}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{row.invoice}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-foreground">{row.amount}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-success/10 text-success border-success/20">
                  {row.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toast({ title: "Download iniciado", description: `Fatura ${row.invoice}` })}>
                  <Download className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Change Plan Dialog */}
      <Dialog open={showChangePlan} onOpenChange={setShowChangePlan}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Alterar Plano</DialogTitle>
            <DialogDescription>Escolha o plano ideal para sua operação. A alteração é imediata.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = plan.id === currentPlan;
              const upgrade = isUpgrade(plan.id);
              return (
                <div key={plan.id} className={cn(
                  "rounded-xl border p-4 flex flex-col transition-all",
                  isCurrent ? "border-primary ring-1 ring-primary/20 bg-primary/5"
                    : plan.highlighted ? "border-primary/40 hover:border-primary"
                    : "border-border hover:border-primary/30"
                )}>
                  {isCurrent && <Badge className="mb-2 w-fit text-[9px] bg-primary text-primary-foreground">Plano Atual</Badge>}
                  {plan.highlighted && !isCurrent && <Badge className="mb-2 w-fit text-[9px] bg-primary/10 text-primary border-primary/20">Popular</Badge>}

                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-bold text-foreground">{plan.name}</h4>
                  </div>

                  <p className="text-lg font-bold text-foreground mb-1">{plan.price}<span className="text-xs font-normal text-muted-foreground">{plan.period}</span></p>
                  <p className="text-[10px] text-muted-foreground mb-3">{plan.desc}</p>

                  <ul className="space-y-1.5 mb-4 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-[10px] text-foreground">
                        <Check className="h-3 w-3 text-success shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="sm"
                    variant={isCurrent ? "outline" : upgrade ? "default" : "outline"}
                    className="w-full text-xs"
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {isCurrent ? "Atual" : upgrade ? (
                      <><ArrowUpRight className="mr-1 h-3 w-3" /> Upgrade</>
                    ) : (
                      <><ArrowDownRight className="mr-1 h-3 w-3" /> Downgrade</>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Change Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{selected && isUpgrade(selected.id) ? "Confirmar Upgrade" : "Confirmar Alteração"}</DialogTitle>
            <DialogDescription>
              {selected && isUpgrade(selected.id)
                ? `Seu plano será atualizado de ${current.name} para ${selected?.name}. A diferença será cobrada proporcionalmente.`
                : `Seu plano será alterado de ${current.name} para ${selected?.name}. A mudança entra em vigor imediatamente.`
              }
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="rounded-lg border border-border bg-background/50 p-4 my-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Plano atual</span>
                <span className="text-xs font-medium text-foreground">{current.name} — {current.price}{current.period}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Novo plano</span>
                <span className="text-xs font-bold text-primary">{selected.name} — {selected.price}{selected.period}</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button size="sm" className="text-xs gap-1.5" onClick={handleConfirmChange} disabled={processing}>
              {processing ? (
                <><span className="h-3 w-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Processando...</>
              ) : (
                <><Check className="h-3 w-3" /> Confirmar</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Subscription;
