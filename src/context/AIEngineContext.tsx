import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface AttentionItem {
  id: string;
  type: "conversation" | "schedule_conflict" | "engagement_drop";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  route: string;
}

export interface AIEvent {
  id: string;
  type: "alert" | "conversation" | "content" | "performance";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timestamp: Date;
  dismissed: boolean;
}

export interface AIStatusMessage {
  id: string;
  text: string;
  timestamp: Date;
}

export interface SpecialistStatus {
  name: string;
  status: "active" | "idle" | "processing";
  lastAction?: string;
}

export interface SimulatedChat {
  id: string;
  name: string;
  avatar: string;
  platform: "WhatsApp" | "Telegram";
  lastMessage: string;
  timestamp: string;
  unread: number;
  escalated: boolean;
  messages: { id: string; text: string; sender: "user" | "ai" | "human"; time: string }[];
}

export interface SimulatedApproval {
  id: string;
  caption: string;
  platform: "Instagram" | "X" | "Telegram Broadcast";
  scheduledDate: string;
  scheduledTime: string;
  confidence: "low" | "medium" | "high";
  aiNote: string;
  variations: number;
}

interface AIEngineState {
  events: AIEvent[];
  statusMessages: AIStatusMessage[];
  specialists: SpecialistStatus[];
  attentionItems: AttentionItem[];
  conversationChats: SimulatedChat[];
  approvalCards: SimulatedApproval[];
  addEvent: (event: Omit<AIEvent, "id" | "timestamp" | "dismissed">) => void;
  dismissEvent: (id: string) => void;
  currentStatusIndex: number;
  simulateEvent: (eventType: string) => void;
}

const AIEngineContext = createContext<AIEngineState | null>(null);

const mockStatusMessages: AIStatusMessage[] = [
  { id: "s1", text: "Raevix Core analyzing performance", timestamp: new Date() },
  { id: "s2", text: "Messaging Specialist escalated 2 conversations", timestamp: new Date() },
  { id: "s3", text: "Content Specialist generated new posts", timestamp: new Date() },
  { id: "s4", text: "Approval Engine reviewing 3 pending items", timestamp: new Date() },
  { id: "s5", text: "Performance anomaly detected — investigating", timestamp: new Date() },
];

const mockEvents: AIEvent[] = [
  { id: "e1", type: "alert", title: "Engagement drop detected", description: "Instagram engagement dropped 12% in the last hour", priority: "high", timestamp: new Date(), dismissed: false },
  { id: "e2", type: "conversation", title: "2 conversations need attention", description: "Messaging Specialist flagged unresolved customer queries", priority: "high", timestamp: new Date(), dismissed: false },
  { id: "e3", type: "content", title: "3 posts generated", description: "Content Specialist created drafts awaiting your approval", priority: "medium", timestamp: new Date(), dismissed: false },
  { id: "e4", type: "performance", title: "Response time warning", description: "Average reply time exceeded 15-minute SLA threshold", priority: "medium", timestamp: new Date(), dismissed: false },
  { id: "e5", type: "alert", title: "Scheduled post conflict", description: "Two posts overlap at 3:00 PM today on Instagram", priority: "low", timestamp: new Date(), dismissed: false },
];

const mockSpecialists: SpecialistStatus[] = [
  { name: "Content Specialist", status: "active", lastAction: "Generated 3 post drafts" },
  { name: "Messaging Specialist", status: "active", lastAction: "Escalated 2 conversations" },
  { name: "Analytics Specialist", status: "processing", lastAction: "Running engagement report" },
  { name: "Scheduling Specialist", status: "idle", lastAction: "All posts scheduled" },
];

const initialAttentionItems: AttentionItem[] = [
  { id: "att1", type: "conversation", title: "Mariana Silva — WhatsApp", description: "Solicitação de orçamento aguardando especialista", priority: "high", route: "/conversations" },
  { id: "att2", type: "conversation", title: "Carlos Mendes — Telegram", description: "Demo agendamento escalado", priority: "high", route: "/conversations" },
  { id: "att3", type: "schedule_conflict", title: "Conflito às 15:00 — Instagram", description: "Dois posts agendados no mesmo horário", priority: "medium", route: "/approvals" },
];

let simCounter = 0;

