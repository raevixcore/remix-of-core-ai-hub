import { useAIEngine } from "@/context/AIEngineContext";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

export function AIStatusBar() {
  const { statusMessages, currentStatusIndex } = useAIEngine();
  const current = statusMessages[currentStatusIndex];

  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Brain className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden relative h-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 absolute inset-0"
          >
            <Sparkles className="h-3 w-3 text-primary animate-pulse-glow shrink-0" />
            <span className="text-xs font-medium text-foreground truncate">{current.text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-1 shrink-0">
        {statusMessages.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-1 rounded-full transition-colors duration-300 ${
              i === currentStatusIndex ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
