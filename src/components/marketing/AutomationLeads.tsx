import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Zap, Users, Mail, Target, TrendingUp, ArrowRight,
  CheckCircle2, Clock, AlertCircle, Star, MessageSquare,
  Megaphone, BookOpen, Palette, Shield,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3 } }),
};

// Lead Pipeline
const leadPipeline = [
  { stage: "Novos Leads", count: 245, value: "R$ 122.500", color: "bg-muted" },
  { stage: "Qualificados (MQL)", count: 128, value: "R$ 96.000", color: "bg-primary/20" },
  { stage: "Sales Ready (SQL)", count: 52, value: "R$ 78.000", color: "bg-primary/40" },
  { stage: "Em Negociação", count: 23, value: "R$ 57.500", color: "bg-primary/60" },
  { stage: "Fechados (Won)", count: 12, value: "R$ 42.000", color: "bg-success" },
];

// Lead Scoring
const leads = [
  { name: "TechCorp Brasil", score: 92, status: "hot", activity: "Visitou pricing 3x", channel: "Google Ads", daysInPipeline: 5 },
  { name: "StartupXYZ", score: 78, status: "warm", activity: "Download ebook", channel: "LinkedIn", daysInPipeline: 12 },
  { name: "MegaRetail", score: 85, status: "hot", activity: "Agendou demo", channel: "Indicação", daysInPipeline: 3 },
  { name: "EduTech Plus", score: 45, status: "cold", activity: "Abriu email", channel: "Email Mkt", daysInPipeline: 30 },
  { name: "HealthCare Inc", score: 68, status: "warm", activity: "Webinar assistido", channel: "Orgânico", daysInPipeline: 18 },
  { name: "FinServe", score: 91, status: "hot", activity: "Solicitou proposta", channel: "Outbound", daysInPipeline: 7 },
];

const statusConfig = {
  hot: { label: "🔥 Hot", color: "text-destructive" },
  warm: { label: "🟡 Warm", color: "text-warning" },
  cold: { label: "🧊 Cold", color: "text-muted-foreground" },
};

// Automation Flows
const automationFlows = [
  { name: "Welcome Series", trigger: "Novo cadastro", steps: 5, active: true, sent: 3420, opened: 2190, clicked: 876, converted: 245 },
  { name: "Lead Nurturing", trigger: "Download de material", steps: 8, active: true, sent: 1850, opened: 1110, clicked: 555, converted: 128 },
  { name: "Reengajamento", trigger: "30 dias sem login", steps: 3, active: true, sent: 920, opened: 460, clicked: 138, converted: 42 },
  { name: "Onboarding Trial", trigger: "Início do trial", steps: 7, active: true, sent: 1200, opened: 840, clicked: 504, converted: 180 },
  { name: "Upsell Enterprise", trigger: "Score > 80 + Plano Pro", steps: 4, active: false, sent: 350, opened: 245, clicked: 122, converted: 35 },
];

// Inbound Strategy
const inboundStages = [
  { stage: "Atrair", desc: "Blog SEO, Redes Sociais, Vídeos", tactics: ["Conteúdo educativo", "SEO on-page", "Social media"], icon: Megaphone, metrics: "12.5K visitas/mês" },
  { stage: "Converter", desc: "Landing Pages, CTAs, Forms", tactics: ["Lead magnets", "Pop-ups inteligentes", "Chatbot"], icon: Target, metrics: "3.7K leads/mês" },
  { stage: "Fechar", desc: "Email, CRM, Sales", tactics: ["Lead scoring", "Nutrição automatizada", "Sales enablement"], icon: CheckCircle2, metrics: "180 clientes/mês" },
  { stage: "Encantar", desc: "Suporte, Comunidade, Conteúdo", tactics: ["NPS", "Programa de indicação", "Customer success"], icon: Star, metrics: "NPS 72" },
];

// Growth Experiments
const growthExperiments = [
  { name: "Product-Led Growth — Trial sem cartão", status: "running", metric: "+35% sign-ups", impact: "high" },
  { name: "Referral Program — R$50/indicação", status: "planned", metric: "Meta: 200 indicações/mês", impact: "high" },
  { name: "Viral Loop — Share & Get features", status: "running", metric: "+18% compartilhamentos", impact: "medium" },
  { name: "Content-Led Growth — Template grátis", status: "completed", metric: "+62% tráfego orgânico", impact: "high" },
  { name: "Community-Led — Grupo exclusivo Telegram", status: "running", metric: "450 membros ativos", impact: "medium" },
];

// Branding
const brandElements = [
  { element: "Missão", value: "Democratizar o atendimento ao cliente com IA, tornando cada interação mais humana e eficiente." },
  { element: "Visão", value: "Ser a plataforma líder de atendimento inteligente na América Latina até 2028." },
  { element: "Valores", value: "Inovação, Empatia, Transparência, Excelência, Colaboração" },
  { element: "Tom de Voz", value: "Profissional mas acessível. Confiante sem ser arrogante. Técnico quando necessário, simples sempre." },
  { element: "Proposta de Valor", value: "Reduza 50% do tempo de atendimento e aumente a satisfação do cliente com IA conversacional." },
];

