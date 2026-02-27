import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BarChart3, TrendingUp, TrendingDown, Target, Users, Clock, DollarSign,
  ArrowUpRight, ArrowDownRight, MessageSquare, Star, Zap, Calendar,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3 } }),
};

// Monthly data
const monthlyData = [
  { month: "Set", messages: 3200, conversations: 820, resolved: 780, revenue: 62000 },
  { month: "Out", messages: 3600, conversations: 920, resolved: 870, revenue: 68000 },
  { month: "Nov", messages: 4100, conversations: 1050, resolved: 995, revenue: 74000 },
  { month: "Dez", messages: 3800, conversations: 980, resolved: 940, revenue: 71000 },
  { month: "Jan", messages: 4200, conversations: 1080, resolved: 1030, revenue: 78000 },
  { month: "Fev", messages: 4832, conversations: 1247, resolved: 1189, revenue: 86400 },
];

// Channel data
const channelData = [
  { name: "WhatsApp", value: 42, color: "hsl(var(--chart-1))" },
  { name: "Telegram", value: 35, color: "hsl(var(--chart-2))" },
  { name: "Instagram", value: 23, color: "hsl(var(--chart-3))" },
];

// Hourly distribution
const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}h`,
  messages: i >= 8 && i <= 20 ? Math.floor(Math.random() * 200 + 80) : Math.floor(Math.random() * 30 + 5),
}));

// Agent performance
const agentPerformance = [
  { name: "Carlos", messages: 1280, avgResponse: "1.8min", csat: 4.8, resolved: 312, firstContact: 92 },
  { name: "Ana", messages: 1160, avgResponse: "2.1min", csat: 4.7, resolved: 285, firstContact: 88 },
  { name: "Pedro", messages: 980, avgResponse: "2.5min", csat: 4.5, resolved: 240, firstContact: 85 },
  { name: "Maria", messages: 840, avgResponse: "1.9min", csat: 4.6, resolved: 210, firstContact: 90 },
  { name: "Lucas", messages: 572, avgResponse: "3.2min", csat: 4.3, resolved: 142, firstContact: 78 },
];

// Goals
const goals = [
  { metric: "Tempo Médio de Resposta", current: 2.4, target: 2.0, unit: "min", progress: 83 },
  { metric: "CSAT Score", current: 4.6, target: 4.8, unit: "/5", progress: 96 },
  { metric: "First Contact Resolution", current: 87, target: 95, unit: "%", progress: 92 },
  { metric: "Conversas/Dia", current: 186, target: 200, unit: "", progress: 93 },
  { metric: "NPS", current: 72, target: 80, unit: "", progress: 90 },
  { metric: "Churn Rate", current: 3.2, target: 2.0, unit: "%", progress: 63 },
];

// Weekly comparison
const weeklyComparison = [
  { day: "Seg", current: 245, previous: 210 },
  { day: "Ter", current: 280, previous: 240 },
  { day: "Qua", current: 260, previous: 255 },
  { day: "Qui", current: 290, previous: 220 },
  { day: "Sex", current: 310, previous: 275 },
  { day: "Sáb", current: 120, previous: 100 },
  { day: "Dom", current: 80, previous: 65 },
];

// Projections
const projections = [
  { month: "Mar", actual: null, projected: 5200 },
  { month: "Abr", actual: null, projected: 5600 },
  { month: "Mai", actual: null, projected: 6100 },
  { month: "Jun", actual: null, projected: 6500 },
];

const allProjectionData = [
  ...monthlyData.map((d) => ({ month: d.month, actual: d.messages, projected: null })),
  ...projections,
];

const AnalyticsProPage = () => {
  const [period, setPeriod] = useState("6m");

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Analytics Pro
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Métricas avançadas, comparativos, metas e projeções.</p>
        </div>
        <div className="flex gap-1.5">
          {["1m", "3m", "6m", "1a"].map((p) => (
            <Button key={p} size="sm" variant={period === p ? "default" : "outline"} className="text-[10px] h-7 px-2.5"
              onClick={() => setPeriod(p)}>{p}</Button>
          ))}
        </div>
      </motion.div>

      {/* Overview KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: "Mensagens", value: "4.832", change: "+15%", positive: true, icon: MessageSquare },
          { label: "Tempo Resposta", value: "2.4min", change: "-22%", positive: true, icon: Clock },
          { label: "CSAT", value: "4.6/5", change: "+0.2", positive: true, icon: Star },
          { label: "MRR", value: "R$ 86.4K", change: "+18%", positive: true, icon: DollarSign },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <kpi.icon className="h-4 w-4 text-primary" />
              </div>
              <Badge variant="outline" className={cn("text-[10px]", kpi.positive ? "text-success" : "text-destructive")}>
                {kpi.positive ? <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />}
                {kpi.change}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-9 mb-6 bg-muted/50">
          <TabsTrigger value="overview" className="text-xs gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Visão Geral</TabsTrigger>
          <TabsTrigger value="agents" className="text-xs gap-1.5"><Users className="h-3.5 w-3.5" /> Agentes</TabsTrigger>
          <TabsTrigger value="goals" className="text-xs gap-1.5"><Target className="h-3.5 w-3.5" /> Metas</TabsTrigger>
          <TabsTrigger value="projections" className="text-xs gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Projeções</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Messages Over Time */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Mensagens — Últimos 6 Meses</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
                  <Area type="monotone" dataKey="messages" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Channel Distribution */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Distribuição por Canal</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={channelData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" stroke="none">
                      {channelData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {channelData.map((ch) => (
                    <div key={ch.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: ch.color }} />
                      <span className="text-xs text-foreground">{ch.name}</span>
                      <span className="text-xs font-bold text-foreground">{ch.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hourly Distribution */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Volume por Hora</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" interval={2} />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="messages" fill="hsl(var(--primary) / 0.6)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Comparison */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Comparativo Semanal</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="previous" name="Semana Anterior" fill="hsl(var(--muted-foreground) / 0.3)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="current" name="Semana Atual" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Agents */}
        <TabsContent value="agents">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Agente</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Mensagens</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Tempo Médio</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">CSAT</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Resolvidas</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">1° Contato</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((agent, i) => (
                  <motion.tr key={agent.name} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                    className="border-b border-border/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-primary">{agent.name[0]}</span>
                        </div>
                        <span className="font-medium text-foreground">{agent.name}</span>
                        {i === 0 && <Badge variant="outline" className="text-[8px] text-primary">Top</Badge>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-foreground font-bold">{agent.messages.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn("font-bold", parseFloat(agent.avgResponse) <= 2 ? "text-success" : "text-warning")}>{agent.avgResponse}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn("font-bold", agent.csat >= 4.5 ? "text-success" : "text-warning")}>{agent.csat}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">{agent.resolved}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn("font-bold", agent.firstContact >= 90 ? "text-success" : "text-warning")}>{agent.firstContact}%</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Agent Chart */}
          <div className="rounded-xl border border-border bg-card p-5 mt-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Comparativo de Agentes</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={agentPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={50} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="messages" name="Mensagens" fill="hsl(var(--primary))" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Goals */}
        <TabsContent value="goals">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal, i) => (
              <motion.div key={goal.metric} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-foreground">{goal.metric}</p>
                  <Badge variant="outline" className={cn("text-[10px]", goal.progress >= 90 ? "text-success" : goal.progress >= 70 ? "text-warning" : "text-destructive")}>
                    {goal.progress}%
                  </Badge>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{goal.current}{goal.unit}</p>
                    <p className="text-[10px] text-muted-foreground">Atual</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{goal.target}{goal.unit}</p>
                    <p className="text-[10px] text-muted-foreground">Meta</p>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all",
                    goal.progress >= 90 ? "bg-success" : goal.progress >= 70 ? "bg-warning" : "bg-destructive"
                  )} style={{ width: `${Math.min(goal.progress, 100)}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Projections */}
        <TabsContent value="projections">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Projeção de Mensagens — Próximos 4 Meses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={allProjectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="actual" name="Real" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />
                <Line type="monotone" dataKey="projected" name="Projetado" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid gap-3 sm:grid-cols-4 mt-4">
              {projections.map((p, i) => (
                <motion.div key={p.month} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                  className="rounded-lg border border-border/50 p-3 text-center"
                >
                  <p className="text-[10px] text-muted-foreground">{p.month} 2026</p>
                  <p className="text-lg font-bold text-foreground">{p.projected?.toLocaleString()}</p>
                  <p className="text-[9px] text-primary">mensagens previstas</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Revenue Projection */}
          <div className="rounded-xl border border-border bg-card p-5 mt-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Projeção de Receita (MRR)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={[
                ...monthlyData.map((d) => ({ month: d.month, revenue: d.revenue, projected: null })),
                { month: "Mar", revenue: null, projected: 94000 },
                { month: "Abr", revenue: null, projected: 102000 },
                { month: "Mai", revenue: null, projected: 112000 },
                { month: "Jun", revenue: null, projected: 120000 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => `R$ ${v.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="revenue" name="Real" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} connectNulls={false} />
                <Area type="monotone" dataKey="projected" name="Projetado" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2) / 0.1)" strokeWidth={2} strokeDasharray="5 5" connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AnalyticsProPage;
