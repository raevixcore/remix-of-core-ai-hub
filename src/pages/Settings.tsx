import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import {
  Building2, Palette, Bot, Webhook, Globe, Save, Copy, Eye, EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Company Tab ─── */
function CompanyTab() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "Minha Empresa", email: "contato@empresa.com", phone: "(11) 99999-0000", website: "https://empresa.com" });

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Dados da Empresa</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Informações básicas da sua organização.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">Nome da Empresa</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Telefone</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Website</Label>
          <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </div>
      </div>
      <Button size="sm" className="gap-1.5" onClick={() => toast({ title: "Salvo!", description: "Dados da empresa atualizados." })}>
        <Save className="h-3.5 w-3.5" /> Salvar Alterações
      </Button>
    </div>
  );
}

/* ─── Appearance Tab ─── */
function AppearanceTab() {
  const { locale, setLocale, t } = useI18n();

  const isDark = document.documentElement.classList.contains("dark");
  const [theme, setThemeState] = useState<"light" | "dark">(isDark ? "dark" : "light");

  // Get current preset from localStorage
  const [colorPreset, setColorPreset] = useState(() => {
    try { return localStorage.getItem("theme-preset") || "blue"; } catch { return "blue"; }
  });

  const applyTheme = (mode: "light" | "dark") => {
    setThemeState(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  };

  const applyColorPreset = (preset: string) => {
    setColorPreset(preset);
    localStorage.setItem("theme-preset", preset);
    // Trigger re-apply via storage event simulation
    window.dispatchEvent(new Event("storage"));
    // Force re-apply CSS vars
    const presetVars: Record<string, Record<string, string>> = {
      blue: { "--primary": "220 80% 56%", "--ring": "220 80% 56%", "--glow-primary": "220 80% 56%", "--sidebar-primary": "220 80% 56%" },
      violet: { "--primary": "263 70% 58%", "--ring": "263 70% 58%", "--glow-primary": "263 70% 58%", "--sidebar-primary": "263 70% 58%" },
      emerald: { "--primary": "160 84% 39%", "--ring": "160 84% 39%", "--glow-primary": "160 84% 39%", "--sidebar-primary": "160 84% 39%" },
      rose: { "--primary": "347 77% 50%", "--ring": "347 77% 50%", "--glow-primary": "347 77% 50%", "--sidebar-primary": "347 77% 50%" },
      amber: { "--primary": "38 92% 50%", "--ring": "38 92% 50%", "--glow-primary": "38 92% 50%", "--sidebar-primary": "38 92% 50%" },
      cyan: { "--primary": "199 89% 48%", "--ring": "199 89% 48%", "--glow-primary": "199 89% 48%", "--sidebar-primary": "199 89% 48%" },
    };
    const vars = presetVars[preset];
    if (vars) Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  };

  const themes = [
    { id: "light" as const, labelKey: "settings.light" },
    { id: "dark" as const, labelKey: "settings.dark" },
  ];

  const colorPresets = [
    { id: "blue", label: "Azul", color: "hsl(220,80%,56%)" },
    { id: "violet", label: "Violeta", color: "hsl(263,70%,58%)" },
    { id: "emerald", label: "Esmeralda", color: "hsl(160,84%,39%)" },
    { id: "rose", label: "Rosa", color: "hsl(347,77%,50%)" },
    { id: "amber", label: "Âmbar", color: "hsl(38,92%,50%)" },
    { id: "cyan", label: "Ciano", color: "hsl(199,89%,48%)" },
  ];

  const languages = [
    { id: "pt-BR" as const, label: "Português (BR)", flag: "🇧🇷" },
    { id: "en" as const, label: "English", flag: "🇺🇸" },
    { id: "es" as const, label: "Español", flag: "🇪🇸" },
  ];

  return (
    <div className="space-y-8 max-w-xl">
      {/* Theme mode */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">{t("settings.theme")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t("settings.themeDesc")}</p>
        <div className="flex gap-3 mt-4">
          {themes.map((th) => (
            <button
              key={th.id}
              onClick={() => applyTheme(th.id)}
              className={cn(
                "flex-1 rounded-xl border p-4 text-center transition-all",
                theme === th.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
              )}
            >
              <div className={cn(
                "mx-auto mb-2 h-8 w-12 rounded-md border",
                th.id === "dark" ? "bg-[hsl(228,12%,8%)] border-[hsl(228,12%,17%)]" : "bg-[hsl(0,0%,99%)] border-[hsl(220,13%,91%)]"
              )} />
              <span className="text-xs font-medium text-foreground">{t(th.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color presets */}
      <div>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Palette className="h-4 w-4" /> Cor do Tema
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">Escolha a cor principal da interface.</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
          {colorPresets.map((p) => (
            <button
              key={p.id}
              onClick={() => applyColorPreset(p.id)}
              className={cn(
                "rounded-xl border p-3 flex flex-col items-center gap-2 transition-all",
                colorPreset === p.id ? "border-primary ring-1 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/30"
              )}
            >
              <div className="h-8 w-8 rounded-full border-2 border-border relative" style={{ backgroundColor: p.color }}>
                {colorPreset === p.id && (
                  <svg className="h-3 w-3 text-white absolute inset-0 m-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-medium text-foreground">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Globe className="h-4 w-4" /> {t("settings.language")}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t("settings.languageDesc")}</p>
        <div className="flex gap-3 mt-4">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => setLocale(l.id)}
              className={cn(
                "flex-1 rounded-xl border p-3 text-center transition-all",
                locale === l.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
              )}
            >
              <span className="text-lg mb-1 block">{l.flag}</span>
              <span className="text-[11px] font-medium text-foreground">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── AI Tab ─── */
function AITab() {
  const [autoReply, setAutoReply] = useState(true);
  const [sentiment, setSentiment] = useState(true);
  const [suggestions, setSuggestions] = useState(false);
  const [model, setModel] = useState("gpt-4");

  const toggles = [
    { label: "Respostas Automáticas", desc: "IA responde automaticamente quando o agente está offline.", value: autoReply, onChange: setAutoReply },
    { label: "Análise de Sentimento", desc: "Detecta o tom das mensagens recebidas.", value: sentiment, onChange: setSentiment },
    { label: "Sugestões Inteligentes", desc: "Sugere respostas baseadas no contexto da conversa.", value: suggestions, onChange: setSuggestions },
  ];

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Configurações de IA</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Personalize o comportamento da inteligência artificial.</p>
      </div>

      <div className="space-y-4">
        {toggles.map((t) => (
          <div key={t.label} className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="text-xs font-medium text-foreground">{t.label}</p>
              <p className="text-[11px] text-muted-foreground">{t.desc}</p>
            </div>
            <Switch checked={t.value} onCheckedChange={t.onChange} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Modelo de IA</Label>
        <div className="flex gap-3">
          {["gpt-4", "gpt-3.5", "custom"].map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={cn(
                "rounded-lg border px-4 py-2 text-xs font-medium transition-all",
                model === m ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {m === "custom" ? "Personalizado" : m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Webhooks Tab ─── */
function WebhooksTab() {
  const { toast } = useToast();
  const [showSecret, setShowSecret] = useState(false);
  const webhookUrl = "https://coreai-clean.replit.app/api/webhooks/events";
  const secret = "whsec_xK9mP2qR7sT4vW8yB3dF6gH1jL5nQ0a";

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Webhooks</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Configure endpoints para receber eventos em tempo real.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Webhook URL</span>
            <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">Ativo</Badge>
          </div>
          <div className="flex gap-2">
            <Input value={webhookUrl} readOnly className="text-xs font-mono" />
            <Button size="sm" variant="outline" className="shrink-0" onClick={() => { navigator.clipboard.writeText(webhookUrl); toast({ title: "Copiado!" }); }}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3">
          <span className="text-xs font-medium text-foreground">Signing Secret</span>
          <div className="flex gap-2">
            <Input value={showSecret ? secret : "••••••••••••••••••••••••"} readOnly className="text-xs font-mono" />
            <Button size="sm" variant="outline" className="shrink-0" onClick={() => setShowSecret(!showSecret)}>
              {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <span className="text-xs font-medium text-foreground mb-3 block">Eventos Habilitados</span>
          <div className="flex flex-wrap gap-2">
            {["message.received", "message.sent", "conversation.created", "conversation.closed", "agent.assigned"].map((e) => (
              <Badge key={e} variant="outline" className="text-[10px] font-mono">{e}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */
const tabConfig = [
  { id: "company", label: "Empresa", icon: Building2 },
  { id: "appearance", label: "Aparência", icon: Palette },
  { id: "ai", label: "IA", icon: Bot },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
];

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gerencie as preferências da sua conta e empresa.</p>
      </motion.div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="h-9 mb-6 bg-muted/50">
          {tabConfig.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="text-xs gap-1.5 data-[state=active]:bg-card">
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="company"><CompanyTab /></TabsContent>
        <TabsContent value="appearance"><AppearanceTab /></TabsContent>
        <TabsContent value="ai"><AITab /></TabsContent>
        <TabsContent value="webhooks"><WebhooksTab /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SettingsPage;
