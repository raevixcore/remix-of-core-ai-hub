import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  BookOpen, Search, Plus, Copy, Pencil, Trash2, FileText, MessageSquare,
  Lightbulb, Tag, Clock, Star, Zap, FolderOpen, ChevronRight, Eye,
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: "published" | "draft";
  views: number;
  helpful: number;
  updatedAt: string;
}

interface Template {
  id: number;
  name: string;
  content: string;
  category: string;
  uses: number;
  shortcut: string;
}

const initialArticles: Article[] = [
  { id: 1, title: "Como configurar o chatbot de WhatsApp", content: "# Configuração do WhatsApp Bot\n\n## Pré-requisitos\n- Conta Business API do WhatsApp\n- Token de acesso configurado nas integrações\n\n## Passo a Passo\n1. Acesse **Integrações > WhatsApp**\n2. Insira o token da API\n3. Configure o número de telefone\n4. Ative o webhook\n5. Teste enviando uma mensagem\n\n## Dicas\n- Use templates aprovados pelo WhatsApp para mensagens proativas\n- Configure horários de atendimento para respostas automáticas", category: "Integrações", tags: ["WhatsApp", "Chatbot", "Setup"], status: "published", views: 342, helpful: 89, updatedAt: "2 dias atrás" },
  { id: 2, title: "Guia de boas práticas de atendimento", content: "# Boas Práticas de Atendimento\n\n## Tempo de Resposta\n- Primeira resposta em até 2 minutos\n- Não deixe o cliente esperando sem feedback\n\n## Tom de Voz\n- Seja profissional mas acolhedor\n- Use o nome do cliente\n- Evite jargões técnicos\n\n## Resolução\n- Tente resolver no primeiro contato\n- Se precisar escalar, explique o motivo\n- Faça follow-up após a resolução", category: "Atendimento", tags: ["Boas Práticas", "Qualidade"], status: "published", views: 521, helpful: 145, updatedAt: "1 semana atrás" },
  { id: 3, title: "FAQ — Perguntas frequentes dos clientes", content: "# FAQ\n\n**Como alterar meu plano?**\nAcesse Configurações > Assinatura e selecione o novo plano.\n\n**Como adicionar novos membros?**\nVá em Equipe > Novo Membro e preencha os dados.\n\n**O chatbot funciona 24h?**\nSim, o chatbot com IA responde automaticamente fora do horário de atendimento.\n\n**Como exportar relatórios?**\nNa página de Estatísticas, clique em Exportar (PDF ou CSV).", category: "FAQ", tags: ["Clientes", "Perguntas", "Suporte"], status: "published", views: 892, helpful: 234, updatedAt: "3 dias atrás" },
  { id: 4, title: "Scripts de vendas para upsell", content: "# Scripts de Upsell\n\n## Abordagem Natural\n\"Percebi que vocês estão usando bastante o módulo de conversas. Sabia que no plano Enterprise vocês teriam acesso à IA de sentimento?\"\n\n## Após Resolver um Ticket\n\"Que bom que resolvemos! A propósito, temos um recurso que poderia evitar esse tipo de situação no futuro...\"\n\n## Renovação\n\"Seu plano renova em 15 dias. Preparei uma proposta especial para upgrade com 20% de desconto.\"", category: "Vendas", tags: ["Upsell", "Scripts", "Comercial"], status: "published", views: 156, helpful: 42, updatedAt: "5 dias atrás" },
  { id: 5, title: "Troubleshooting — Erros comuns de integração", content: "# Erros Comuns\n\n## Erro 401 — Token inválido\nVerifique se o token não expirou e gere um novo nas configurações.\n\n## Webhook não recebe dados\n1. Verifique a URL do webhook\n2. Confirme que o SSL está ativo\n3. Teste com um request manual\n\n## Mensagens duplicadas\nAtive o deduplication no painel de configurações da integração.", category: "Técnico", tags: ["Erros", "Debug", "API"], status: "draft", views: 78, helpful: 15, updatedAt: "Hoje" },
];

