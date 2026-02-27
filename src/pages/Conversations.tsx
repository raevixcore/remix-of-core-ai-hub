import { useState, useEffect, useRef, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Search, Phone, Send, UserCheck, CheckCircle2, AlertTriangle, Clock,
  Paperclip, Smile, X, Check, CheckCheck, Image, FileText, Mic,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIEngine } from "@/context/AIEngineContext";
import { apiFetch } from "@/lib/api";

type Platform = string;
type ChatFilter = "all" | "unread" | "high_priority" | "my_chats" | string;
type Priority = "high" | "medium" | "low" | "none";
type ReadStatus = "sent" | "delivered" | "read";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  platform: Platform;
  lastMessage: string;
  timestamp: string;
  unread: number;
  escalated: boolean;
  messages: Message[];
  chatId?: string;
  status?: "bot" | "human";
  priority: Priority;
  isTyping?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai" | "human" | "system";
  time: string;
  timestamp?: string;
  readStatus?: ReadStatus;
  attachment?: { type: "image" | "pdf" | "audio"; name: string; url?: string };
}

const formatTime = (timestamp?: string) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

const PRIORITY_CONFIG: Record<Priority, { emoji: string; label: string; color: string }> = {
  high: { emoji: "🔴", label: "Alta", color: "bg-destructive/20 text-destructive border-destructive/30" },
  medium: { emoji: "🟡", label: "Média", color: "bg-warning/20 text-warning border-warning/30" },
  low: { emoji: "🟢", label: "Baixa", color: "bg-success/20 text-success border-success/30" },
  none: { emoji: "", label: "", color: "" },
};

const PLATFORM_ICON: Record<string, { icon: typeof Phone; color: string }> = {
  whatsapp: { icon: Phone, color: "text-success" },
  telegram: { icon: Send, color: "text-info" },
  instagram: { icon: Circle, color: "text-pink-500" },
};

const EMOJI_LIST = ["😀","😂","😍","👍","🙏","🔥","✅","❌","⚡","💬","📎","🎉","👋","💡","🚀","⏳","📌","🛑","❤️","👀","🤖","📞","📧","🗓️"];

interface AttentionRow {
  client: string;
  platform: Platform;
  reason: string;
  priority: "escalado" | "normal";
  waitTime: string;
}

const mockAttention: AttentionRow[] = [
  { client: "Mariana Silva", platform: "whatsapp", reason: "Solicitação de orçamento", priority: "escalado", waitTime: "4 min" },
  { client: "Carlos Mendes", platform: "telegram", reason: "Demo agendamento", priority: "escalado", waitTime: "8 min" },
  { client: "Ana Costa", platform: "whatsapp", reason: "Prazo de entrega", priority: "normal", waitTime: "12 min" },
  { client: "Fernanda Lima", platform: "whatsapp", reason: "Alteração de plano", priority: "normal", waitTime: "45 min" },
];

const quickReplies = [
  "Olá! Posso ajudar com o pedido?",
  "Qual o modelo e a quantidade que você precisa?",
  "Posso reservar uma sessão com o especialista — quer que eu agende?",
];

// API calls now use apiFetch from lib/api.ts

