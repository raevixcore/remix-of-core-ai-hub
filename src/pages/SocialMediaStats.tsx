import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Send, Phone, Instagram, TrendingUp, TrendingDown, Users, Heart,
  MessageCircle, Eye, Share2, ArrowUpRight, ArrowDownRight,
  BarChart3, Target, Clock, Zap, UserPlus, MousePointerClick,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadialBarChart, RadialBar,
} from "recharts";

/* ─── Types ─── */
type Channel = "all" | "telegram" | "whatsapp" | "instagram";

/* ─── Mock Data ─── */
const channelConfig = {
  telegram: { label: "Telegram", icon: Send, color: "hsl(var(--primary))", colorVar: "--primary" },
  whatsapp: { label: "WhatsApp", icon: Phone, color: "hsl(var(--success))", colorVar: "--success" },
  instagram: { label: "Instagram", icon: Instagram, color: "hsl(var(--destructive))", colorVar: "--destructive" },
};

const overviewKpis = [
  { label: "Seguidores Total", value: "24.8K", change: "+3.2%", up: true, icon: Users },
  { label: "Engajamento Médio", value: "4.7%", change: "+0.8%", up: true, icon: Heart },
  { label: "Alcance Semanal", value: "89.2K", change: "+15.3%", up: true, icon: Eye },
  { label: "Mensagens Recebidas", value: "1.247", change: "+22.1%", up: true, icon: MessageCircle },
  { label: "Cliques em Links", value: "3.412", change: "-2.4%", up: false, icon: MousePointerClick },
  { label: "Novos Seguidores", value: "847", change: "+18.6%", up: true, icon: UserPlus },
];

const channelKpis: Record<string, { label: string; value: string; change: string; up: boolean }[]> = {
  telegram: [
    { label: "Membros", value: "8.420", change: "+5.1%", up: true },
    { label: "Mensagens/dia", value: "342", change: "+12%", up: true },
    { label: "Taxa de Leitura", value: "78%", change: "+3.2%", up: true },
    { label: "Compartilhamentos", value: "89", change: "-4.1%", up: false },
  ],
  whatsapp: [
    { label: "Contatos", value: "6.230", change: "+2.8%", up: true },
    { label: "Mensagens/dia", value: "521", change: "+8.4%", up: true },
    { label: "Taxa de Resposta", value: "92%", change: "+1.5%", up: true },
    { label: "Tempo Médio", value: "1m 42s", change: "-22%", up: true },
  ],
  instagram: [
    { label: "Seguidores", value: "10.150", change: "+4.3%", up: true },
    { label: "Curtidas/post", value: "284", change: "+15%", up: true },
    { label: "Salvamentos", value: "67", change: "+32%", up: true },
    { label: "Story Views", value: "1.8K", change: "+9.7%", up: true },
  ],
};

const followerGrowth = [
  { date: "01/02", telegram: 7800, whatsapp: 5900, instagram: 9200 },
  { date: "05/02", telegram: 7950, whatsapp: 5980, instagram: 9350 },
  { date: "10/02", telegram: 8050, whatsapp: 6020, instagram: 9500 },
  { date: "15/02", telegram: 8150, whatsapp: 6100, instagram: 9700 },
  { date: "20/02", telegram: 8300, whatsapp: 6180, instagram: 9900 },
  { date: "25/02", telegram: 8420, whatsapp: 6230, instagram: 10150 },
];

const engagementData = [
  { day: "Seg", likes: 320, comments: 85, shares: 42, saves: 28 },
  { day: "Ter", likes: 410, comments: 102, shares: 58, saves: 35 },
  { day: "Qua", likes: 380, comments: 94, shares: 51, saves: 31 },
  { day: "Qui", likes: 520, comments: 130, shares: 72, saves: 48 },
  { day: "Sex", likes: 480, comments: 115, shares: 65, saves: 42 },
  { day: "Sáb", likes: 290, comments: 68, shares: 35, saves: 22 },
  { day: "Dom", likes: 250, comments: 55, shares: 28, saves: 18 },
];

const contentPerformance = [
  { type: "Carrossel", engRate: 6.2, reach: 4500, count: 12 },
  { type: "Reels", engRate: 8.1, reach: 12000, count: 8 },
  { type: "Stories", engRate: 3.4, reach: 1800, count: 45 },
  { type: "Post Único", engRate: 4.0, reach: 3200, count: 18 },
  { type: "Broadcast", engRate: 5.5, reach: 6800, count: 22 },
];

const audienceDemo = [
  { name: "18–24", value: 28, color: "hsl(var(--primary))" },
  { name: "25–34", value: 38, color: "hsl(var(--success))" },
  { name: "35–44", value: 20, color: "hsl(var(--warning))" },
  { name: "45+", value: 14, color: "hsl(var(--info))" },
];

