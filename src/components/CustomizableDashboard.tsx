import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GripVertical, Plus, X, BarChart3, MessageSquare, Users, TrendingUp, Bot, CalendarClock, ShieldCheck, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  iconName: string;
  size: "sm" | "md";
}

interface WidgetState {
  id: string;
  visible: boolean;
}

const STORAGE_KEY = "coreai-dashboard-widgets";

const iconMap: Record<string, any> = {
  MessageSquare, Users, TrendingUp, Bot, BarChart3, ShieldCheck, CalendarClock, Megaphone,
};

const widgetConfigs: WidgetConfig[] = [
  { id: "kpi-messages", type: "kpi", title: "Mensagens Hoje", iconName: "MessageSquare", size: "sm" },
  { id: "kpi-users", type: "kpi", title: "Usuários Ativos", iconName: "Users", size: "sm" },
  { id: "kpi-conversion", type: "kpi", title: "Taxa de Conversão", iconName: "TrendingUp", size: "sm" },
  { id: "kpi-ai", type: "kpi", title: "IA Ações Hoje", iconName: "Bot", size: "sm" },
  { id: "chart-traffic", type: "chart", title: "Tráfego por Canal", iconName: "BarChart3", size: "md" },
  { id: "chart-performance", type: "chart", title: "Performance Semanal", iconName: "TrendingUp", size: "md" },
  { id: "list-approvals", type: "list", title: "Aprovações Pendentes", iconName: "ShieldCheck", size: "md" },
  { id: "list-schedule", type: "list", title: "Posts Agendados", iconName: "CalendarClock", size: "md" },
  { id: "list-campaigns", type: "list", title: "Campanhas Ativas", iconName: "Megaphone", size: "md" },
];

const defaultOrder: WidgetState[] = widgetConfigs.map((w, i) => ({
  id: w.id,
  visible: i < 7, // first 7 visible by default
}));

function getResolvedWidgets(states: WidgetState[]) {
  return states
    .map((s) => {
      const cfg = widgetConfigs.find((c) => c.id === s.id);
      if (!cfg) return null;
      return { ...cfg, visible: s.visible, icon: iconMap[cfg.iconName] };
    })
    .filter(Boolean) as (WidgetConfig & { visible: boolean; icon: any })[];
}

const mockKPIs: Record<string, { value: string; change: string; positive: boolean }> = {
  "kpi-messages": { value: "1.247", change: "+12%", positive: true },
  "kpi-users": { value: "89", change: "+5%", positive: true },
  "kpi-conversion": { value: "3.2%", change: "-0.4%", positive: false },
  "kpi-ai": { value: "342", change: "+28%", positive: true },
};

const mockTraffic = [
  { channel: "WhatsApp", value: 45, color: "bg-success" },
  { channel: "Telegram", value: 30, color: "bg-info" },
  { channel: "Instagram", value: 25, color: "bg-warning" },
];

const mockPerformance = [
  { day: "Seg", value: 65 },
  { day: "Ter", value: 72 },
  { day: "Qua", value: 80 },
  { day: "Qui", value: 68 },
  { day: "Sex", value: 90 },
  { day: "Sáb", value: 45 },
  { day: "Dom", value: 38 },
];

const mockApprovals = [
  { title: "Story — Lançamento", status: "Urgente" },
  { title: "Thread — Tendências", status: "Normal" },
  { title: "Broadcast — Atualização", status: "Normal" },
];

const mockSchedule = [
  { title: "Reel — Feature", time: "Hoje, 15:00" },
  { title: "Post — Insight", time: "Amanhã, 10:00" },
];

const mockCampaigns = [
  { title: "Black Friday 2026", status: "Ativa" },
  { title: "Natal — Ofertas", status: "Rascunho" },
];

type ResolvedWidget = WidgetConfig & { visible: boolean; icon: any };

