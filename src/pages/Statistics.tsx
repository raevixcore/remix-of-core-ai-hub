import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import {
  MessageSquare, Users, Clock, TrendingUp, ArrowUpRight, ArrowDownRight,
  Send, Phone, Instagram,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── Mock Data ─── */
const kpis = [
  { label: "Total de Mensagens", value: "4.832", change: "+12.5%", up: true, icon: MessageSquare },
  { label: "Conversas Ativas", value: "186", change: "+8.3%", up: true, icon: TrendingUp },
  { label: "Tempo Médio de Resposta", value: "2m 34s", change: "-18.2%", up: true, icon: Clock },
  { label: "Agentes Ativos", value: "12", change: "+2", up: true, icon: Users },
];

const volumeData = [
  { name: "Seg", telegram: 120, whatsapp: 80, instagram: 45 },
  { name: "Ter", telegram: 150, whatsapp: 95, instagram: 60 },
  { name: "Qua", telegram: 180, whatsapp: 110, instagram: 55 },
  { name: "Qui", telegram: 140, whatsapp: 130, instagram: 70 },
  { name: "Sex", telegram: 200, whatsapp: 150, instagram: 85 },
  { name: "Sáb", telegram: 90, whatsapp: 60, instagram: 40 },
  { name: "Dom", telegram: 70, whatsapp: 45, instagram: 30 },
];

const agentPerformance = [
  { name: "Carlos", messages: 320, avgTime: 1.8 },
  { name: "Ana", messages: 290, avgTime: 2.1 },
  { name: "Pedro", messages: 245, avgTime: 2.5 },
  { name: "Maria", messages: 210, avgTime: 1.9 },
  { name: "Lucas", messages: 185, avgTime: 3.2 },
];

const channelDistribution = [
  { name: "Telegram", value: 45, color: "hsl(var(--primary))" },
  { name: "WhatsApp", value: 35, color: "hsl(var(--success))" },
  { name: "Instagram", value: 20, color: "hsl(var(--destructive))" },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}h`,
  messages: Math.floor(Math.random() * 80 + (i >= 8 && i <= 18 ? 60 : 10)),
}));

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const Statistics = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Estatísticas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Visão geral de performance e métricas da operação.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <kpi.icon className="h-4 w-4 text-primary" />
              </div>
              <span className={cn(
                "flex items-center gap-0.5 text-[11px] font-semibold",
                kpi.up ? "text-success" : "text-destructive"
              )}>
                {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3 mb-4">
        {/* Volume por canal */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Volume de Mensagens por Canal</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="gTelegram" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gWhatsapp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gInstagram" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="telegram" name="Telegram" stroke="hsl(var(--primary))" fill="url(#gTelegram)" strokeWidth={2} />
              <Area type="monotone" dataKey="whatsapp" name="WhatsApp" stroke="hsl(var(--success))" fill="url(#gWhatsapp)" strokeWidth={2} />
              <Area type="monotone" dataKey="instagram" name="Instagram" stroke="hsl(var(--destructive))" fill="url(#gInstagram)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribuição por canal */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Distribuição por Canal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={channelDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {channelDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {channelDistribution.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                <span className="text-[10px] text-muted-foreground">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        {/* Performance por agente */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance por Agente</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agentPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="messages" name="Mensagens" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Atividade por hora */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Atividade por Hora</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="messages" name="Mensagens" fill="hsl(var(--info))" radius={[3, 3, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Agent table */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Ranking de Agentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">#</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Agente</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Mensagens</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Tempo Médio</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {agentPerformance.map((agent, i) => (
                <tr key={agent.name} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-muted-foreground">{i + 1}</td>
                  <td className="py-2.5 px-3 font-medium text-foreground">{agent.name}</td>
                  <td className="py-2.5 px-3 text-right text-foreground">{agent.messages}</td>
                  <td className="py-2.5 px-3 text-right text-foreground">{agent.avgTime}min</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      agent.avgTime < 2 ? "bg-success/10 text-success" : agent.avgTime < 3 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                    )}>
                      {agent.avgTime < 2 ? "Excelente" : agent.avgTime < 3 ? "Bom" : "Atenção"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Statistics;