const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}h`,
  telegram: Math.floor(Math.random() * 50 + (i >= 9 && i <= 21 ? 40 : 5)),
  whatsapp: Math.floor(Math.random() * 60 + (i >= 8 && i <= 20 ? 50 : 8)),
  instagram: Math.floor(Math.random() * 40 + (i >= 10 && i <= 22 ? 35 : 3)),
}));

const topPosts = [
  { id: 1, channel: "instagram", title: "Lançamento de produto – Carrossel", reach: "12.4K", engagement: "8.2%", likes: 1240, comments: 186 },
  { id: 2, channel: "telegram", title: "Tutorial completo – Texto", reach: "8.9K", engagement: "6.5%", likes: 890, comments: 124 },
  { id: 3, channel: "whatsapp", title: "Promoção exclusiva – Broadcast", reach: "6.2K", engagement: "12.1%", likes: 0, comments: 340 },
  { id: 4, channel: "instagram", title: "Behind the scenes – Reels", reach: "18.7K", engagement: "9.8%", likes: 2100, comments: 312 },
  { id: 5, channel: "telegram", title: "Enquete interativa", reach: "5.1K", engagement: "14.2%", likes: 420, comments: 680 },
];

const sentimentData = [
  { name: "Positivo", value: 62, color: "hsl(var(--success))" },
  { name: "Neutro", value: 28, color: "hsl(var(--muted-foreground))" },
  { name: "Negativo", value: 10, color: "hsl(var(--destructive))" },
];

const responseTimeData = [
  { range: "< 1min", count: 320 },
  { range: "1-5min", count: 480 },
  { range: "5-15min", count: 210 },
  { range: "15-30min", count: 95 },
  { range: "30min+", count: 42 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35 } }),
};

const SocialMediaStats = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>("all");

  const currentKpis = activeChannel === "all" ? overviewKpis : (channelKpis[activeChannel] || []);
  const chIcon = activeChannel !== "all" ? channelConfig[activeChannel].icon : BarChart3;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Redes Sociais</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Métricas detalhadas de performance por canal social.</p>
      </motion.div>

      {/* Channel Tabs */}
      <Tabs value={activeChannel} onValueChange={(v) => setActiveChannel(v as Channel)} className="mb-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="all" className="text-xs gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Todos</TabsTrigger>
          {Object.entries(channelConfig).map(([key, cfg]) => (
            <TabsTrigger key={key} value={key} className="text-xs gap-1.5">
              <cfg.icon className="h-3.5 w-3.5" /> {cfg.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* KPI Cards */}
      <div className={cn("grid gap-4 mb-6", activeChannel === "all" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" : "sm:grid-cols-2 lg:grid-cols-4")}>
        {currentKpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                {(() => { const I = ("icon" in kpi && (kpi as any).icon) ? (kpi as any).icon : chIcon; return <I className="h-3.5 w-3.5 text-primary" />; })()}
              </div>
              <span className={cn("flex items-center gap-0.5 text-[10px] font-semibold",
                kpi.up ? "text-success" : "text-destructive"
              )}>
                {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Follower Growth + Audience */}
      <div className="grid gap-4 lg:grid-cols-3 mb-4">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Crescimento de Seguidores</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={followerGrowth}>
              <defs>
                {Object.entries(channelConfig).map(([key, cfg]) => (
                  <linearGradient key={key} id={`gSocial${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cfg.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={cfg.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              {(activeChannel === "all" || activeChannel === "telegram") && (
                <Area type="monotone" dataKey="telegram" name="Telegram" stroke={channelConfig.telegram.color} fill="url(#gSocialtelegram)" strokeWidth={2} />
              )}
              {(activeChannel === "all" || activeChannel === "whatsapp") && (
                <Area type="monotone" dataKey="whatsapp" name="WhatsApp" stroke={channelConfig.whatsapp.color} fill="url(#gSocialwhatsapp)" strokeWidth={2} />
              )}
              {(activeChannel === "all" || activeChannel === "instagram") && (
                <Area type="monotone" dataKey="instagram" name="Instagram" stroke={channelConfig.instagram.color} fill="url(#gSocialinstagram)" strokeWidth={2} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Faixa Etária</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={audienceDemo} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {audienceDemo.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {audienceDemo.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-[10px] text-muted-foreground">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Engagement + Sentiment */}
      <div className="grid gap-4 lg:grid-cols-3 mb-4">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Engajamento Semanal</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="likes" name="Curtidas" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="comments" name="Comentários" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="shares" name="Compartilh." fill="hsl(var(--warning))" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="saves" name="Salvos" fill="hsl(var(--info))" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={9}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Sentimento das Menções</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {sentimentData.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {sentimentData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-[10px] text-muted-foreground">{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 3: Content Performance + Response Time */}
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={10}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance por Tipo de Conteúdo</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={contentPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="engRate" name="Engajamento %" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={11}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Tempo de Resposta</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" name="Mensagens" fill="hsl(var(--info))" radius={[3, 3, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Hourly Heatmap */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={12}
        className="rounded-xl border border-border bg-card p-5 mb-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Atividade por Hora do Dia</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={hourlyActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            {(activeChannel === "all" || activeChannel === "telegram") && (
              <Area type="monotone" dataKey="telegram" name="Telegram" stroke={channelConfig.telegram.color} fill="transparent" strokeWidth={2} />
            )}
            {(activeChannel === "all" || activeChannel === "whatsapp") && (
              <Area type="monotone" dataKey="whatsapp" name="WhatsApp" stroke={channelConfig.whatsapp.color} fill="transparent" strokeWidth={2} />
            )}
            {(activeChannel === "all" || activeChannel === "instagram") && (
              <Area type="monotone" dataKey="instagram" name="Instagram" stroke={channelConfig.instagram.color} fill="transparent" strokeWidth={2} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Posts Table */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={13}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Top Publicações</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">#</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Canal</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Publicação</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Alcance</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Engajamento</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Curtidas</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Comentários</th>
              </tr>
            </thead>
            <tbody>
              {topPosts
                .filter((p) => activeChannel === "all" || p.channel === activeChannel)
                .map((post, i) => {
                  const cfg = channelConfig[post.channel as keyof typeof channelConfig];
                  const Icon = cfg.icon;
                  return (
                    <tr key={post.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-muted-foreground">{i + 1}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                          <Icon className="h-3 w-3" /> {cfg.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-foreground max-w-[200px] truncate">{post.title}</td>
                      <td className="py-2.5 px-3 text-right text-foreground">{post.reach}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center gap-0.5 text-success font-semibold">
                          <TrendingUp className="h-3 w-3" /> {post.engagement}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-foreground">{post.likes.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-foreground">{post.comments.toLocaleString()}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SocialMediaStats;
