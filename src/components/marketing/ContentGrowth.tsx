import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Search, Globe, PenTool, CalendarDays, FlaskConical, Layers,
  TrendingUp, ArrowUpRight, ExternalLink, FileText, CheckCircle2, Clock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3 } }),
};

// SEO Keywords
const seoKeywords = [
  { keyword: "atendimento ao cliente IA", volume: 8100, difficulty: 42, position: 3, trend: "up" },
  { keyword: "chatbot whatsapp empresa", volume: 6600, difficulty: 55, position: 7, trend: "up" },
  { keyword: "plataforma omnichannel", volume: 4400, difficulty: 68, position: 12, trend: "stable" },
  { keyword: "automação de atendimento", volume: 3200, difficulty: 38, position: 2, trend: "up" },
  { keyword: "CRM para pequenas empresas", volume: 5500, difficulty: 72, position: 18, trend: "down" },
  { keyword: "inteligência artificial marketing", volume: 9900, difficulty: 85, position: 25, trend: "up" },
];

// SEM Campaigns
const semCampaigns = [
  { name: "Brand Keywords", budget: 5000, spent: 4200, clicks: 3150, ctr: 8.2, cpc: 1.33, conversions: 95 },
  { name: "Competitor Keywords", budget: 3000, spent: 2800, clicks: 1400, ctr: 3.5, cpc: 2.0, conversions: 28 },
  { name: "Long-tail Features", budget: 2000, spent: 1600, clicks: 2100, ctr: 6.8, cpc: 0.76, conversions: 63 },
  { name: "Retargeting Display", budget: 1500, spent: 1200, clicks: 4500, ctr: 1.2, cpc: 0.27, conversions: 42 },
];

// Editorial Calendar
const editorialItems = [
  { date: "03/03", type: "Blog", title: "10 Tendências de IA para Atendimento em 2026", status: "published", channel: "Blog" },
  { date: "05/03", type: "Social", title: "Carousel: Como reduzir tempo de resposta", status: "scheduled", channel: "Instagram" },
  { date: "08/03", type: "Email", title: "Newsletter: Case de sucesso TechCorp", status: "draft", channel: "Email" },
  { date: "10/03", type: "Video", title: "Tutorial: Configurando automações", status: "production", channel: "YouTube" },
  { date: "12/03", type: "Webinar", title: "Webinar: IA + Atendimento ao cliente", status: "scheduled", channel: "Zoom" },
  { date: "15/03", type: "Blog", title: "Guia completo: Omnichannel para PMEs", status: "draft", channel: "Blog" },
  { date: "17/03", type: "Social", title: "Dia do Consumidor — Campanha especial", status: "scheduled", channel: "Multi" },
  { date: "20/03", type: "Ebook", title: "Ebook: O futuro do atendimento digital", status: "production", channel: "Landing Page" },
];

const statusColors: Record<string, string> = {
  published: "text-success",
  scheduled: "text-primary",
  draft: "text-muted-foreground",
  production: "text-warning",
};

// A/B Tests
const abTests = [
  { name: "CTA Hero — Landing Page", variantA: "Comece Grátis", variantB: "Teste 14 dias free", winnerConversion: "B", convA: 3.2, convB: 4.8, confidence: 95, status: "completed" },
  { name: "Subject Line — Email Welcome", variantA: "Bem-vindo ao CoreAI!", variantB: "Seu atendimento nunca mais será o mesmo", winnerConversion: "B", convA: 22, convB: 31, confidence: 92, status: "completed" },
  { name: "Pricing Page Layout", variantA: "3 colunas com toggle", variantB: "Slider interativo", winnerConversion: "-", convA: 5.1, convB: 5.3, confidence: 62, status: "running" },
];

// Landing Pages
const landingPages = [
  { url: "/lp/trial-gratuito", views: 12400, conversions: 620, rate: 5.0, bounceRate: 32, avgTime: "2:45" },
  { url: "/lp/webinar-ia", views: 8200, conversions: 574, rate: 7.0, bounceRate: 28, avgTime: "3:12" },
  { url: "/lp/ebook-omnichannel", views: 5600, conversions: 448, rate: 8.0, bounceRate: 25, avgTime: "1:58" },
  { url: "/lp/demo-enterprise", views: 3100, conversions: 186, rate: 6.0, bounceRate: 38, avgTime: "4:05" },
];

// Copywriting templates
const copyTemplates = [
  { type: "Headline", example: "Reduza 50% do tempo de resposta com IA", formula: "Benefício quantificado + mecanismo" },
  { type: "CTA", example: "Comece grátis em 2 minutos", formula: "Ação + facilidade + tempo" },
  { type: "Social Proof", example: "Usado por +2.000 empresas em 15 países", formula: "Número + escala + credibilidade" },
  { type: "Urgência", example: "Últimas 12 vagas com 40% de desconto", formula: "Escassez + benefício financeiro" },
];