export function AutomationLeads() {
  return (
    <div className="space-y-6">
      {/* Lead Pipeline */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" /> Pipeline de Leads
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {leadPipeline.map((stage, i) => (
            <motion.div key={stage.stage} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="min-w-[140px] flex-1 rounded-lg border border-border p-3 text-center"
            >
              <div className={cn("h-2 rounded-full mb-2", stage.color)} />
              <p className="text-xl font-bold text-foreground">{stage.count}</p>
              <p className="text-[10px] font-medium text-foreground mb-0.5">{stage.stage}</p>
              <p className="text-[10px] text-muted-foreground">{stage.value}</p>
              {i < leadPipeline.length - 1 && (
                <ArrowRight className="h-3 w-3 text-muted-foreground mx-auto mt-1" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lead Scoring */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> Lead Scoring & Qualificação
        </h3>
        <div className="space-y-2">
          {leads.map((lead, i) => {
            const sc = statusConfig[lead.status];
            return (
              <motion.div key={lead.name} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-primary">{lead.score}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{lead.name}</p>
                    <span className={cn("text-[10px]", sc.color)}>{sc.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{lead.activity} · via {lead.channel}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", lead.score >= 80 ? "bg-success" : lead.score >= 60 ? "bg-warning" : "bg-muted-foreground")}
                      style={{ width: `${lead.score}%` }} />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{lead.daysInPipeline}d no pipeline</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Automation Flows */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Automações de Marketing
        </h3>
        <div className="space-y-2">
          {automationFlows.map((flow, i) => (
            <motion.div key={flow.name} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">{flow.name}</p>
                  <Badge variant="outline" className={cn("text-[9px]", flow.active ? "text-success" : "text-muted-foreground")}>
                    {flow.active ? "Ativa" : "Pausada"}
                  </Badge>
                </div>
                <Badge variant="outline" className="text-[9px]">{flow.steps} etapas</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">Trigger: {flow.trigger}</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center rounded-md bg-muted/30 p-1.5">
                  <p className="text-xs font-bold text-foreground">{flow.sent.toLocaleString()}</p>
                  <p className="text-[8px] text-muted-foreground">Enviados</p>
                </div>
                <div className="text-center rounded-md bg-muted/30 p-1.5">
                  <p className="text-xs font-bold text-primary">{((flow.opened / flow.sent) * 100).toFixed(0)}%</p>
                  <p className="text-[8px] text-muted-foreground">Abertura</p>
                </div>
                <div className="text-center rounded-md bg-muted/30 p-1.5">
                  <p className="text-xs font-bold text-warning">{((flow.clicked / flow.sent) * 100).toFixed(0)}%</p>
                  <p className="text-[8px] text-muted-foreground">Clicks</p>
                </div>
                <div className="text-center rounded-md bg-muted/30 p-1.5">
                  <p className="text-xs font-bold text-success">{flow.converted}</p>
                  <p className="text-[8px] text-muted-foreground">Convertidos</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Inbound Marketing Strategy */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Estratégia de Inbound Marketing
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {inboundStages.map((stage, i) => (
            <motion.div key={stage.stage} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="rounded-lg border border-border p-4"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <stage.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs font-semibold text-foreground mb-0.5">{stage.stage}</p>
              <p className="text-[10px] text-muted-foreground mb-2">{stage.desc}</p>
              <ul className="space-y-1 mb-2">
                {stage.tactics.map((t) => (
                  <li key={t} className="text-[10px] text-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5 text-success shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <Badge variant="outline" className="text-[9px] text-primary">{stage.metrics}</Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Growth Experiments */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Growth Marketing — Experimentos
        </h3>
        <div className="space-y-2">
          {growthExperiments.map((exp, i) => (
            <motion.div key={exp.name} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
            >
              <div className={cn("h-2 w-2 rounded-full shrink-0",
                exp.status === "running" ? "bg-warning" : exp.status === "completed" ? "bg-success" : "bg-muted-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{exp.name}</p>
                <p className="text-[10px] text-muted-foreground">{exp.metric}</p>
              </div>
              <Badge variant="outline" className={cn("text-[9px]",
                exp.impact === "high" ? "text-success" : "text-warning"
              )}>
                Impacto {exp.impact === "high" ? "Alto" : "Médio"}
              </Badge>
              <Badge variant="outline" className={cn("text-[9px]",
                exp.status === "running" ? "text-warning" : exp.status === "completed" ? "text-success" : "text-muted-foreground"
              )}>
                {exp.status === "running" ? "Em andamento" : exp.status === "completed" ? "Concluído" : "Planejado"}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Branding */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" /> Branding — Identidade de Marca
        </h3>
        <div className="space-y-3">
          {brandElements.map((el, i) => (
            <motion.div key={el.element} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="rounded-lg border border-border/50 p-3"
            >
              <Label className="text-[10px] text-primary font-semibold">{el.element}</Label>
              <p className="text-xs text-foreground mt-1">{el.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Label({ className, children, ...props }: any) {
  return <p className={cn("text-xs font-medium", className)} {...props}>{children}</p>;
}
