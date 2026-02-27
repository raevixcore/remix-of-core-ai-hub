import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Instagram,
  Twitter,
  Send,
  Check,
  Pencil,
  X,
  ExternalLink,
  Bot,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIEngine } from "@/context/AIEngineContext";

type ApprovalFilter = "all" | "instagram" | "x" | "telegram";

interface ApprovalCard {
  id: string;
  caption: string;
  platform: "Instagram" | "X" | "Telegram Broadcast";
  scheduledDate: string;
  scheduledTime: string;
  confidence: "low" | "medium" | "high";
  aiNote: string;
  variations: number;
}

const mockApprovals: ApprovalCard[] = [
  {
    id: "a1", caption: "Descubra como nossa solução pode transformar seu workflow. Link na bio. #produtividade #saas",
    platform: "Instagram", scheduledDate: "Hoje", scheduledTime: "15:00",
    confidence: "high", aiNote: "Gerado por Content Specialist — 3 variações", variations: 3,
  },
  {
    id: "a2", caption: "Thread: 5 tendências de IA para 2026 que todo gestor de marketing deveria conhecer 🧵",
    platform: "X", scheduledDate: "Hoje", scheduledTime: "17:30",
    confidence: "medium", aiNote: "Gerado por Content Specialist — 2 variações", variations: 2,
  },
  {
    id: "a3", caption: "📢 Atualização semanal: novas funcionalidades disponíveis. Confira o que mudou!",
    platform: "Telegram Broadcast", scheduledDate: "Amanhã", scheduledTime: "09:00",
    confidence: "high", aiNote: "Gerado por Content Specialist — 1 variação", variations: 1,
  },
  {
    id: "a4", caption: "Bastidores do nosso processo de design — de conceito a produção em 48h ⚡",
    platform: "Instagram", scheduledDate: "Amanhã", scheduledTime: "10:00",
    confidence: "low", aiNote: "Gerado por Content Specialist — 4 variações", variations: 4,
  },
  {
    id: "a5", caption: "Enquete: Qual feature você mais quer ver em 2026? Vote agora 📊",
    platform: "X", scheduledDate: "Amanhã", scheduledTime: "14:00",
    confidence: "medium", aiNote: "Gerado por Content Specialist — 2 variações", variations: 2,
  },
  {
    id: "a6", caption: "Case de sucesso: como a empresa Y aumentou 40% o engajamento usando IA para conteúdo",
    platform: "Instagram", scheduledDate: "22 Fev", scheduledTime: "12:00",
    confidence: "high", aiNote: "Gerado por Content Specialist — 3 variações", variations: 3,
  },
];

const platformIcon = (p: string) => {
  if (p === "Instagram") return <Instagram className="h-3.5 w-3.5" />;
  if (p === "X") return <Twitter className="h-3.5 w-3.5" />;
  return <Send className="h-3.5 w-3.5" />;
};

const confidenceStyle = (c: string) => {
  if (c === "high") return "bg-success/10 text-success border-success/20";
  if (c === "medium") return "bg-warning/10 text-warning border-warning/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
};

const Approvals = () => {
  const [filter, setFilter] = useState<ApprovalFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { approvalCards } = useAIEngine();

  const allApprovals = [...mockApprovals, ...approvalCards];

  const newDraftsCount = approvalCards.length;

  const filters: { key: ApprovalFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "instagram", label: "Instagram" },
    { key: "x", label: "X" },
    { key: "telegram", label: "Telegram" },
  ];

  const filtered = allApprovals.filter((a) => {
    if (filter === "instagram") return a.platform === "Instagram";
    if (filter === "x") return a.platform === "X";
    if (filter === "telegram") return a.platform === "Telegram Broadcast";
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((a) => a.id)));
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">Central de Aprovação</h1>
          {newDraftsCount > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="animate-pulse-glow"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px]">
                <Sparkles className="h-3 w-3 mr-1" />
                {newDraftsCount} novos rascunhos
              </Badge>
            </motion.div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Revise e aprove conteúdo gerado pela IA.
        </p>
      </motion.div>

      {/* Filters + Bulk Actions */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-xs text-muted-foreground">{selected.size} selecionados</span>
            <Button size="sm" className="h-7 text-xs gap-1">
              <Check className="h-3 w-3" /> Aprovar selecionados
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive hover:text-destructive">
              <X className="h-3 w-3" /> Rejeitar selecionados
            </Button>
          </motion.div>
        )}
      </div>

      {/* Select all */}
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          checked={selected.size === filtered.length && filtered.length > 0}
          onCheckedChange={toggleAll}
          className="h-3.5 w-3.5"
        />
        <span className="text-[11px] text-muted-foreground">Selecionar todos</span>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-component="approval-cards-grid">
        <AnimatePresence>
          {filtered.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.03 * i, duration: 0.3 }}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                "rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md relative",
                card.id.startsWith("sim-") && "ring-1 ring-primary/30 animate-pulse-glow"
              )}
              data-component="approval-card"
            >
              {/* Checkbox */}
              <div className="absolute top-4 right-4">
                <Checkbox
                  checked={selected.has(card.id)}
                  onCheckedChange={() => toggleSelect(card.id)}
                  className="h-3.5 w-3.5"
                />
              </div>

              {/* Thumbnail placeholder */}
              <div className="h-28 rounded-lg bg-accent/30 border border-border/50 mb-3 flex items-center justify-center">
                <span className="text-muted-foreground">{platformIcon(card.platform)}</span>
              </div>

              {/* Caption */}
              <p className="text-xs text-foreground leading-relaxed mb-3 line-clamp-3">{card.caption}</p>

              {/* Metadata */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                  {platformIcon(card.platform)}
                  {card.platform}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {card.scheduledDate}, {card.scheduledTime}
                </Badge>
                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", confidenceStyle(card.confidence))}>
                  {card.confidence}
                </Badge>
              </div>

              {/* AI Note */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3">
                <Bot className="h-3 w-3" />
                <span>{card.aiNote}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <Button size="sm" className="h-7 text-[11px] gap-1 flex-1">
                  <Check className="h-3 w-3" /> Aprovar
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 flex-1">
                  <Pencil className="h-3 w-3" /> Editar
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 text-destructive hover:text-destructive flex-1">
                  <X className="h-3 w-3" /> Rejeitar
                </Button>
              </div>

              {/* Hover preview link */}
              {hoveredId === card.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-14 right-4"
                >
                  <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1 text-primary">
                    <ExternalLink className="h-3 w-3" /> Abrir no editor
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Approvals;
