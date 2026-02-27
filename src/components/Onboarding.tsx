import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check, Sparkles, MessageSquare, BarChart3, Bot, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  action?: { label: string; path: string };
}

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo à CoreAI! 🎉",
    description: "Sua plataforma omnichannel inteligente está pronta. Vamos conhecer as principais funcionalidades.",
    icon: Sparkles,
  },
  {
    id: "conversations",
    title: "Central de Conversas",
    description: "Gerencie Telegram, WhatsApp e Instagram em um único painel. Atribua conversas para sua equipe.",
    icon: MessageSquare,
    action: { label: "Ver Conversas", path: "/conversations" },
  },
  {
    id: "marketing",
    title: "Hub de Marketing",
    description: "Funil de vendas, SWOT, personas, KPIs, SEO, automações e 20+ ferramentas em um só lugar.",
    icon: Megaphone,
    action: { label: "Explorar Marketing", path: "/marketing" },
  },
  {
    id: "analytics",
    title: "Analytics Avançado",
    description: "Acompanhe métricas em tempo real, performance de agentes, metas e projeções futuras.",
    icon: BarChart3,
    action: { label: "Ver Analytics", path: "/analytics-pro" },
  },
  {
    id: "ai",
    title: "Assistente IA",
    description: "IA integrada para respostas automáticas, análise de sentimento e geração de conteúdo.",
    icon: Bot,
    action: { label: "Abrir AI Assistant", path: "/ai-assistant" },
  },
];

const ONBOARDING_KEY = "coreai-onboarding-completed";
const CHECKLIST_KEY = "coreai-checklist";

interface OnboardingContextType {
  showOnboarding: boolean;
  setShowOnboarding: (v: boolean) => void;
  checklist: Record<string, boolean>;
  completeItem: (id: string) => void;
  progress: number;
}

const OnboardingContext = createContext<OnboardingContextType>({
  showOnboarding: false,
  setShowOnboarding: () => {},
  checklist: {},
  completeItem: () => {},
  progress: 0,
});

export const useOnboarding = () => useContext(OnboardingContext);

const checklistItems = [
  { id: "visit_conversations", label: "Visitar Conversas" },
  { id: "visit_marketing", label: "Explorar Marketing" },
  { id: "visit_analytics", label: "Ver Analytics Pro" },
  { id: "visit_ai", label: "Testar AI Assistant" },
  { id: "change_theme", label: "Personalizar tema" },
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setShowOnboarding(true);
    }
    try {
      const saved = localStorage.getItem(CHECKLIST_KEY);
      if (saved) setChecklist(JSON.parse(saved));
    } catch {}
  }, []);

  const completeItem = (id: string) => {
    setChecklist((prev) => {
      const next = { ...prev, [id]: true };
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  const progress = Math.round(
    (checklistItems.filter((i) => checklist[i.id]).length / checklistItems.length) * 100
  );

  return (
    <OnboardingContext.Provider value={{ showOnboarding, setShowOnboarding, checklist, completeItem, progress }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function OnboardingTour() {
  const { showOnboarding, setShowOnboarding } = useOnboarding();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const dismiss = () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  if (!showOnboarding) return null;

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
        >
          <button onClick={dismiss} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>

          {/* Progress */}
          <div className="flex items-center gap-1.5 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5">
            <Icon className="h-7 w-7" />
          </div>

          <h2 className="text-lg font-bold text-foreground">{current.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{current.description}</p>

          {current.action && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs"
              onClick={() => {
                dismiss();
                navigate(current.action!.path);
              }}
            >
              {current.action.label} <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          )}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeft className="mr-1 h-3 w-3" /> Anterior
            </Button>

            {isLast ? (
              <Button size="sm" className="text-xs" onClick={dismiss}>
                Começar <Check className="ml-1 h-3 w-3" />
              </Button>
            ) : (
              <Button size="sm" className="text-xs" onClick={() => setStep(step + 1)}>
                Próximo <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function OnboardingChecklist() {
  const { checklist, progress } = useOnboarding();
  const [collapsed, setCollapsed] = useState(false);

  if (progress === 100) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4 mb-5"
    >
      <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Primeiros Passos</span>
          <span className="text-[10px] text-muted-foreground">{progress}%</span>
        </div>
        <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", !collapsed && "rotate-90")} />
      </button>

      {!collapsed && (
        <div className="mt-3 space-y-2">
          <Progress value={progress} className="h-1.5 mb-3" />
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5">
              <div className={cn(
                "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                checklist[item.id] ? "bg-success border-success" : "border-border"
              )}>
                {checklist[item.id] && <Check className="h-2.5 w-2.5 text-success-foreground" />}
              </div>
              <span className={cn(
                "text-xs",
                checklist[item.id] ? "text-muted-foreground line-through" : "text-foreground"
              )}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