const Conversations = () => {
  const [filter, setFilter] = useState<ChatFilter>("all");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [composerText, setComposerText] = useState("");
  const [apiChats, setApiChats] = useState<Chat[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [newChatIds, setNewChatIds] = useState<Set<string>>(new Set());
  const [assumedChats, setAssumedChats] = useState<Set<string>>(new Set());
  const knownIdsRef = useRef<Set<string>>(new Set());
  const { conversationChats } = useAIEngine();

  // Multi-chat tabs
  const [openTabs, setOpenTabs] = useState<Chat[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  // Per-tab composer text
  const tabComposerRef = useRef<Record<string, string>>({});

  // Unread tracking
  const [readChats, setReadChats] = useState<Set<string>>(new Set());

  // Emoji picker
  const [showEmoji, setShowEmoji] = useState(false);

  // File upload
  const [pendingFile, setPendingFile] = useState<{ file: File; preview?: string; type: "image" | "pdf" | "audio" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchConversations = useCallback(() => {
    apiFetch("/conversations")
      .then((data: any) => {
        if (!data || typeof data !== "object" || Array.isArray(data)) return;

        const mapped: Chat[] = Object.entries(data).map(([conversationId, conv]: [string, any]) => {
          const msgs = conv.messages || [];
          const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
          const chatId = `api-${conversationId}`;
          // Respect local status overrides to prevent polling from resetting optimistic updates
          const override = statusOverridesRef.current[chatId];
          const status: "bot" | "human" = override || (conv.status === "human" ? "human" : "bot");
          return {
            id: chatId,
            name: conv.name || conversationId,
            avatar: (conv.name || conversationId).split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
            platform: (conv.platform || "telegram").toLowerCase(),
            lastMessage: lastMsg?.message || "",
            timestamp: lastMsg?.timestamp ? formatTime(lastMsg.timestamp) : "agora",
            unread: 0,
            escalated: false,
            chatId: conversationId,
            status,
            priority: "none" as Priority,
            messages: msgs.map((m, i) => ({
              id: `api-${conversationId}-m${i}`,
              text: m.message,
              sender: (m.from === "user" ? "user" : m.from === "human" ? "human" : m.from === "system" ? "system" : "ai") as Message["sender"],
              time: formatTime(m.timestamp),
              timestamp: m.timestamp,
              readStatus: undefined as ReadStatus | undefined,
            })),
          };
        });

        mapped.sort((a, b) => {
          const lastA = a.messages[a.messages.length - 1]?.timestamp;
          const lastB = b.messages[b.messages.length - 1]?.timestamp;
          return new Date(lastB || 0).getTime() - new Date(lastA || 0).getTime();
        });

        const freshIds = new Set(mapped.map((c) => c.id));
        const appearing = new Set<string>();
        freshIds.forEach((id) => {
          if (knownIdsRef.current.size > 0 && !knownIdsRef.current.has(id)) appearing.add(id);
        });
        knownIdsRef.current = freshIds;
        if (appearing.size > 0) {
          setNewChatIds(appearing);
          setTimeout(() => setNewChatIds(new Set()), 2000);
        }

        const humanIds = new Set(mapped.filter((c) => c.status === "human").map((c) => c.id));
        setAssumedChats(humanIds);

        // Update open tabs with fresh data
        setOpenTabs((prev) => prev.map((tab) => {
          const updated = mapped.find((c) => c.id === tab.id);
          return updated ? { ...updated, priority: tab.priority } : tab;
        }));

        setSelectedChat((prev) => {
          if (!prev) return prev;
          const updated = mapped.find((c) => c.id === prev.id);
          return updated ? { ...updated, priority: prev.priority } : prev;
        });

        setApiChats(mapped);
      })
      .catch((err) => console.error("Failed to fetch conversations:", err))
      .finally(() => setApiLoading(false));
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Open a chat in tabs
  const openChatTab = (chat: Chat) => {
    // Save current composer text
    if (activeTabId) {
      tabComposerRef.current[activeTabId] = composerText;
    }
    // Mark as read
    setReadChats((prev) => new Set(prev).add(chat.id));

    const existing = openTabs.find((t) => t.id === chat.id);
    if (!existing) {
      setOpenTabs((prev) => [...prev, chat]);
    } else {
      // Update with latest data
      setOpenTabs((prev) => prev.map((t) => t.id === chat.id ? chat : t));
    }
    setActiveTabId(chat.id);
    setSelectedChat(chat);
    setComposerText(tabComposerRef.current[chat.id] || "");
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    delete tabComposerRef.current[tabId];
    setOpenTabs((prev) => prev.filter((t) => t.id !== tabId));
    if (activeTabId === tabId) {
      const remaining = openTabs.filter((t) => t.id !== tabId);
      if (remaining.length > 0) {
        const next = remaining[remaining.length - 1];
        setActiveTabId(next.id);
        setSelectedChat(next);
        setComposerText(tabComposerRef.current[next.id] || "");
      } else {
        setActiveTabId(null);
        setSelectedChat(null);
        setComposerText("");
      }
    }
  };

  const getChatIdentifier = (chat: Chat) => chat.chatId || chat.name.replace(/\s+/g, "_");

  // Track locally overridden statuses to prevent polling from resetting them
  const statusOverridesRef = useRef<Record<string, "bot" | "human">>({});

  const handleAssume = async (chat: Chat) => {
    const identifier = getChatIdentifier(chat);
    // Optimistic update
    statusOverridesRef.current[chat.id] = "human";
    setAssumedChats((prev) => new Set(prev).add(chat.id));
    setApiChats((prev) => prev.map((c) => c.id === chat.id ? { ...c, status: "human" } : c));
    setSelectedChat((prev) => prev?.id === chat.id ? { ...prev, status: "human" } : prev);
    setOpenTabs((prev) => prev.map((t) => t.id === chat.id ? { ...t, status: "human" } : t));
    try {
      const res = await apiFetch(`/conversations/${identifier}/assume`, { method: "POST" }).then(() => ({ ok: true })).catch(() => ({ ok: false }));
      if (!res.ok) {
        delete statusOverridesRef.current[chat.id];
        setAssumedChats((prev) => { const next = new Set(prev); next.delete(chat.id); return next; });
        console.error("Failed to assume conversation");
      }
    } catch (err) {
      delete statusOverridesRef.current[chat.id];
      setAssumedChats((prev) => { const next = new Set(prev); next.delete(chat.id); return next; });
      console.error("Failed to assume conversation:", err);
    }
  };

  const handleClose = async (chat: Chat) => {
    const identifier = getChatIdentifier(chat);
    // Optimistic update
    statusOverridesRef.current[chat.id] = "bot";
    setAssumedChats((prev) => { const next = new Set(prev); next.delete(chat.id); return next; });
    setApiChats((prev) => prev.map((c) => c.id === chat.id ? { ...c, status: "bot" } : c));
    setSelectedChat((prev) => prev?.id === chat.id ? { ...prev, status: "bot" } : prev);
    setOpenTabs((prev) => prev.map((t) => t.id === chat.id ? { ...t, status: "bot" } : t));
    try {
      const res = await apiFetch(`/conversations/${identifier}/bot`, { method: "POST" }).then(() => ({ ok: true })).catch(() => ({ ok: false }));
      if (!res.ok) {
        delete statusOverridesRef.current[chat.id];
        console.error("Failed to close conversation");
      } else {
        // Clear override after backend confirms, let next poll take over
        setTimeout(() => { delete statusOverridesRef.current[chat.id]; }, 6000);
      }
    } catch (err) {
      delete statusOverridesRef.current[chat.id];
      console.error("Failed to close conversation:", err);
    }
  };

  const handleSend = async () => {
    if (!selectedChat || !composerText.trim()) return;
    const identifier = getChatIdentifier(selectedChat);
    const messageText = composerText.trim();
    setComposerText("");
    if (activeTabId) tabComposerRef.current[activeTabId] = "";
    try {
      await apiFetch(`/send/${identifier}`, {
        method: "POST",
        body: JSON.stringify({ message: messageText }),
      });
      fetchConversations();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const setPriority = (chatId: string, priority: Priority) => {
    setApiChats((prev) => prev.map((c) => c.id === chatId ? { ...c, priority } : c));
    setOpenTabs((prev) => prev.map((t) => t.id === chatId ? { ...t, priority } : t));
    if (selectedChat?.id === chatId) {
      setSelectedChat((prev) => prev ? { ...prev, priority } : prev);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    let type: "image" | "pdf" | "audio" = "pdf";
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("audio/")) type = "audio";

    const preview = type === "image" ? URL.createObjectURL(file) : undefined;
    setPendingFile({ file, preview, type });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const allChats: Chat[] = [
    ...apiChats,
    ...conversationChats.map((c) => ({ ...c, priority: "none" as Priority })),
  ];

  const filteredChats = allChats
    .filter((c) => {
      if (filter === "unread") return !readChats.has(c.id) && (c.unread > 0 || c.messages.length > 0);
      if (filter === "high_priority") return c.priority === "high";
      if (filter === "my_chats") return assumedChats.has(c.id);
      return true;
    })
    .filter((c) => searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const allAttention = [
    ...mockAttention,
    ...conversationChats
      .filter((c) => c.escalated)
      .map((c) => ({
        client: c.name,
        platform: c.platform,
        reason: "Conversa escalada pela IA",
        priority: "escalado" as const,
        waitTime: c.timestamp,
      })),
  ];

  const filters: { key: ChatFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "unread", label: "Não lidas" },
    { key: "high_priority", label: "Alta prioridade" },
    { key: "my_chats", label: "Meus chats" },
  ];

  const getPlatformInfo = (platform: string) => {
    const key = platform.toLowerCase();
    return PLATFORM_ICON[key] || { icon: Send, color: "text-muted-foreground" };
  };

  const renderReadReceipt = (msg: Message) => {
    if (msg.sender === "user") return null;
    // Show read receipts on outgoing messages (ai/human)
    const status = msg.readStatus || "sent";
    if (status === "read") return <CheckCheck className="h-3 w-3 text-info inline-block ml-1" />;
    if (status === "delivered") return <CheckCheck className="h-3 w-3 text-muted-foreground inline-block ml-1" />;
    return <Check className="h-3 w-3 text-muted-foreground inline-block ml-1" />;
  };

  // Active chat for rendering (from tabs)
  const activeChat = openTabs.find((t) => t.id === activeTabId) || selectedChat;

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-3rem)] gap-0 -m-6 overflow-hidden" data-component="conversations-page">
        {/* LEFT — Chat List */}
        <div className="w-80 shrink-0 border-r border-border flex flex-col bg-card/30" data-component="conversations-list">
          <div className="p-4 border-b border-border space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Central de Conversas</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar conversa..."
                className="pl-8 h-8 text-xs bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
                    filter === f.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {apiLoading ? (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">Carregando conversas...</div>
            ) : filteredChats.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">Nenhuma conversa encontrada.</div>
            ) : (
              filteredChats.map((chat) => {
                const platformInfo = getPlatformInfo(chat.platform);
                const PlatformIcon = platformInfo.icon;
                const isEnded = chat.status === "bot" && chat.messages.length > 0 && chat.messages[chat.messages.length - 1].sender === "system";
                const hasUnread = !readChats.has(chat.id) && chat.messages.length > 0;

                return (
                  <motion.button
                    key={chat.id}
                    onClick={() => openChatTab(chat)}
                    initial={chat.id.startsWith("sim-") ? { opacity: 0, x: -20 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 border-b border-border/50 text-left transition-colors",
                      activeTabId === chat.id ? "bg-accent/50" : "hover:bg-accent/30",
                      newChatIds.has(chat.id) && "ring-1 ring-primary/50 bg-primary/5",
                    )}
                  >
                    <div className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                      chat.escalated ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary",
                    )}>
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-medium text-foreground truncate">{chat.name}</span>
                          {chat.priority !== "none" && (
                            <span className="text-[9px] shrink-0">{PRIORITY_CONFIG[chat.priority].emoji}</span>
                          )}
                          {chat.status === "bot" && (
                            <Badge className="text-[8px] px-1.5 py-0 bg-info/20 text-info border-info/30 shrink-0">🤖 Bot</Badge>
                          )}
                          {chat.status === "human" && (
                            <Badge className="text-[8px] px-1.5 py-0 bg-success/20 text-success border-success/30 shrink-0">👨 Humano</Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-1">{chat.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{chat.lastMessage}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <PlatformIcon className={cn("h-2.5 w-2.5", platformInfo.color)} />
                        <span className="text-[9px] text-muted-foreground capitalize">{chat.platform}</span>
                        {chat.escalated && (
                          <Badge variant="outline" className="text-[8px] px-1 py-0 bg-destructive/10 text-destructive border-destructive/20 leading-tight">
                            Escalado
                          </Badge>
                        )}
                        {isEnded && (
                          <Badge className="text-[8px] px-1 py-0 bg-destructive/20 text-destructive border-destructive/30 leading-tight">
                            🛑 Encerrado
                          </Badge>
                        )}
                      </div>
                    </div>
                    {hasUnread && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground shrink-0 animate-pulse">
                        •
                      </span>
                    )}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* CENTER — Thread View */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab Bar */}
          {openTabs.length > 0 && (
            <div className="flex items-center gap-0 border-b border-border bg-card/50 overflow-x-auto shrink-0">
              {openTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (activeTabId) tabComposerRef.current[activeTabId] = composerText;
                    setActiveTabId(tab.id);
                    setSelectedChat(tab);
                    setComposerText(tabComposerRef.current[tab.id] || "");
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-r border-border/50 transition-colors shrink-0 max-w-[160px]",
                    activeTabId === tab.id
                      ? "bg-background text-foreground border-b-2 border-b-primary"
                      : "text-muted-foreground hover:bg-accent/30 hover:text-foreground",
                  )}
                >
                  <span className="truncate">{tab.name}</span>
                  {!readChats.has(tab.id) && activeTabId !== tab.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  )}
                  <X
                    className="h-3 w-3 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                    onClick={(e) => closeTab(tab.id, e)}
                  />
                </button>
              ))}
            </div>
          )}

          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Selecione uma conversa
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/30 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold",
                    activeChat.escalated ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary",
                  )}>
                    {activeChat.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{activeChat.name}</span>
                      <Badge variant="outline" className={cn(
                        "text-[9px] px-1.5 py-0 capitalize",
                        getPlatformInfo(activeChat.platform).color.replace("text-", "border-").replace("text-", "") + "/30",
                      )}>
                        {activeChat.platform}
                      </Badge>
                      {activeChat.priority !== "none" && (
                        <Badge variant="outline" className={cn("text-[8px] px-1.5 py-0", PRIORITY_CONFIG[activeChat.priority].color)}>
                          {PRIORITY_CONFIG[activeChat.priority].emoji} {PRIORITY_CONFIG[activeChat.priority].label}
                        </Badge>
                      )}
                    </div>
                    {assumedChats.has(activeChat.id) ? (
                      <span className="text-[10px] text-success flex items-center gap-1 mt-0.5">
                        <UserCheck className="h-2.5 w-2.5" /> Humano ativo
                      </span>
                    ) : activeChat.escalated ? (
                      <span className="text-[10px] text-warning flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="h-2.5 w-2.5" /> Aguardando especialista
                      </span>
                    ) : activeChat.isTyping ? (
                      <span className="text-[10px] text-info flex items-center gap-1 mt-0.5 animate-pulse">
                        Usuário está digitando...
                      </span>
                    ) : null}
                  </div>
                </div>
                {/* Priority selector */}
                <div className="flex items-center gap-1">
                  {(["high", "medium", "low"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(activeChat.id, activeChat.priority === p ? "none" : p)}
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded transition-colors",
                        activeChat.priority === p ? PRIORITY_CONFIG[p].color : "text-muted-foreground hover:bg-accent",
                      )}
                      title={`Prioridade ${PRIORITY_CONFIG[p].label}`}
                    >
                      {PRIORITY_CONFIG[p].emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <AnimatePresence>
                  {activeChat.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex",
                        msg.sender === "user" ? "justify-start" : msg.sender === "system" ? "justify-center" : "justify-end",
                      )}
                    >
                      <div className={cn(
                        "max-w-[70%] rounded-xl px-4 py-2.5 shadow-sm",
                        msg.sender === "user"
                          ? "bg-accent/50 text-foreground"
                          : msg.sender === "system"
                            ? "bg-muted/80 text-muted-foreground text-center border border-border/50 rounded-lg"
                            : msg.sender === "human"
                              ? "bg-secondary text-secondary-foreground border border-secondary/40"
                              : "bg-primary/10 text-foreground border border-primary/20",
                      )}>
                        {msg.sender !== "user" && msg.sender !== "system" && (
                          <p className="text-[10px] font-semibold mb-1 text-muted-foreground">
                            {msg.sender === "human" ? "Humano" : "IA"}
                          </p>
                        )}
                        {msg.sender === "system" && (
                          <p className="text-[10px] font-semibold mb-1 flex items-center justify-center gap-1">⚙️ Sistema</p>
                        )}
                        {msg.attachment && (
                          <div className="mb-2 p-2 rounded-lg bg-background/50 border border-border/50">
                            {msg.attachment.type === "image" && msg.attachment.url && (
                              <img src={msg.attachment.url} alt="" className="max-h-40 rounded" />
                            )}
                            {msg.attachment.type === "pdf" && (
                              <div className="flex items-center gap-2 text-xs"><FileText className="h-4 w-4" /> {msg.attachment.name}</div>
                            )}
                            {msg.attachment.type === "audio" && (
                              <div className="flex items-center gap-2 text-xs"><Mic className="h-4 w-4" /> {msg.attachment.name}</div>
                            )}
                          </div>
                        )}
                        <p className={cn("text-xs leading-relaxed", msg.sender === "system" && "italic text-[11px]")}>{msg.text}</p>
                        <div className="flex items-center gap-0.5 mt-1.5">
                          {msg.time && <span className="text-[10px] text-muted-foreground/60">{msg.time}</span>}
                          {msg.sender !== "user" && msg.sender !== "system" && renderReadReceipt(msg)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* Typing indicator */}
                {activeChat.isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-accent/50 rounded-xl px-4 py-2.5">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Composer */}
              <div className="shrink-0 border-t border-border bg-card/30">
                {!assumedChats.has(activeChat.id) && (
                  <div className="px-5 pt-3 pb-2 flex gap-2 flex-wrap">
                    {quickReplies.map((r) => (
                      <button
                        key={r}
                        onClick={() => setComposerText(r)}
                        className="text-[11px] px-3 py-1.5 rounded-full border border-border bg-accent/30 text-foreground hover:bg-accent transition-colors"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}

                {/* File preview */}
                {pendingFile && (
                  <div className="px-5 pt-2 flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/30 border border-border/50 text-xs">
                      {pendingFile.type === "image" && pendingFile.preview ? (
                        <img src={pendingFile.preview} alt="" className="h-10 w-10 rounded object-cover" />
                      ) : pendingFile.type === "image" ? (
                        <Image className="h-4 w-4" />
                      ) : pendingFile.type === "audio" ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span className="truncate max-w-[150px]">{pendingFile.file.name}</span>
                      <button onClick={() => setPendingFile(null)}>
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Emoji picker */}
                <AnimatePresence>
                  {showEmoji && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="px-5 pt-2"
                    >
                      <div className="grid grid-cols-12 gap-1 p-2 rounded-lg bg-background border border-border shadow-md max-w-sm">
                        {EMOJI_LIST.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => { setComposerText((prev) => prev + emoji); setShowEmoji(false); }}
                            className="text-base hover:bg-accent rounded p-1 transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="px-5 pb-4 pt-1 space-y-3">
                  <div className="flex items-end gap-2">
                    <div className="flex gap-1 shrink-0">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf,audio/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => fileInputRef.current?.click()}
                        title="Anexar arquivo"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn("h-8 w-8", showEmoji ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                        onClick={() => setShowEmoji(!showEmoji)}
                        title="Emoji"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                      }}
                      placeholder={assumedChats.has(activeChat.id) ? "Digite sua mensagem..." : "Assuma a conversa para enviar mensagens..."}
                      className="min-h-[44px] max-h-28 text-xs resize-none bg-background/50 flex-1"
                      rows={2}
                      disabled={!assumedChats.has(activeChat.id)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleSend} disabled={!assumedChats.has(activeChat.id)}>
                      <Send className="h-3 w-3" /> Enviar
                    </Button>
                    {!assumedChats.has(activeChat.id) ? (
                      <Button size="sm" variant="secondary" className="h-8 text-xs gap-1.5" onClick={() => handleAssume(activeChat)}>
                        <UserCheck className="h-3 w-3" /> Assumir conversa
                      </Button>
                    ) : (
                      <>
                        <Badge variant="outline" className="text-[10px] px-2 py-1 bg-success/10 text-success border-success/20">
                          Humano ativo
                        </Badge>
                        <Button size="sm" variant="destructive" className="h-8 text-xs gap-1.5" onClick={() => handleClose(activeChat)}>
                          <CheckCircle2 className="h-3 w-3" /> Encerrar atendimento
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" /> Resolver
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT — Central de Atenção */}
        <div className="w-80 shrink-0 border-l border-border flex flex-col bg-card/30 overflow-y-auto" data-component="attention-panel">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Central de Atenção</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ⚠️ {allAttention.filter((a) => a.priority === "escalado").length} conversas aguardando especialista
            </p>
          </div>
          <div className="flex-1">
            <AnimatePresence>
              {allAttention.map((row, i) => (
                <motion.div
                  key={`${row.client}-${i}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={cn(
                    "px-4 py-3 border-b border-border/50 space-y-1.5",
                    row.priority === "escalado" && "bg-destructive/5",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{row.client}</span>
                    <Badge variant="outline" className={cn(
                      "text-[9px] px-1.5 py-0",
                      row.priority === "escalado"
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : "bg-success/10 text-success border-success/20",
                    )}>
                      {row.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="capitalize">{row.platform}</span>
                    <span>·</span>
                    <span>{row.reason}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {row.waitTime}
                    </span>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => {
                        const chat = allChats.find((c) => c.name === row.client);
                        if (chat) { handleAssume(chat); openChatTab(chat); }
                      }}>
                        Assumir
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2">
                        Sugerir resposta
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
