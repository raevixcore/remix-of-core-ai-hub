import { useState } from "react";
import { Activity, Zap, Bot, PlayCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAIEngine } from "@/context/AIEngineContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusItems = [
  { label: "Model Inference", status: "active", latency: "23ms" },
  { label: "Content Pipeline", status: "active", latency: "45ms" },
  { label: "Approval Engine", status: "idle", latency: "—" },
  { label: "Message Router", status: "active", latency: "12ms" },
  { label: "Scheduler Daemon", status: "active", latency: "31ms" },
];

const simulatorOptions = [
  { key: "nova_mensagem_escalada", label: "Nova mensagem escalada" },
  { key: "content_drafts", label: "Content Specialist gerou 3 drafts" },
  { key: "queda_engajamento", label: "Queda de engajamento detectada" },
  { key: "conflito_agendamento", label: "Conflito de agendamento" },
];

export function CoreAILivePanel() {
  const { specialists, simulateEvent } = useAIEngine();
  const [showSimulator, setShowSimulator] = useState(false);

  return (
    <aside className="hidden w-72 flex-col border-l border-border bg-card/50 p-5 xl:flex overflow-y-auto">
      <div className="mb-5 flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Raevix Core Live Status</h2>
      </div>

      {/* Pulse indicator */}
      <div className="mb-5 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
        </span>
        <span className="text-xs font-medium text-success">All Systems Operational</span>
      </div>

      {/* Services */}
      <div className="space-y-2.5">
        {statusItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.3 }}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-muted-foreground">{item.latency}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${item.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Specialist Status */}
      <div className="mt-6 space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          AI Specialists
        </h3>
        <div className="space-y-2">
          {specialists.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className="rounded-lg border border-border/50 bg-background/50 px-3 py-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">{s.name}</span>
                </div>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  s.status === "active" ? "bg-success" : s.status === "processing" ? "bg-warning animate-pulse-glow" : "bg-muted-foreground"
                )} />
              </div>
              {s.lastAction && (
                <p className="mt-1 text-[11px] text-muted-foreground pl-5">{s.lastAction}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Today's Metrics */}
      <div className="mt-6 space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Today's Metrics
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "AI Tasks", value: "1,284" },
            { label: "Accuracy", value: "99.2%" },
            { label: "Approvals", value: "47" },
            { label: "Uptime", value: "99.9%" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-border/50 bg-background/50 p-2.5 text-center">
              <p className="text-base font-semibold text-foreground">{m.value}</p>
              <p className="text-[11px] text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Event Simulator */}
      <div className="mt-6 space-y-2">
        <Button
          size="sm"
          variant="outline"
          className="w-full h-8 text-xs gap-2"
          onClick={() => setShowSimulator(!showSimulator)}
        >
          <PlayCircle className="h-3.5 w-3.5" />
          Simular evento
          <ChevronDown className={cn("h-3 w-3 transition-transform ml-auto", showSimulator && "rotate-180")} />
        </Button>
        <AnimatePresence>
          {showSimulator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5 overflow-hidden"
            >
              {simulatorOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => simulateEvent(opt.key)}
                  className="w-full text-left rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-[11px] text-foreground hover:bg-accent/50 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
