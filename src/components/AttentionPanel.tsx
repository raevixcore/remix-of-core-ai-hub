import { useState } from "react";
import { useAIEngine } from "@/context/AIEngineContext";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MessageSquareWarning, CalendarClock, TrendingDown, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const typeConfig = {
  conversation: { icon: MessageSquareWarning, label: "Conversa escalada" },
  schedule_conflict: { icon: CalendarClock, label: "Conflito de horário" },
  engagement_drop: { icon: TrendingDown, label: "Queda de engajamento" },
};

const priorityOrder = { high: 0, medium: 1, low: 2 };

const priorityStyle = (p: string) => {
  if (p === "high") return "bg-destructive/10 text-destructive border-destructive/20";
  if (p === "medium") return "bg-warning/10 text-warning border-warning/20";
  return "bg-muted text-muted-foreground border-border";
};

const MAX_COLLAPSED = 6;

export function AttentionPanel() {
  const { attentionItems } = useAIEngine();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  if (attentionItems.length === 0) return null;

  const sorted = [...attentionItems].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const visible = expanded ? sorted : sorted.slice(0, MAX_COLLAPSED);
  const hasMore = sorted.length > MAX_COLLAPSED;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-5 rounded-xl border border-border bg-card p-4"
      data-component="attention-panel"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">Central de Atenção</h3>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-warning/10 text-warning border-warning/20">
            {attentionItems.length}
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {visible.map((item, i) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
                className={cn(
                  "flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-3 py-2.5",
                  item.priority === "high" && "border-l-2 border-l-destructive"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0", priorityStyle(item.priority))}>
                    {item.priority}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] px-2 gap-1"
                    onClick={() => navigate(item.route)}
                  >
                    Assumir <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 h-7 text-xs text-muted-foreground gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>Ocultar <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Exibir mais ({sorted.length - MAX_COLLAPSED}) <ChevronDown className="h-3 w-3" /></>
          )}
        </Button>
      )}
    </motion.div>
  );
}
