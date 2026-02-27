import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  ShieldCheck, AlertTriangle, TrendingUp, TrendingDown,
  User, MapPin, Brain, Heart, Target, Plus, Trash2, ArrowRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3 } }),
};

// SWOT
const initialSwot = {
  strengths: ["Atendimento omnichannel integrado", "IA para análise de sentimento", "Equipe especializada"],
  weaknesses: ["Pouca presença no TikTok", "Base de conhecimento limitada", "Integração com ERP pendente"],
  opportunities: ["Mercado de IA conversacional em alta", "Expansão para América Latina", "Parcerias com influenciadores"],
  threats: ["Concorrentes com pricing agressivo", "Regulamentações de privacidade", "Dependência de APIs de terceiros"],
};

// 5W2H
const initial5w2h = {
  what: "Lançar campanha de inbound marketing para geração de leads qualificados",
  why: "Reduzir CAC em 20% e aumentar volume de MQLs em 50%",
  where: "LinkedIn, Blog corporativo, Google Ads e Email Marketing",
  when: "Q2 2026 (Abril–Junho), com revisão quinzenal",
  who: "Time de marketing (Ana, Carlos) + agência parceira",
  how: "Produção de conteúdo educativo, webinars, landing pages otimizadas e fluxos de nutrição",
  howMuch: "R$ 45.000 / trimestre (R$ 15.000/mês)",
};

// Persona
const initialPersona = {
  name: "Marina Tech",
  age: "32 anos",
  role: "Gerente de Marketing Digital",
  company: "Scale digital com 50-200 funcionários",
  income: "R$ 12.000 - 18.000/mês",
  location: "São Paulo, SP — Zona urbana",
  education: "MBA em Marketing Digital",
  goals: ["Automatizar atendimento ao cliente", "Reduzir tempo de resposta", "Centralizar canais de comunicação"],
  pains: ["Ferramentas fragmentadas", "Dificuldade em medir ROI de atendimento", "Equipe pequena para alto volume"],
  channels: ["LinkedIn", "Newsletters", "Podcasts de negócios", "Eventos de tecnologia"],
  psychographic: "Inovadora, orientada a dados, valoriza eficiência. Prefere soluções que se integram facilmente. Busca reconhecimento profissional.",
  behavior: "Pesquisa extensivamente antes de comprar. Compara 3-5 ferramentas. Valoriza trial gratuito e suporte rápido.",
};

// Customer Journey
const journeyStages = [
  { stage: "Consciência", touchpoints: ["Blog SEO", "Redes Sociais", "Indicação"], emotion: "curious", actions: "Pesquisa sobre soluções de atendimento", kpi: "Impressões, Tráfego orgânico" },
  { stage: "Consideração", touchpoints: ["Webinar", "Case Studies", "Comparativos"], emotion: "interested", actions: "Compara ferramentas, lê reviews", kpi: "Leads gerados, Downloads" },
  { stage: "Decisão", touchpoints: ["Trial Gratuito", "Demo", "Proposta"], emotion: "excited", actions: "Testa o produto, negocia preço", kpi: "SQLs, Propostas enviadas" },
  { stage: "Compra", touchpoints: ["Onboarding", "Setup", "Treinamento"], emotion: "hopeful", actions: "Implementa, configura equipe", kpi: "Conversão, Ticket médio" },
  { stage: "Retenção", touchpoints: ["Suporte", "Updates", "Comunidade"], emotion: "satisfied", actions: "Usa diariamente, expande uso", kpi: "NPS, Churn, Upsell" },
  { stage: "Advocacia", touchpoints: ["Programa de indicação", "Reviews", "Cases"], emotion: "loyal", actions: "Indica para colegas, dá depoimento", kpi: "Indicações, Reviews" },
];

const emotionEmoji: Record<string, string> = {
  curious: "🤔", interested: "👀", excited: "😀", hopeful: "🙏", satisfied: "😊", loyal: "❤️",
};

// Demographics
const demographics = {
  age: [
    { range: "18-24", percent: 8 },
    { range: "25-34", percent: 38 },
    { range: "35-44", percent: 32 },
    { range: "45-54", percent: 15 },
    { range: "55+", percent: 7 },
  ],
  gender: [{ label: "Feminino", percent: 52 }, { label: "Masculino", percent: 45 }, { label: "Outro", percent: 3 }],
  regions: [
    { name: "Sudeste", percent: 48 },
    { name: "Sul", percent: 22 },
    { name: "Nordeste", percent: 15 },
    { name: "Centro-Oeste", percent: 10 },
    { name: "Norte", percent: 5 },
  ],
};

