import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bot, Send, Loader2, Sparkles, BarChart3, MessageSquare, Lightbulb, Trash2, CalendarDays, TrendingUp, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { fixedSeasonalDates } from "@/data/brazilianDates";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
  { icon: BarChart3, text: "Qual o resumo de performance desta semana?" },
  { icon: MessageSquare, text: "Quantas conversas foram atendidas hoje?" },
  { icon: Lightbulb, text: "Sugira melhorias para meu atendimento" },
  { icon: Sparkles, text: "Gere um relatório de métricas do mês" },
  { icon: CalendarDays, text: "Quais as próximas datas sazonais para planejar conteúdo?" },
  { icon: TrendingUp, text: "Qual a melhor estratégia de conteúdo para esta semana?" },
  { icon: Users, text: "Analise o desempenho da minha equipe" },
  { icon: Zap, text: "O que posso automatizar na minha operação?" },
];

function getUpcomingSeasonalDates() {
  const now = new Date();
  const currentMMDD = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const upcoming = fixedSeasonalDates
    .filter((d) => d.date >= currentMMDD)
    .slice(0, 5);
  if (upcoming.length < 5) {
    upcoming.push(...fixedSeasonalDates.slice(0, 5 - upcoming.length));
  }
  return upcoming;
}

const mockResponses: Record<string, string> = {
  default: `Olá! Sou seu assistente de IA da plataforma. Posso ajudar com:

• **Análise de métricas** — volume de mensagens, tempo de resposta, performance
• **Relatórios** — resumos semanais, mensais ou personalizados
• **Insights** — sugestões de melhoria baseadas nos dados
• **Estratégia de conteúdo** — recomendações para posts e engajamento
• **Datas sazonais** — planejamento de campanhas para datas comemorativas
• **Automações** — sugestões para otimizar processos repetitivos
• **Equipe** — análise de performance e distribuição de tarefas

Como posso ajudar?`,
  performance: `## 📊 Resumo de Performance — Semana Atual

| Métrica | Valor | Variação |
|---------|-------|----------|
| Mensagens recebidas | 1.247 | +12% |
| Tempo médio de resposta | 2m 34s | -18% |
| Conversas resolvidas | 892 | +8% |
| Satisfação (CSAT) | 4.6/5 | +0.2 |

### Destaques:
- **Carlos** liderou em volume com 320 mensagens respondidas
- **Telegram** teve o maior crescimento (+23%)
- O horário de pico foi entre **10h e 14h**

### 🎯 Ações Recomendadas:
1. Adicionar um agente extra no turno da manhã (10h-12h)
2. Criar respostas automáticas para as 5 perguntas mais comuns do Telegram
3. Revisar o fluxo de atendimento do Instagram — tempo médio 40% acima da meta

> 💡 *Acesse **Estatísticas** no menu lateral para ver métricas detalhadas em tempo real.*`,
  conversas: `## 💬 Relatório de Conversas — Hoje

**Total:** 186 conversas ativas

**Por canal:**
- Telegram: 84 (45%)
- WhatsApp: 65 (35%)
- Instagram: 37 (20%)

**Status:**
- ✅ Resolvidas: 142
- ⏳ Em andamento: 31
- 🔴 Aguardando: 13

### 🎯 Ações Recomendadas:
1. Priorize as **13 conversas aguardando** no Instagram
2. Ative **respostas automáticas** para FAQ — pode reduzir fila em 25%
3. Configure o **roteamento inteligente** em Automações para distribuir melhor

> 📌 *Acesse **Conversas** no menu para gerenciar diretamente ou **Automações** para configurar regras.*`,
  melhorias: `## 💡 Sugestões de Melhoria para sua Operação

### 🔴 Prioridade Alta
1. **Respostas automáticas para FAQ**
   Configure em **Automações** → "Nova Regra" → tipo "Resposta Automática"
   Impacto estimado: -25% no volume de atendimento

2. **Distribuição inteligente por especialidade**
   Em **Configurações** → "IA" → ative "Roteamento por Especialidade"
   Direciona vendas para comercial, suporte para técnicos

### 🟡 Prioridade Média
3. **Templates de resposta**
   Crie em **Conversas** → ícone de template → "Novo Template"
   Reduz tempo médio em ~40%

4. **Horário de atendimento automático**
   Configure em **Configurações** → "Empresa" → "Horário de Funcionamento"

### 🟢 Longo Prazo
5. **Base de Conhecimento**
   Alimente a **Base de Conhecimento** com artigos de suporte
   A IA usará para respostas automáticas mais precisas

> 🚀 *Comece pela automação de FAQ — é a melhoria com maior impacto imediato.*`,
  relatorio: `## 📈 Relatório Mensal — ${new Date().toLocaleString("pt-BR", { month: "long" })} ${new Date().getFullYear()}

### Volume
- **Total de mensagens:** 4.832
- **Conversas iniciadas:** 1.247
- **Conversas resolvidas:** 1.189 (95.3%)

### Performance da Equipe
| Agente | Mensagens | Tempo Médio | CSAT |
|--------|-----------|-------------|------|
| Carlos | 1.280 | 1.8min | 4.8 |
| Ana | 1.160 | 2.1min | 4.7 |
| Pedro | 980 | 2.5min | 4.5 |
| Maria | 840 | 1.9min | 4.6 |
| Lucas | 572 | 3.2min | 4.3 |

### Tendências
- Volume cresceu **15%** vs mês anterior
- Tempo de resposta caiu **22%**
- WhatsApp superou Instagram em volume pela primeira vez

### 🎯 Metas para o Próximo Mês
1. Reduzir tempo médio para < 2min em todos os canais
2. Atingir CSAT 4.7+ para todos os agentes
3. Automatizar 30% das respostas repetitivas

> 📊 *Acesse **Analytics Pro** para dashboards avançados e exportação de dados.*`,
  sazonal: (() => {
    const dates = getUpcomingSeasonalDates();
    return `## 📅 Próximas Datas Sazonais

Aqui estão as próximas datas importantes para planejar conteúdo:

${dates.map((d) => `### ${d.emoji} ${d.name} — ${d.date.split("-")[1]}/${d.date.split("-")[0]}
- **Tipo:** ${d.type === "feriado" ? "Feriado Nacional" : d.type === "marketing" ? "Data de Marketing" : "Data Comemorativa"}
${d.tip ? `- **Dica:** ${d.tip}` : ""}
`).join("\n")}

### 🎯 Ações Recomendadas:
1. Crie conteúdo com **2 semanas de antecedência**
2. Use o **Calendário** para agendar posts sazonais
3. Prepare **variações** de conteúdo para teste A/B
4. Alinhe promoções com a equipe de **Marketing**

> 📌 *Acesse o **Calendário** no menu — as datas sazonais já aparecem marcadas automaticamente!*`;
  })(),
  equipe: `## 👥 Análise de Desempenho da Equipe

### Ranking por Produtividade
| # | Agente | Conversas | Tempo Médio | CSAT | Tendência |
|---|--------|-----------|-------------|------|-----------|
| 1 | Carlos | 320 | 1.8min | 4.8 | 📈 +15% |
| 2 | Ana | 290 | 2.1min | 4.7 | 📈 +8% |
| 3 | Maria | 210 | 1.9min | 4.6 | ➡️ Estável |
| 4 | Pedro | 195 | 2.5min | 4.5 | 📉 -3% |
| 5 | Lucas | 143 | 3.2min | 4.3 | 📉 -7% |

### Observações:
- **Carlos** está consistentemente acima da média — considere como mentor
- **Lucas** precisa de suporte — tempo médio 68% acima da meta
- **Pedro** teve queda de 3% — verificar se há problemas de escala

### 🎯 Ações Recomendadas:
1. Agende 1:1 com Lucas para entender gargalos
2. Redistribua carga: mova 20% do volume de Lucas para Carlos
3. Crie programa de mentoria: Carlos → Lucas

> 👥 *Gerencie a equipe em **Equipe** no menu lateral.*`,
  automacao: `## ⚡ Oportunidades de Automação

Analisei sua operação e encontrei **5 oportunidades** de automação:

### 🔴 Alto Impacto
1. **Auto-resposta para FAQ** (Economia: ~4h/dia)
   - 35% das mensagens são perguntas repetitivas
   - Configure em: **Automações** → Nova Regra → Tipo "FAQ"

2. **Roteamento inteligente** (Economia: ~2h/dia)
   - Conversas de vendas vão para todos — deveriam ir só para comercial
   - Configure em: **Automações** → Nova Regra → Tipo "Roteamento"

### 🟡 Médio Impacto
3. **Agendamento automático de posts** (Economia: ~1h/dia)
   - Posts podem ser agendados com base no melhor horário de engajamento
   - Configure em: **Calendário** → IA sugere horários

4. **Alertas de SLA** (Prevenção de problemas)
   - Notificar quando tempo de resposta exceder 5min
   - Configure em: **Automações** → Nova Regra → Tipo "Alerta"

### 🟢 Quick Wins
5. **Template de boas-vindas** (Setup: 5min)
   - Mensagem automática para novos contatos
   - Configure em: **Conversas** → Templates

> 🚀 *Acesse **Automações** no menu para começar a configurar!*`,
  estrategia: `## 📱 Estratégia de Conteúdo — Esta Semana

### Análise do Momento
- **Melhor dia para postar:** Terça e Quinta (maior engajamento histórico)
- **Melhor horário:** 10h-12h e 18h-20h
- **Formato em alta:** Reels curtos (< 30s) e carrosséis educativos

### Calendário Sugerido

| Dia | Formato | Tema | Canal |
|-----|---------|------|-------|
| Seg | Story | Bastidores da operação | Instagram |
| Ter | Carrossel | 5 dicas do setor | Instagram + LinkedIn |
| Qua | Thread | Caso de sucesso | X |
| Qui | Reels | Tutorial rápido | Instagram |
| Sex | Enquete | Pergunta de engajamento | X + Telegram |

### 🎯 Dicas:
1. Use **hashtags de nicho** (5-10) em vez de genéricas
2. Responda **todos os comentários** nas primeiras 2h
3. Reposte conteúdo de clientes (UGC) — +40% de engajamento
4. Programe tudo no **Calendário** para não perder prazos

> 📝 *Acesse **Conteúdo** para criar drafts ou **Calendário** para agendar.*`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("performance") || lower.includes("resumo") || lower.includes("semana")) return mockResponses.performance;
  if (lower.includes("conversa") || lower.includes("atendid")) return mockResponses.conversas;
  if (lower.includes("melhoria") || lower.includes("sugir") || lower.includes("otimiz")) return mockResponses.melhorias;
  if (lower.includes("relatório") || lower.includes("métrica") || lower.includes("mês") || lower.includes("mensal")) return mockResponses.relatorio;
  if (lower.includes("sazonal") || lower.includes("data") || lower.includes("comemorat") || lower.includes("feriado") || lower.includes("campanha")) return mockResponses.sazonal;
  if (lower.includes("equipe") || lower.includes("time") || lower.includes("agente") || lower.includes("desempenho")) return mockResponses.equipe;
  if (lower.includes("automa") || lower.includes("otimiz") || lower.includes("automatiz")) return mockResponses.automacao;
  if (lower.includes("estratégia") || lower.includes("conteúdo") || lower.includes("post") || lower.includes("engajamento")) return mockResponses.estrategia;
  return mockResponses.default;
}

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const response = getResponse(text);
    const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: response, timestamp: new Date() };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const initials = user?.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "??";

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4 shrink-0"
        >
          <div>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" /> AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Análises, relatórios, datas sazonais e insights inteligentes.</p>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1.5"
              onClick={() => setMessages([])}>
              <Trash2 className="h-3.5 w-3.5" /> Limpar
            </Button>
          )}
        </motion.div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl border border-border bg-card/50 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-foreground mb-1">Como posso ajudar?</h2>
              <p className="text-xs text-muted-foreground mb-8 max-w-sm">
                Pergunte sobre métricas, datas sazonais, estratégia de conteúdo, equipe ou automações.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 max-w-xl w-full">
                {suggestions.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => send(s.text)}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 text-left text-xs text-foreground hover:border-primary/30 hover:bg-accent/30 transition-all"
                  >
                    <s.icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="leading-snug">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {msg.role === "assistant" && (
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div className={cn(
                      "rounded-xl px-4 py-3 max-w-[80%] text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent/50 text-foreground"
                    )}>
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_table]:w-full [&_th]:text-left [&_th]:py-1 [&_td]:py-1 [&_h2]:text-sm [&_h2]:mt-0 [&_h3]:text-xs [&_blockquote]:text-xs [&_li]:text-xs [&_p]:text-xs">
                          <SimpleMarkdown content={msg.content} />
                        </div>
                      ) : (
                        <span className="text-xs">{msg.content}</span>
                      )}
                      <p className="text-[9px] opacity-50 mt-1.5">
                        {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[9px] font-semibold text-primary">{initials}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex gap-1 bg-accent/50 rounded-xl px-4 py-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre métricas, datas sazonais, estratégia, equipe..."
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" className="h-[46px] w-[46px] rounded-xl shrink-0" disabled={!input.trim() || isTyping}>
            {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

/* Simple markdown renderer */
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const body = tableRows.slice(2);
    elements.push(
      <table key={`table-${elements.length}`} className="my-2 w-full border-collapse">
        <thead>
          <tr>{headers.map((h, i) => <th key={i} className="border-b border-border px-2 py-1 text-left font-medium">{h.trim()}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className="border-b border-border/50">
              {row.map((cell, ci) => <td key={ci} className="px-2 py-1">{cell.trim()}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("|")) {
      inTable = true;
      tableRows.push(line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1));
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="font-semibold mt-3 mb-1">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="font-semibold mt-2 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(<blockquote key={i} className="border-l-2 border-primary/30 pl-3 my-2 italic text-muted-foreground">{renderInline(line.slice(2))}</blockquote>);
    } else if (line.match(/^[-•] /)) {
      elements.push(<li key={i} className="ml-4 list-disc">{renderInline(line.slice(2))}</li>);
    } else if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\. (.*)/);
      if (num) elements.push(<li key={i} className="ml-4 list-decimal">{renderInline(num[2])}</li>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="my-0.5">{renderInline(line)}</p>);
    }
  }

  if (inTable) flushTable();

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="bg-muted px-1 rounded text-[10px]">{part.slice(1, -1)}</code>;
    return part;
  });
}

export default AIAssistant;
