import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Eye, Pencil, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ContentFilter = "all" | "instagram" | "x";

const mockPosts = [
  { id: "p1", title: "Lançamento de produto — Carrossel", platform: "Instagram", status: "published", date: "19 Fev, 15:00" },
  { id: "p2", title: "Thread: Tendências IA 2026", platform: "X", status: "scheduled", date: "20 Fev, 17:30" },
  { id: "p3", title: "Story — Bastidores da equipe", platform: "Instagram", status: "draft", date: "—" },
  { id: "p4", title: "Enquete semanal de engajamento", platform: "X", status: "published", date: "18 Fev, 14:00" },
  { id: "p5", title: "Reels — Feature highlight", platform: "Instagram", status: "scheduled", date: "21 Fev, 10:00" },
  { id: "p6", title: "Post de case de sucesso", platform: "X", status: "draft", date: "—" },
];

const statusStyle = (s: string) => {
  if (s === "published") return "bg-success/10 text-success border-success/20";
  if (s === "scheduled") return "bg-info/10 text-info border-info/20";
  return "bg-muted text-muted-foreground border-border";
};

const statusLabel = (s: string) => {
  if (s === "published") return "Publicado";
  if (s === "scheduled") return "Agendado";
  return "Rascunho";
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "published") return <CheckCircle2 className="h-3 w-3" />;
  if (status === "scheduled") return <Clock className="h-3 w-3" />;
  return <Pencil className="h-3 w-3" />;
};

const Content = () => {
  const [filter, setFilter] = useState<ContentFilter>("all");

  const filters: { key: ContentFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "instagram", label: "Instagram" },
    { key: "x", label: "X" },
  ];

  const filtered = mockPosts.filter((p) => {
    if (filter === "instagram") return p.platform === "Instagram";
    if (filter === "x") return p.platform === "X";
    return true;
  });

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Content</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gerencie e acompanhe seu conteúdo gerado pela IA.</p>
      </motion.div>

      <div className="flex gap-1 mb-5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              filter === f.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-muted-foreground shrink-0">
                {post.platform === "Instagram" ? <Instagram className="h-4 w-4" /> : <Twitter className="h-4 w-4" />}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{post.title}</p>
                <p className="text-[11px] text-muted-foreground">{post.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 gap-1", statusStyle(post.status))}>
                <StatusIcon status={post.status} />
                {statusLabel(post.status)}
              </Badge>
              <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 gap-1">
                <Eye className="h-3 w-3" /> Ver
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Content;