export function ContentGrowth() {
  const [seoSearch, setSeoSearch] = useState("");

  const filteredKeywords = seoKeywords.filter((k) =>
    seoSearch === "" || k.keyword.toLowerCase().includes(seoSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* SEO */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" /> SEO — Keywords Tracker
        </h3>
        <div className="relative mb-3 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Buscar keyword..." value={seoSearch} onChange={(e) => setSeoSearch(e.target.value)} className="pl-9 h-8 text-xs" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Keyword</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Volume</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Dificuldade</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Posição</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.map((k) => (
                <tr key={k.keyword} className="border-b border-border/50">
                  <td className="py-2 px-3 text-foreground font-medium">{k.keyword}</td>
                  <td className="py-2 px-3 text-right text-foreground">{k.volume.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={cn("font-bold", k.difficulty < 50 ? "text-success" : k.difficulty < 70 ? "text-warning" : "text-destructive")}>
                      {k.difficulty}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-foreground">#{k.position}</td>
                  <td className="py-2 px-3 text-right">
                    {k.trend === "up" ? <TrendingUp className="h-3.5 w-3.5 text-success inline" /> :
                     k.trend === "down" ? <TrendingUp className="h-3.5 w-3.5 text-destructive rotate-180 inline" /> :
                     <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEM */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" /> SEM — Campanhas Pagas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Campanha</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Orçamento</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Gasto</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Clicks</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">CTR</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">CPC</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {semCampaigns.map((c) => (
                <tr key={c.name} className="border-b border-border/50">
                  <td className="py-2 px-3 text-foreground font-medium">{c.name}</td>
                  <td className="py-2 px-3 text-right text-muted-foreground">R$ {c.budget.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-foreground">R$ {c.spent.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-foreground">{c.clicks.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-primary font-bold">{c.ctr}%</td>
                  <td className="py-2 px-3 text-right text-foreground">R$ {c.cpc.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-success font-bold">{c.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editorial Calendar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" /> Calendário Editorial — Março 2026
        </h3>
        <div className="space-y-2">
          {editorialItems.map((item, i) => (
            <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
            >
              <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">{item.date}</span>
              <Badge variant="outline" className="text-[9px] w-14 justify-center">{item.type}</Badge>
              <p className="text-xs text-foreground flex-1 min-w-0 truncate">{item.title}</p>
              <Badge variant="outline" className="text-[9px]">{item.channel}</Badge>
              <span className={cn("text-[10px] font-medium capitalize", statusColors[item.status])}>
                {item.status === "published" ? "✅ Publicado" : item.status === "scheduled" ? "📅 Agendado" : item.status === "draft" ? "📝 Rascunho" : "🔧 Produção"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* A/B Tests */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-primary" /> Testes A/B
        </h3>
        <div className="space-y-3">
          {abTests.map((test, i) => (
            <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-foreground">{test.name}</p>
                <Badge variant="outline" className={cn("text-[10px]", test.status === "running" ? "text-warning" : "text-success")}>
                  {test.status === "running" ? "Em andamento" : "Concluído"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className={cn("rounded-lg border p-3", test.winnerConversion === "A" ? "border-success bg-success/5" : "border-border")}>
                  <p className="text-[10px] text-muted-foreground mb-1">Variante A</p>
                  <p className="text-xs text-foreground font-medium">"{test.variantA}"</p>
                  <p className="text-sm font-bold text-foreground mt-1">{test.convA}%</p>
                </div>
                <div className={cn("rounded-lg border p-3", test.winnerConversion === "B" ? "border-success bg-success/5" : "border-border")}>
                  <p className="text-[10px] text-muted-foreground mb-1">Variante B</p>
                  <p className="text-xs text-foreground font-medium">"{test.variantB}"</p>
                  <p className="text-sm font-bold text-foreground mt-1">{test.convB}%</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                Confiança estatística: <span className={cn("font-bold", test.confidence >= 90 ? "text-success" : "text-warning")}>{test.confidence}%</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Landing Pages */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" /> Landing Pages — Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">URL</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Views</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Conv.</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Taxa</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Bounce</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Tempo Médio</th>
              </tr>
            </thead>
            <tbody>
              {landingPages.map((lp) => (
                <tr key={lp.url} className="border-b border-border/50">
                  <td className="py-2 px-3 text-primary font-medium flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> {lp.url}
                  </td>
                  <td className="py-2 px-3 text-right text-foreground">{lp.views.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-success font-bold">{lp.conversions}</td>
                  <td className="py-2 px-3 text-right text-foreground font-bold">{lp.rate}%</td>
                  <td className="py-2 px-3 text-right text-muted-foreground">{lp.bounceRate}%</td>
                  <td className="py-2 px-3 text-right text-foreground">{lp.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Copywriting Templates */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <PenTool className="h-4 w-4 text-primary" /> Copywriting — Fórmulas & Templates
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {copyTemplates.map((ct, i) => (
            <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="rounded-lg border border-border p-3"
            >
              <Badge variant="outline" className="text-[9px] mb-2">{ct.type}</Badge>
              <p className="text-xs text-foreground font-medium mb-1">"{ct.example}"</p>
              <p className="text-[10px] text-muted-foreground">Fórmula: {ct.formula}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
