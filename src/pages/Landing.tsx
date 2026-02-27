import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare, Zap, Users, BarChart3, Shield, Globe,
  Clock, Layers, Bot, ChevronRight, Star, Check, ArrowRight,
  Send, Phone, Instagram, Mail, Twitter, Linkedin,
  Rocket, TrendingUp, Headphones, Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import raevixLogo from "@/assets/raevix-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } }),
};

/* ─── Animated Counter ─── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString("pt-BR"));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    const controls = animate(count, target, { duration: 2, ease: "easeOut" });
    return () => { unsub(); controls.stop(); };
  }, [target, count, rounded]);

  return <span>{display}{suffix}</span>;
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-info/10 blur-[100px]" />
        <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-success/8 blur-[80px]" />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="container max-w-6xl">
        <div className="text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs font-medium border-primary/40 text-primary gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              +2.400 empresas já usam Raevix Core
            </Badge>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]"
          >
            Pare de perder clientes.{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-info to-success bg-clip-text text-transparent">
              Automatize com IA agora.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            Unifique <strong className="text-foreground">WhatsApp, Telegram e Instagram</strong> em um único painel. 
            Responda 3x mais rápido com IA e nunca mais perca uma venda por demora no atendimento.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="h-13 px-10 text-sm font-bold rounded-xl shadow-lg shadow-primary/25 group">
              <Link to="/register">
                Começar Grátis — Sem Cartão
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-13 px-8 text-sm font-semibold rounded-xl gap-2">
              <a href="#demo">
                <Eye className="h-4 w-4" /> Ver em Ação
              </a>
            </Button>
          </motion.div>

          {/* Social proof bar */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="mt-14 flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            {[
              { value: 2400, suffix: "+", label: "Empresas ativas" },
              { value: 98, suffix: "%", label: "Satisfação" },
              { value: 3, suffix: "x", label: "Mais rápido" },
              { value: 60, suffix: "%", label: "Menos custos" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Platform logos */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={5}
            className="mt-10 flex items-center justify-center gap-4 text-muted-foreground/50"
          >
            <Send className="h-4 w-4" />
            <Phone className="h-4 w-4" />
            <Instagram className="h-4 w-4" />
            <span className="text-[10px] text-muted-foreground/40">Telegram · WhatsApp · Instagram</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Social Proof Logos ─── */
function SocialProof() {
  return (
    <section className="py-12 border-y border-border/50">
      <div className="container max-w-5xl text-center">
        <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-6">
          Confiado por empresas que crescem rápido
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {["TechNova", "DigitalFlow", "ShopMax", "GrowthLab", "ScaleUp", "NeoCommerce"].map((name) => (
            <span key={name} className="text-sm font-semibold text-muted-foreground/30 tracking-tight">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Problem/Solution ─── */
function ProblemSolution() {
  return (
    <section id="demo" className="py-20">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problem */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Badge variant="outline" className="mb-4 text-destructive border-destructive/30 text-[10px]">O PROBLEMA</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              Sua equipe perde <span className="text-destructive">73% das vendas</span> por demora no atendimento
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                "Mensagens espalhadas em 5+ apps diferentes",
                "Clientes esperando horas por uma resposta",
                "Zero visibilidade sobre a performance da equipe",
                "Custos crescendo sem resultado proporcional",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
            <Badge variant="outline" className="mb-4 text-success border-success/30 text-[10px]">A SOLUÇÃO</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              Com Raevix Core, sua equipe responde <span className="text-success">3x mais rápido</span>
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                "Todos os canais em um único painel inteligente",
                "IA responde automaticamente enquanto você dorme",
                "Dashboard com métricas em tempo real",
                "ROI positivo já na primeira semana",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─── */
const features = [
  { icon: MessageSquare, title: "Omnichannel Unificado", desc: "WhatsApp, Telegram e Instagram em um painel. Sem alternar entre apps.", color: "text-info" },
  { icon: Bot, title: "IA que Vende por Você", desc: "Respostas automáticas inteligentes. Qualifica leads e fecha vendas 24/7.", color: "text-primary" },
  { icon: BarChart3, title: "Analytics em Tempo Real", desc: "Saiba exatamente quem performa. Métricas de resposta, conversão e satisfação.", color: "text-success" },
  { icon: Users, title: "Gestão de Equipe", desc: "Atribua conversas, defina filas e monitore a produtividade de cada agente.", color: "text-warning" },
  { icon: Shield, title: "Segurança Total", desc: "Multi-tenant com isolamento completo. Seus dados nunca são compartilhados.", color: "text-destructive" },
  { icon: Zap, title: "Automações Poderosas", desc: "Fluxos sem código: tags automáticas, respostas rápidas, escalações inteligentes.", color: "text-info" },
];

function Features() {
  return (
    <section id="funcionalidades" className="py-20 surface-sunken">
      <div className="container max-w-5xl">
        <div className="text-center mb-14">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Badge variant="outline" className="mb-4 text-[10px]">FUNCIONALIDADES</Badge>
          </motion.div>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-2xl md:text-4xl font-bold text-foreground">
            Tudo que você precisa para <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">dominar seu mercado</span>
          </motion.h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 duration-300"
            >
              <div className={cn("mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-card border border-border group-hover:border-primary/30 transition-colors", f.color)}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ─── */
function HowItWorks() {
  const steps = [
    { step: "01", title: "Conecte seus canais", desc: "WhatsApp, Telegram ou Instagram — em menos de 2 minutos.", icon: Globe },
    { step: "02", title: "A IA assume o controle", desc: "Respostas automáticas, qualificação de leads e triagem inteligente.", icon: Bot },
    { step: "03", title: "Sua equipe fecha vendas", desc: "Foque apenas nos leads quentes. A IA faz o resto.", icon: Rocket },
  ];

  return (
    <section className="py-20">
      <div className="container max-w-5xl">
        <div className="text-center mb-14">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Badge variant="outline" className="mb-4 text-[10px]">COMO FUNCIONA</Badge>
          </motion.div>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-2xl md:text-4xl font-bold text-foreground">
            3 passos para <span className="text-primary">triplicar suas vendas</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="relative text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <s.icon className="h-7 w-7" />
              </div>
              <span className="text-[10px] font-bold text-primary/60 tracking-widest">{s.step}</span>
              <h3 className="mt-2 text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8">
                  <ArrowRight className="h-4 w-4 text-border" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Mariana Silva", role: "Head de Suporte, TechNova", text: "Reduzimos o tempo de resposta em 60% e dobramos as conversões. Nosso ROI já pagou o plano Pro no primeiro mês.", rating: 5, metric: "-60% tempo resposta" },
  { name: "Ricardo Almeida", role: "CEO, DigitalFlow", text: "A IA da Raevix qualifica nossos leads automaticamente. Minha equipe só foca nos clientes quentes agora.", rating: 5, metric: "+140% conversão" },
  { name: "Camila Ferreira", role: "Gerente, ShopMax", text: "Saímos de 5 apps para 1. A visibilidade que temos agora sobre a equipe é inacreditável.", rating: 5, metric: "-73% custo operacional" },
];

function Testimonials() {
  return (
    <section className="py-20 surface-sunken">
      <div className="container max-w-5xl">
        <div className="text-center mb-14">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Badge variant="outline" className="mb-4 text-[10px]">DEPOIMENTOS</Badge>
          </motion.div>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-2xl md:text-4xl font-bold text-foreground">
            Resultados reais de <span className="text-primary">empresas reais</span>
          </motion.h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col"
            >
              <Badge variant="outline" className="w-fit mb-4 text-[10px] text-success border-success/30 font-bold">
                {t.metric}
              </Badge>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed flex-1">"{t.text}"</p>
              <div className="mt-5 pt-4 border-t border-border flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
const plans = [
  {
    name: "Free", price: "R$ 0", period: "/mês", desc: "Para testar e se apaixonar.",
    features: ["1 canal integrado", "100 mensagens/mês", "1 usuário", "Dashboard básico"],
    cta: "Começar Grátis", highlighted: false,
  },
  {
    name: "Pro", price: "R$ 149", period: "/mês", desc: "Para equipes que querem crescer rápido.",
    features: ["3 canais integrados", "Mensagens ilimitadas", "5 usuários", "IA integrada completa", "Analytics avançado", "Suporte prioritário"],
    cta: "Começar Teste Grátis", highlighted: true, badge: "Mais popular",
  },
  {
    name: "Enterprise", price: "Sob consulta", period: "", desc: "Para operações que não podem parar.",
    features: ["Canais ilimitados", "Mensagens ilimitadas", "Usuários ilimitados", "IA personalizada", "API completa", "SLA dedicado", "Onboarding VIP"],
    cta: "Falar com Especialista", highlighted: false,
  },
];

function Pricing() {
  return (
    <section id="precos" className="py-20">
      <div className="container max-w-5xl">
        <div className="text-center mb-14">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Badge variant="outline" className="mb-4 text-[10px]">PREÇOS</Badge>
          </motion.div>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-2xl md:text-4xl font-bold text-foreground">
            Invista menos do que um estagiário.{" "}
            <br className="hidden sm:block" />
            <span className="text-primary">Ganhe mais que um time inteiro.</span>
          </motion.h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className={cn(
                "rounded-2xl border bg-card p-7 flex flex-col relative transition-all duration-300",
                p.highlighted
                  ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20 scale-[1.02]"
                  : "border-border hover:border-primary/20"
              )}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="text-[10px] bg-primary text-primary-foreground shadow-lg px-4">Mais popular</Badge>
                </div>
              )}
              <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{p.price}</span>
                <span className="text-xs text-muted-foreground">{p.period}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{p.desc}</p>

              <ul className="mt-7 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs text-foreground">
                    <Check className="h-3.5 w-3.5 text-success shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <Button asChild variant={p.highlighted ? "default" : "outline"} className={cn("mt-7 w-full h-11 rounded-xl font-semibold", p.highlighted && "shadow-lg shadow-primary/20")}>
                <Link to="/register">{p.cta} <ChevronRight className="ml-1 h-3.5 w-3.5" /></Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
          className="text-center mt-8 text-xs text-muted-foreground">
          ✓ Cancele quando quiser · ✓ Sem fidelidade · ✓ Sem surpresas na fatura
        </motion.p>
      </div>
    </section>
  );
}

/* ─── CTA Final ─── */
function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="container max-w-3xl text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Seus concorrentes já estão<br />
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">usando IA. E você?</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-lg mx-auto">
            Cada minuto sem Raevix Core é um cliente perdido para quem responde mais rápido.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-13 px-10 text-sm font-bold rounded-xl shadow-lg shadow-primary/25 group">
              <Link to="/register">
                Criar Conta Grátis Agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground/60">Grátis para sempre no plano Free. Sem cartão de crédito.</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqs = [
  { q: "Preciso instalar algo?", a: "Não. Raevix Core é 100% web. Crie sua conta e comece a usar em 2 minutos." },
  { q: "Quais canais são suportados?", a: "Telegram, WhatsApp (Cloud API) e Instagram (Graph API). Novos canais em breve." },
  { q: "A IA realmente responde sozinha?", a: "Sim. Ela qualifica leads, responde dúvidas frequentes e escala apenas o que precisa de um humano." },
  { q: "Meus dados estão seguros?", a: "100%. Cada empresa opera em isolamento total (multi-tenant). Criptografia de ponta a ponta." },
  { q: "Posso cancelar a qualquer momento?", a: "Sim. Sem fidelidade, sem multa, sem pegadinhas. Cancele quando quiser." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 surface-sunken">
      <div className="container max-w-3xl">
        <div className="text-center mb-14">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Badge variant="outline" className="mb-4 text-[10px]">FAQ</Badge>
          </motion.div>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-2xl md:text-3xl font-bold text-foreground">
            Perguntas Frequentes
          </motion.h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 text-left transition-colors hover:border-primary/30"
              >
                <span className="text-sm font-medium text-foreground">{f.q}</span>
                <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open === i && "rotate-90")} />
              </button>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden px-5 pb-3 pt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={raevixLogo} alt="Raevix Core" className="h-8 w-8 rounded-lg" />
              <span className="text-sm font-bold text-foreground">Raevix Core</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Plataforma omnichannel inteligente para empresas que querem crescer com IA.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#funcionalidades" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a></li>
              <li><a href="#precos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Preços</a></li>
              <li><Link to="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3">Social</h4>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Mail className="h-4 w-4" /></a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-[10px] text-muted-foreground">© {new Date().getFullYear()} Raevix Core. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "glass shadow-lg shadow-background/50" : "bg-transparent")}>
      <div className="container max-w-6xl flex items-center justify-between h-16">
        <Link to="/landing" className="flex items-center gap-2.5">
          <img src={raevixLogo} alt="Raevix Core" className="h-8 w-8 rounded-lg" />
          <span className="text-sm font-bold text-foreground tracking-tight">Raevix Core</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#funcionalidades" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a>
          <a href="#demo" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
          <a href="#precos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Preços</a>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="text-xs rounded-lg hidden sm:inline-flex shadow-lg shadow-primary/20">
            <Link to="/register">Criar Conta Grátis</Link>
          </Button>
          <button className="md:hidden p-1.5" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl px-6 py-4 space-y-3"
        >
          <a href="#funcionalidades" onClick={() => setMobileOpen(false)} className="block text-sm text-foreground py-2">Funcionalidades</a>
          <a href="#demo" onClick={() => setMobileOpen(false)} className="block text-sm text-foreground py-2">Como Funciona</a>
          <a href="#precos" onClick={() => setMobileOpen(false)} className="block text-sm text-foreground py-2">Preços</a>
          <div className="flex gap-3 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm" className="flex-1 text-xs">
              <Link to="/register">Criar Conta</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

/* ─── Page ─── */
export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SocialProof />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <FAQ />
      <Footer />
    </div>
  );
}