const initialTemplates: Template[] = [
  { id: 1, name: "Saudação Inicial", content: "Olá, {nome}! 👋 Seja bem-vindo(a) ao suporte CoreAI. Meu nome é {agente}. Como posso ajudar hoje?", category: "Saudação", uses: 1240, shortcut: "/oi" },
  { id: 2, name: "Encerramento Positivo", content: "Foi um prazer ajudar, {nome}! Se precisar de mais alguma coisa, estamos à disposição. Tenha um ótimo dia! 😊", category: "Encerramento", uses: 980, shortcut: "/tchau" },
  { id: 3, name: "Aguardar Resposta", content: "Entendo, {nome}. Vou verificar isso para você. Me dê um momento, por favor. ⏳", category: "Espera", uses: 856, shortcut: "/espera" },
  { id: 4, name: "Escalar para Humano", content: "Para melhor atender sua solicitação, vou transferir você para um de nossos especialistas. Um momento, por favor.", category: "Escalar", uses: 420, shortcut: "/escalar" },
  { id: 5, name: "Pedir Feedback", content: "Sua opinião é muito importante! Poderia avaliar nosso atendimento? De 1 a 5, qual nota você daria? ⭐", category: "Feedback", uses: 640, shortcut: "/feedback" },
  { id: 6, name: "Problema Técnico", content: "Sentimos muito pelo inconveniente, {nome}. Nossa equipe técnica já está ciente e trabalhando na solução. Prazo estimado: {prazo}.", category: "Técnico", uses: 312, shortcut: "/erro" },
  { id: 7, name: "Proposta Comercial", content: "Ótima escolha, {nome}! Preparei uma proposta personalizada para sua empresa. Vou enviar por email em instantes. 📧", category: "Vendas", uses: 185, shortcut: "/proposta" },
  { id: 8, name: "Follow-up", content: "Oi, {nome}! Passando para saber se a solução que implementamos está funcionando bem. Precisa de algum ajuste?", category: "Follow-up", uses: 290, shortcut: "/followup" },
];

const categories = ["Todos", "Integrações", "Atendimento", "FAQ", "Vendas", "Técnico"];
const templateCategories = ["Todos", "Saudação", "Encerramento", "Espera", "Escalar", "Feedback", "Técnico", "Vendas", "Follow-up"];

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.3 } }),
};