function KPIWidget({ widget }: { widget: ResolvedWidget }) {
  const kpi = mockKPIs[widget.id];
  if (!kpi) return null;
  const Icon = widget.icon;
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">{kpi.value}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">{widget.title}</span>
          <Badge variant="outline" className={cn("text-[9px] px-1 py-0", kpi.positive ? "text-success border-success/30" : "text-destructive border-destructive/30")}>
            {kpi.change}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function ChartWidget({ widget }: { widget: ResolvedWidget }) {
  if (widget.id === "chart-traffic") {
    return (
      <div className="space-y-3">
        {mockTraffic.map((t) => (
          <div key={t.channel} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-foreground">{t.channel}</span>
              <span className="text-muted-foreground">{t.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className={cn("h-full rounded-full transition-all", t.color)} style={{ width: `${t.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-1.5 h-24">
      {mockPerformance.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t bg-primary/20 hover:bg-primary/40 transition-colors relative" style={{ height: `${d.value}%` }}>
            <div className="absolute inset-x-0 bottom-0 rounded-t bg-primary" style={{ height: `${Math.min(d.value, 60)}%` }} />
          </div>
          <span className="text-[9px] text-muted-foreground">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function ListWidget({ widget }: { widget: ResolvedWidget }) {
  const items = widget.id === "list-approvals" ? mockApprovals.map(a => ({ title: a.title, sub: a.status }))
    : widget.id === "list-schedule" ? mockSchedule.map(s => ({ title: s.title, sub: s.time }))
    : mockCampaigns.map(c => ({ title: c.title, sub: c.status }));

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-3 py-2">
          <span className="text-xs text-foreground">{item.title}</span>
          <span className="text-[10px] text-muted-foreground">{item.sub}</span>
        </div>
      ))}
    </div>
  );
}

export function CustomizableDashboard() {
  const [widgetStates, setWidgetStates] = useState<WidgetState[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed[0]?.id) return parsed;
      }
    } catch {}
    return defaultOrder;
  });
  const [editing, setEditing] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const widgets = getResolvedWidgets(widgetStates);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgetStates.map(({ id, visible }) => ({ id, visible }))));
  }, [widgetStates]);

  const toggleWidget = (id: string) => {
    setWidgetStates((prev) => prev.map((w) => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const moveWidget = (fromId: string, toId: string) => {
    setWidgetStates((prev) => {
      const arr = [...prev];
      const fromIdx = arr.findIndex((w) => w.id === fromId);
      const toIdx = arr.findIndex((w) => w.id === toId);
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return arr;
    });
  };

  const visible = widgets.filter((w) => w.visible);
  const hidden = widgets.filter((w) => !w.visible);

  return (
    <div>
      {/* Edit toggle */}
      <div className="flex items-center justify-between mb-4">
        <div />
        <Button
          variant={editing ? "default" : "outline"}
          size="sm"
          className="text-xs"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Concluir" : "Personalizar"}
        </Button>
      </div>

      {/* Hidden widgets to add */}
      {editing && hidden.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4 flex flex-wrap gap-2">
          {hidden.map((w) => {
            const Icon = w.icon;
            return (
              <button
                key={w.id}
                onClick={() => toggleWidget(w.id)}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-3 w-3" /> <Icon className="h-3 w-3" /> {w.title}
              </button>
            );
          })}
        </motion.div>
      )}

      {/* Widgets grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((widget, i) => {
          const isSmall = widget.type === "kpi";
          const Icon = widget.icon;
          return (
            <motion.div
              key={widget.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              draggable={editing}
              onDragStart={() => setDragId(widget.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragId && dragId !== widget.id) moveWidget(dragId, widget.id); setDragId(null); }}
              className={cn(
                "rounded-xl border border-border bg-card p-4 transition-all relative",
                isSmall ? "col-span-1" : "col-span-1 sm:col-span-2",
                editing && "ring-1 ring-dashed ring-border cursor-grab",
                dragId === widget.id && "opacity-50"
              )}
            >
              {editing && (
                <>
                  <GripVertical className="absolute top-3 left-2 h-4 w-4 text-muted-foreground" />
                  <button onClick={() => toggleWidget(widget.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              )}

              {!isSmall && (
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{widget.title}</span>
                </div>
              )}

              {widget.type === "kpi" && <KPIWidget widget={widget} />}
              {widget.type === "chart" && <ChartWidget widget={widget} />}
              {widget.type === "list" && <ListWidget widget={widget} />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