export function AIEngineProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AIEvent[]>(mockEvents);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>(initialAttentionItems);
  const [conversationChats, setConversationChats] = useState<SimulatedChat[]>([]);
  const [approvalCards, setApprovalCards] = useState<SimulatedApproval[]>([]);

  // Rotate status messages
  useState(() => {
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => (prev + 1) % mockStatusMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  });

  const addEvent = useCallback((event: Omit<AIEvent, "id" | "timestamp" | "dismissed">) => {
    setEvents((prev) => [
      { ...event, id: `e-${Date.now()}`, timestamp: new Date(), dismissed: false },
      ...prev,
    ]);
  }, []);

  const dismissEvent = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, dismissed: true } : e)));
  }, []);

  const simulateEvent = useCallback((eventType: string) => {
    simCounter++;
    const sid = `sim-${simCounter}`;

    switch (eventType) {
      case "nova_mensagem_escalada": {
        const chat: SimulatedChat = {
          id: sid, name: `Cliente Simulado ${simCounter}`, avatar: `C${simCounter}`,
          platform: "WhatsApp", lastMessage: "Preciso falar com um especialista urgente",
          timestamp: "agora", unread: 1, escalated: true,
          messages: [
            { id: "m1", text: "Preciso falar com um especialista urgente", sender: "user", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
            { id: "m2", text: "Olá 👋 — vou encaminhar sua conversa para um especialista agora. Enquanto isso, posso adiantar informações importantes. Um profissional assumirá em instantes.", sender: "ai", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
          ],
        };
        setConversationChats((prev) => [chat, ...prev]);
        setAttentionItems((prev) => [
          { id: sid, type: "conversation", title: `${chat.name} — WhatsApp`, description: "Nova conversa escalada pela IA", priority: "high", route: "/conversations" },
          ...prev,
        ]);
        addEvent({ type: "conversation", title: "Nova conversa escalada", description: `${chat.name} precisa de atenção imediata`, priority: "high" });
        break;
      }
      case "content_drafts": {
        const approval: SimulatedApproval = {
          id: sid, caption: `[Simulado] Novo post gerado pela IA — conteúdo #${simCounter} pronto para revisão`,
          platform: "Instagram", scheduledDate: "Hoje", scheduledTime: "18:00",
          confidence: "medium", aiNote: `Gerado por Content Specialist — 3 variações`, variations: 3,
        };
        setApprovalCards((prev) => [approval, ...prev]);
        setAttentionItems((prev) => [
          { id: sid, type: "schedule_conflict", title: "Content Specialist gerou drafts", description: "3 novos rascunhos aguardando aprovação", priority: "medium", route: "/approvals" },
          ...prev,
        ]);
        addEvent({ type: "content", title: "3 drafts gerados", description: "Content Specialist criou novos rascunhos para aprovação", priority: "medium" });
        break;
      }
      case "queda_engajamento": {
        setAttentionItems((prev) => [
          { id: sid, type: "engagement_drop", title: "Queda de engajamento — Instagram", description: "Engajamento caiu 15% na última hora", priority: "high", route: "/" },
          ...prev,
        ]);
        addEvent({ type: "performance", title: "Queda de engajamento detectada", description: "Instagram engagement caiu 15% — investigação em andamento", priority: "high" });
        break;
      }
      case "conflito_agendamento": {
        setAttentionItems((prev) => [
          { id: sid, type: "schedule_conflict", title: "Conflito de agendamento", description: "Dois posts sobrepostos às 18:00 no Instagram", priority: "medium", route: "/approvals" },
          ...prev,
        ]);
        addEvent({ type: "alert", title: "Conflito de agendamento", description: "Dois posts sobrepostos às 18:00 no Instagram", priority: "medium" });
        break;
      }
    }
  }, [addEvent]);

  return (
    <AIEngineContext.Provider
      value={{
        events,
        statusMessages: mockStatusMessages,
        specialists: mockSpecialists,
        attentionItems,
        conversationChats,
        approvalCards,
        addEvent,
        dismissEvent,
        currentStatusIndex,
        simulateEvent,
      }}
    >
      {children}
    </AIEngineContext.Provider>
  );
}

export function useAIEngine() {
  const ctx = useContext(AIEngineContext);
  if (!ctx) throw new Error("useAIEngine must be used within AIEngineProvider");
  return ctx;
}
