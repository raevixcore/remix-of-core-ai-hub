import { useAIEngine, AIEvent } from "@/context/AIEngineContext";
import { DashboardCard } from "@/components/DashboardCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  MessageSquareWarning,
  FileCheck,
  TrendingDown,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeConfig = {
  alert: { icon: AlertTriangle, label: "AI Alerts" },
  conversation: { icon: MessageSquareWarning, label: "Conversations Needing Attention" },
  content: { icon: FileCheck, label: "Content Awaiting Approval" },
  performance: { icon: TrendingDown, label: "Performance Warnings" },
};

const priorityStyle = (p: string) => {
  switch (p) {
    case "high": return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium": return "bg-warning/10 text-warning border-warning/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

function EventCard({ type, events }: { type: AIEvent["type"]; events: AIEvent[] }) {
  const { dismissEvent } = useAIEngine();
  const config = typeConfig[type];
  const Icon = config.icon;
  const activeEvents = events.filter((e) => !e.dismissed);

  if (activeEvents.length === 0) return null;

  return (
    <DashboardCard
      title={config.label}
      icon={<Icon className="h-4 w-4" />}
      delay={0}
    >
      <div className="space-y-2">
        <AnimatePresence>
          {activeEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-start justify-between gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${priorityStyle(event.priority)}`}>
                    {event.priority}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{event.description}</p>
              </div>
              <button
                onClick={() => dismissEvent(event.id)}
                className="shrink-0 mt-0.5 rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </DashboardCard>
  );
}

export function AIEventCards() {
  const { events } = useAIEngine();

  const grouped = {
    alert: events.filter((e) => e.type === "alert"),
    conversation: events.filter((e) => e.type === "conversation"),
    content: events.filter((e) => e.type === "content"),
    performance: events.filter((e) => e.type === "performance"),
  };

  const hasActive = Object.values(grouped).some((g) => g.some((e) => !e.dismissed));

  if (!hasActive) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {(Object.keys(grouped) as AIEvent["type"][]).map((type) => (
        <EventCard key={type} type={type} events={grouped[type]} />
      ))}
    </div>
  );
}