const KnowledgeBasePage = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState(initialArticles);
  const [templates, setTemplates] = useState(initialTemplates);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("Todos");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [createArticleOpen, setCreateArticleOpen] = useState(false);
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
  const [articleForm, setArticleForm] = useState({ title: "", content: "", category: "FAQ", tags: "" });
  const [templateForm, setTemplateForm] = useState({ name: "", content: "", category: "Saudação", shortcut: "" });

  const filteredArticles = articles.filter((a) => {
    const matchSearch = search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === "Todos" || a.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const filteredTemplates = templates.filter((t) => {
    const matchSearch = search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase());
    const matchCategory = templateCategoryFilter === "Todos" || t.category === templateCategoryFilter;
    return matchSearch && matchCategory;
  });

  const handleCreateArticle = () => {
    if (!articleForm.title.trim()) return;
    const newArticle: Article = {
      id: Date.now(), title: articleForm.title, content: articleForm.content,
      category: articleForm.category, tags: articleForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: "draft", views: 0, helpful: 0, updatedAt: "Agora",
    };
    setArticles((prev) => [newArticle, ...prev]);
    setCreateArticleOpen(false);
    setArticleForm({ title: "", content: "", category: "FAQ", tags: "" });
    toast({ title: "Artigo criado!", description: newArticle.title });
  };

  const handleCreateTemplate = () => {
    if (!templateForm.name.trim()) return;
    const newTemplate: Template = {
      id: Date.now(), name: templateForm.name, content: templateForm.content,
      category: templateForm.category, uses: 0, shortcut: templateForm.shortcut,
    };
    setTemplates((prev) => [newTemplate, ...prev]);
    setCreateTemplateOpen(false);
    setTemplateForm({ name: "", content: "", category: "Saudação", shortcut: "" });
    toast({ title: "Template criado!", description: newTemplate.name });
  };

  const copyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copiado!", description: "Template copiado para a área de transferência." });
  };

  const stats = {
    totalArticles: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    totalTemplates: templates.length,
    totalUses: templates.reduce((sum, t) => sum + t.uses, 0),
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Base de Conhecimento
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Artigos, templates e scripts para atendimento e IA.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4 mb-6">
        {[
          { label: "Artigos", value: stats.totalArticles, icon: FileText },
          { label: "Publicados", value: stats.published, icon: Eye },
          { label: "Templates", value: stats.totalTemplates, icon: MessageSquare },
          { label: "Usos Totais", value: stats.totalUses.toLocaleString(), icon: Zap },
        ].map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="h-9 mb-4 bg-muted/50">
          <TabsTrigger value="articles" className="text-xs gap-1.5"><FileText className="h-3.5 w-3.5" /> Artigos</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Templates de Resposta</TabsTrigger>
        </TabsList>

        {/* Articles */}
        <TabsContent value="articles">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar artigo, tag..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
            </div>
            <div className="flex gap-1.5">
              {categories.map((c) => (
                <Button key={c} size="sm" variant={categoryFilter === c ? "default" : "outline"} className="text-[10px] h-7 px-2.5"
                  onClick={() => setCategoryFilter(c)}>{c}</Button>
              ))}
            </div>
            <Button size="sm" className="gap-1.5 text-xs ml-auto" onClick={() => setCreateArticleOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Novo Artigo
            </Button>
          </div>

          <div className="space-y-2">
            {filteredArticles.map((article, i) => (
              <motion.div key={article.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                onClick={() => setSelectedArticle(article)}
                className="rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[9px]">{article.category}</Badge>
                      <Badge variant="outline" className={cn("text-[9px]", article.status === "published" ? "text-success" : "text-warning")}>
                        {article.status === "published" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{article.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Eye className="h-2.5 w-2.5" /> {article.views}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Star className="h-2.5 w-2.5" /> {article.helpful} útil</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {article.updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 ml-3">
                    {article.tags.map((tag) => <Badge key={tag} variant="outline" className="text-[8px] px-1.5 py-0 h-4">{tag}</Badge>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar template..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {templateCategories.slice(0, 6).map((c) => (
                <Button key={c} size="sm" variant={templateCategoryFilter === c ? "default" : "outline"} className="text-[10px] h-7 px-2.5"
                  onClick={() => setTemplateCategoryFilter(c)}>{c}</Button>
              ))}
            </div>
            <Button size="sm" className="gap-1.5 text-xs ml-auto" onClick={() => setCreateTemplateOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Novo Template
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filteredTemplates.map((template, i) => (
              <motion.div key={template.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px]">{template.category}</Badge>
                    <code className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-primary font-mono">{template.shortcut}</code>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyTemplate(template.content)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-xs font-semibold text-foreground mb-1.5">{template.name}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed bg-muted/30 rounded-lg p-2.5">{template.content}</p>
                <p className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5" /> Usado {template.uses}x
                </p>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[9px]">{selectedArticle.category}</Badge>
                  <Badge variant="outline" className={cn("text-[9px]", selectedArticle.status === "published" ? "text-success" : "text-warning")}>
                    {selectedArticle.status === "published" ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
                <DialogTitle className="text-sm">{selectedArticle.title}</DialogTitle>
                <DialogDescription className="text-[10px]">
                  {selectedArticle.views} visualizações · {selectedArticle.helpful} acharam útil · Atualizado {selectedArticle.updatedAt}
                </DialogDescription>
              </DialogHeader>
              <div className="prose prose-sm dark:prose-invert max-w-none text-xs mt-2">
                {selectedArticle.content.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) return <h1 key={i} className="text-base font-bold mt-3 mb-2">{line.slice(2)}</h1>;
                  if (line.startsWith("## ")) return <h2 key={i} className="text-sm font-semibold mt-3 mb-1">{line.slice(3)}</h2>;
                  if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold text-foreground my-1">{line.slice(2, -2)}</p>;
                  if (line.match(/^\d+\./)) return <li key={i} className="ml-4 list-decimal text-xs">{line.replace(/^\d+\.\s*/, "")}</li>;
                  if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-xs">{line.slice(2)}</li>;
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  return <p key={i} className="text-xs my-1">{line}</p>;
                })}
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {selectedArticle.tags.map((tag) => <Badge key={tag} variant="outline" className="text-[9px]"><Tag className="h-2 w-2 mr-0.5" />{tag}</Badge>)}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Article Dialog */}
      <Dialog open={createArticleOpen} onOpenChange={setCreateArticleOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Novo Artigo</DialogTitle>
            <DialogDescription>Adicione um artigo à base de conhecimento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Título *</Label><Input placeholder="Título do artigo" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} /></div>
            <div className="space-y-2">
              <Label className="text-xs">Categoria</Label>
              <Select value={articleForm.category} onValueChange={(v) => setArticleForm({ ...articleForm, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.filter((c) => c !== "Todos").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label className="text-xs">Tags (separadas por vírgula)</Label><Input placeholder="tag1, tag2, tag3" value={articleForm.tags} onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Conteúdo (Markdown)</Label><Textarea placeholder="# Título&#10;&#10;Conteúdo do artigo..." rows={8} value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateArticleOpen(false)}>Cancelar</Button>
            <Button disabled={!articleForm.title.trim()} onClick={handleCreateArticle}>Criar Artigo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={createTemplateOpen} onOpenChange={setCreateTemplateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Novo Template</DialogTitle>
            <DialogDescription>Crie um template de resposta rápida.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Nome *</Label><Input placeholder="Nome do template" value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Atalho</Label><Input placeholder="/atalho" value={templateForm.shortcut} onChange={(e) => setTemplateForm({ ...templateForm, shortcut: e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Categoria</Label>
              <Select value={templateForm.category} onValueChange={(v) => setTemplateForm({ ...templateForm, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{templateCategories.filter((c) => c !== "Todos").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Conteúdo</Label>
              <Textarea placeholder="Use {nome} e {agente} como variáveis..." rows={4} value={templateForm.content} onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })} />
              <p className="text-[9px] text-muted-foreground">Variáveis disponíveis: {"{nome}"}, {"{agente}"}, {"{empresa}"}, {"{prazo}"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTemplateOpen(false)}>Cancelar</Button>
            <Button disabled={!templateForm.name.trim()} onClick={handleCreateTemplate}>Criar Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