export function StrategyTools() {
  const [swot, setSwot] = useState(initialSwot);
  const [w5h2, setW5h2] = useState(initial5w2h);
  const [persona] = useState(initialPersona);

  const addSwotItem = (key: keyof typeof swot) => {
    const item = prompt("Adicionar item:");
    if (item) setSwot({ ...swot, [key]: [...swot[key], item] });
  };

  const removeSwotItem = (key: keyof typeof swot, idx: number) => {
    setSwot({ ...swot, [key]: swot[key].filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      {/* SWOT */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Análise SWOT
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            { key: "strengths" as const, title: "Forças", icon: TrendingUp, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
            { key: "weaknesses" as const, title: "Fraquezas", icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
            { key: "opportunities" as const, title: "Oportunidades", icon: Target, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
            { key: "threats" as const, title: "Ameaças", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
          ]).map((section, si) => (
            <motion.div key={section.key} initial="hidden" animate="visible" variants={fadeUp} custom={si}
              className={cn("rounded-lg border p-4", section.border)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={cn("text-xs font-semibold flex items-center gap-1.5", section.color)}>
                  <section.icon className="h-3.5 w-3.5" /> {section.title}
                </h4>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => addSwotItem(section.key)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <ul className="space-y-1.5">
                {swot[section.key].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 group">
                    <span className={cn("h-1.5 w-1.5 rounded-full mt-1.5 shrink-0", section.bg.replace("/10", ""))} />
                    <span className="text-[11px] text-foreground flex-1">{item}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSwotItem(section.key, i)}>
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5W2H */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" /> 5W2H
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            { key: "what" as const, label: "What (O quê?)", color: "border-primary/30" },
            { key: "why" as const, label: "Why (Por quê?)", color: "border-success/30" },
            { key: "where" as const, label: "Where (Onde?)", color: "border-warning/30" },
            { key: "when" as const, label: "When (Quando?)", color: "border-accent/30" },
            { key: "who" as const, label: "Who (Quem?)", color: "border-primary/30" },
            { key: "how" as const, label: "How (Como?)", color: "border-success/30" },
            { key: "howMuch" as const, label: "How Much (Quanto?)", color: "border-warning/30" },
          ]).map((field, i) => (
            <motion.div key={field.key} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className={cn("rounded-lg border p-3", field.color)}
            >
              <Label className="text-[10px] text-muted-foreground font-semibold">{field.label}</Label>
              <Textarea
                value={w5h2[field.key]}
                onChange={(e) => setW5h2({ ...w5h2, [field.key]: e.target.value })}
                className="mt-1.5 text-xs min-h-[60px] resize-none border-0 p-0 focus-visible:ring-0 bg-transparent"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Persona */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-primary" /> Persona — {persona.name}
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <User className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-bold text-foreground">{persona.name}</p>
              <p className="text-[10px] text-muted-foreground">{persona.age} · {persona.role}</p>
              <p className="text-[10px] text-muted-foreground">{persona.company}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {persona.location}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1"><CreditCard className="h-2.5 w-2.5" /> {persona.income}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Brain className="h-2.5 w-2.5" /> {persona.education}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-[10px] text-success font-semibold">🎯 Objetivos</Label>
              <ul className="mt-1 space-y-1">{persona.goals.map((g) => <li key={g} className="text-[11px] text-foreground flex items-start gap-1.5"><span className="text-success mt-0.5">✓</span>{g}</li>)}</ul>
            </div>
            <div>
              <Label className="text-[10px] text-destructive font-semibold">😣 Dores</Label>
              <ul className="mt-1 space-y-1">{persona.pains.map((p) => <li key={p} className="text-[11px] text-foreground flex items-start gap-1.5"><span className="text-destructive mt-0.5">✗</span>{p}</li>)}</ul>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-[10px] text-primary font-semibold">📱 Canais</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {persona.channels.map((c) => <Badge key={c} variant="outline" className="text-[9px]">{c}</Badge>)}
              </div>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground font-semibold">🧠 Psicográfico</Label>
              <p className="text-[10px] text-foreground mt-1">{persona.psychographic}</p>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground font-semibold">🛒 Comportamento</Label>
              <p className="text-[10px] text-foreground mt-1">{persona.behavior}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Journey */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-primary" /> Customer Journey
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {journeyStages.map((stage, i) => (
            <motion.div key={stage.stage} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="min-w-[160px] rounded-lg border border-border p-3 flex-shrink-0"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[9px]">{i + 1}</Badge>
                <span className="text-lg">{emotionEmoji[stage.emotion]}</span>
              </div>
              <p className="text-xs font-semibold text-foreground mb-2">{stage.stage}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-[9px] text-muted-foreground font-semibold">Touchpoints</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {stage.touchpoints.map((t) => <Badge key={t} variant="outline" className="text-[8px] px-1 py-0">{t}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-semibold">Ação</p>
                  <p className="text-[10px] text-foreground">{stage.actions}</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-semibold">KPI</p>
                  <p className="text-[10px] text-primary">{stage.kpi}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demographics */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Análise Demográfica & Geográfica
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label className="text-[10px] text-muted-foreground font-semibold">Faixa Etária</Label>
            <div className="mt-2 space-y-1.5">
              {demographics.age.map((a) => (
                <div key={a.range} className="flex items-center gap-2">
                  <span className="text-[10px] text-foreground w-10">{a.range}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${a.percent}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-foreground w-8 text-right">{a.percent}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground font-semibold">Gênero</Label>
            <div className="mt-2 space-y-1.5">
              {demographics.gender.map((g) => (
                <div key={g.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-foreground w-16">{g.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary/70" style={{ width: `${g.percent}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-foreground w-8 text-right">{g.percent}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground font-semibold">Região</Label>
            <div className="mt-2 space-y-1.5">
              {demographics.regions.map((r) => (
                <div key={r.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-foreground w-20">{r.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-success/70" style={{ width: `${r.percent}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-foreground w-8 text-right">{r.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export icon for use in persona section
function CreditCard(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  );
}
