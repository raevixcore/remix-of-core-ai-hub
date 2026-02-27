import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, DollarSign, Users, Target, ArrowDown,
  BarChart3, Percent, Eye, ShoppingCart, CreditCard, UserCheck,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3 } }),
};

const funnelStages = [
  { name: "Visitantes", value: 12500, color: "bg-primary", icon: Eye, rate: "100%" },
  { name: "Leads", value: 3750, color: "bg-primary/80", icon: Users, rate: "30%" },
  { name: "MQLs", value: 1125, color: "bg-primary/60", icon: Target, rate: "30%" },
  { name: "SQLs", value: 450, color: "bg-primary/40", icon: UserCheck, rate: "40%" },
  { name: "Oportunidades", value: 180, color: "bg-primary/30", icon: ShoppingCart, rate: "40%" },
  { name: "Clientes", value: 54, color: "bg-success", icon: CreditCard, rate: "30%" },
];

const kpis = [
  { label: "CAC", value: "R$ 185", change: "-12%", positive: true, desc: "Custo de Aquisição por Cliente", icon: DollarSign },
  { label: "LTV", value: "R$ 4.200", change: "+8%", positive: true, desc: "Lifetime Value médio", icon: TrendingUp },
  { label: "LTV/CAC", value: "22.7x", change: "+15%", positive: true, desc: "Razão LTV sobre CAC", icon: BarChart3 },
  { label: "Churn Rate", value: "3.2%", change: "-0.5%", positive: true, desc: "Taxa de cancelamento mensal", icon: TrendingDown },
  { label: "MRR", value: "R$ 86.400", change: "+18%", positive: true, desc: "Receita Recorrente Mensal", icon: DollarSign },
  { label: "ARPU", value: "R$ 350", change: "+5%", positive: true, desc: "Receita média por usuário", icon: Users },
];

const conversionRates = [
  { from: "Visitante → Lead", rate: 30, benchmark: 25, status: "above" },
  { from: "Lead → MQL", rate: 30, benchmark: 35, status: "below" },
  { from: "MQL → SQL", rate: 40, benchmark: 30, status: "above" },
  { from: "SQL → Oportunidade", rate: 40, benchmark: 45, status: "below" },
  { from: "Oportunidade → Cliente", rate: 30, benchmark: 25, status: "above" },
  { from: "Total (Visitante → Cliente)", rate: 0.43, benchmark: 0.3, status: "above" },
];

const campaigns = [
  { name: "Black Friday 2026", spend: 12000, revenue: 48000, roi: 300, leads: 420, status: "active" },
  { name: "Webinar IA Marketing", spend: 3500, revenue: 18200, roi: 420, leads: 180, status: "active" },
  { name: "Google Ads - Brand", spend: 8000, revenue: 32000, roi: 300, leads: 290, status: "active" },
  { name: "Meta Ads - Retargeting", spend: 5200, revenue: 15600, roi: 200, leads: 145, status: "paused" },
  { name: "Email - Reengajamento", spend: 800, revenue: 9600, roi: 1100, leads: 95, status: "completed" },
];

export function FunnelKPIs() {
  const [roiCalc, setRoiCalc] = useState({ invest: "10000", revenue: "35000" });
  const roi = roiCalc.invest && roiCalc.revenue
    ? (((Number(roiCalc.revenue) - Number(roiCalc.invest)) / Number(roiCalc.invest)) * 100).toFixed(0)
    : "0";

  return (
    <div className="space-y-6">
      {/* Funnel */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> Funil de Vendas
        </h3>
        <div className="flex flex-col items-center gap-1">
          {funnelStages.map((stage, i) => {
            const widthPercent = 100 - i * 14;
            return (
              <motion.div key={stage.name} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                className="w-full flex items-center gap-3"
              >
                <div className="w-24 text-right">
                  <p className="text-[10px] text-muted-foreground">{stage.name}</p>
                </div>
                <div className="flex-1 flex items-center">
                  <div
                    className={cn("h-10 rounded-lg flex items-center justify-between px-3 transition-all", stage.color)}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-xs font-bold text-primary-foreground">{stage.value.toLocaleString()}</span>
                    <span className="text-[10px] text-primary-foreground/80">{stage.rate}</span>
                  </div>
                </div>
                {i < funnelStages.length - 1 && (
                  <ArrowDown className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
                {i === funnelStages.length - 1 && <div className="w-3" />}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          Taxa de conversão total: <span className="font-bold text-foreground">0.43%</span> (benchmark: 0.3%)
        </p>
      </div>

      {/* KPIs Grid */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" /> KPIs Principais
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="h-4 w-4 text-primary" />
                </div>
                <Badge variant="outline" className={cn("text-[10px]", kpi.positive ? "text-success" : "text-destructive")}>
                  {kpi.positive ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                  {kpi.change}
                </Badge>
              </div>
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground">{kpi.label} — {kpi.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Conversion Rates */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Percent className="h-4 w-4 text-primary" /> Taxas de Conversão
        </h3>
        <div className="space-y-2">
          {conversionRates.map((cr, i) => (
            <motion.div key={cr.from} initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
            >
              <p className="text-xs text-foreground flex-1 min-w-0">{cr.from}</p>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full", cr.status === "above" ? "bg-success" : "bg-warning")}
                    style={{ width: `${Math.min(cr.rate * (cr.rate > 1 ? 1 : 100), 100)}%` }} />
                </div>
                <span className={cn("text-xs font-bold w-12 text-right", cr.status === "above" ? "text-success" : "text-warning")}>
                  {cr.rate}%
                </span>
                <span className="text-[10px] text-muted-foreground w-16 text-right">
                  bench: {cr.benchmark}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" /> Calculadora de ROI
          </h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Investimento (R$)</Label>
              <Input value={roiCalc.invest} onChange={(e) => setRoiCalc({ ...roiCalc, invest: e.target.value })} type="number" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Receita gerada (R$)</Label>
              <Input value={roiCalc.revenue} onChange={(e) => setRoiCalc({ ...roiCalc, revenue: e.target.value })} type="number" />
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-[10px] text-muted-foreground">ROI</p>
              <p className={cn("text-2xl font-bold", Number(roi) > 0 ? "text-success" : "text-destructive")}>{roi}%</p>
            </div>
          </div>
        </div>

        {/* Campaign ROI Table */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">ROI de Campanhas</h3>
          <div className="space-y-2">
            {campaigns.map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-lg border border-border/50 p-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Investido: R$ {c.spend.toLocaleString()} · {c.leads} leads
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-xs font-bold text-success">{c.roi}% ROI</p>
                  <Badge variant="outline" className={cn("text-[8px]",
                    c.status === "active" ? "text-success" : c.status === "paused" ? "text-warning" : "text-muted-foreground"
                  )}>
                    {c.status === "active" ? "Ativa" : c.status === "paused" ? "Pausada" : "Finalizada"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
