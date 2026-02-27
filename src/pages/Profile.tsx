import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { cn } from "@/lib/utils";
import {
  User, Mail, Phone, Shield, Clock, MessageSquare, CheckCircle2,
  Camera, Save, Key, Bell, Globe, Palette, BarChart3,
} from "lucide-react";

const activityLog = [
  { action: "Login realizado", time: "Hoje, 17:45", icon: User },
  { action: "Conversa #4521 assumida", time: "Hoje, 17:30", icon: MessageSquare },
  { action: "Configurações atualizadas", time: "Hoje, 16:40", icon: CheckCircle2 },
  { action: "Membro Pedro Santos adicionado", time: "Ontem, 14:20", icon: User },
  { action: "Relatório exportado", time: "Ontem, 10:15", icon: BarChart3 },
  { action: "Senha alterada", time: "3 dias atrás", icon: Key },
  { action: "Login realizado", time: "3 dias atrás", icon: User },
  { action: "Tema alterado para escuro", time: "5 dias atrás", icon: Palette },
];

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.3 } }),
};

const ProfilePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { locale } = useI18n();

  const [form, setForm] = useState({
    name: user?.name || "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 99999-0000",
    bio: "Administrador da plataforma CoreAI. Responsável pela gestão de equipe e integrações.",
  });

  const [notifications, setNotifications] = useState({
    email: true, push: true, newMessage: true, teamUpdates: true, systemAlerts: false,
  });

  const initials = form.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const stats = {
    conversations: 1280,
    messages: 4523,
    avgResponse: "2.4 min",
    satisfaction: "98%",
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gerencie suas informações pessoais e preferências.</p>
      </motion.div>

      {/* Profile Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
        className="rounded-xl border border-border bg-card p-6 mb-6"
      >
        <div className="flex items-start gap-5">
          <div className="relative group">
            <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{initials}</span>
            </div>
            <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{form.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="outline" className="text-[10px] gap-1 text-primary">
                <Shield className="h-2.5 w-2.5" /> {user?.role === "admin" ? "Administrador" : user?.role === "manager" ? "Manager" : "Agente"}
              </Badge>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Mail className="h-2.5 w-2.5" /> {form.email}
              </span>
              <span className="text-[10px] text-success flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-md">{form.bio}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-border">
          {[
            { label: "Conversas Atendidas", value: stats.conversations.toLocaleString(), icon: MessageSquare },
            { label: "Mensagens Enviadas", value: stats.messages.toLocaleString(), icon: MessageSquare },
            { label: "Tempo Médio Resposta", value: stats.avgResponse, icon: Clock },
            { label: "Satisfação", value: stats.satisfaction, icon: CheckCircle2 },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="h-9 mb-6 bg-muted/50">
          <TabsTrigger value="personal" className="text-xs gap-1.5"><User className="h-3.5 w-3.5" /> Dados Pessoais</TabsTrigger>
          <TabsTrigger value="security" className="text-xs gap-1.5"><Key className="h-3.5 w-3.5" /> Segurança</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs gap-1.5"><Bell className="h-3.5 w-3.5" /> Notificações</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs gap-1.5"><Clock className="h-3.5 w-3.5" /> Atividade</TabsTrigger>
        </TabsList>

        {/* Personal Data */}
        <TabsContent value="personal">
          <div className="space-y-6 max-w-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">Nome Completo</Label>
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
                <Label className="text-xs">Idioma</Label>
                <Input value={locale === "pt-BR" ? "Português (BR)" : locale === "en" ? "English" : "Español"} readOnly className="bg-muted/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Bio</Label>
              <Input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <Button size="sm" className="gap-1.5" onClick={() => toast({ title: "Salvo!", description: "Dados pessoais atualizados." })}>
              <Save className="h-3.5 w-3.5" /> Salvar Alterações
            </Button>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-6 max-w-xl">
            <div className="rounded-xl border border-border p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Key className="h-4 w-4" /> Alterar Senha
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Senha Atual</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Nova Senha</Label>
                  <Input type="password" placeholder="Mínimo 8 caracteres" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Confirmar Nova Senha</Label>
                  <Input type="password" placeholder="Repita a nova senha" />
                </div>
              </div>
              <Button size="sm" onClick={() => toast({ title: "Senha atualizada!", description: "Sua senha foi alterada com sucesso." })}>
                Alterar Senha
              </Button>
            </div>

            <div className="rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">Sessões Ativas</h3>
              <div className="space-y-2">
                {[
                  { device: "Chrome — macOS", ip: "192.168.1.100", current: true },
                  { device: "Safari — iPhone 15", ip: "10.0.0.55", current: false },
                ].map((s) => (
                  <div key={s.device} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <div>
                      <p className="text-xs font-medium text-foreground">{s.device}</p>
                      <p className="text-[10px] text-muted-foreground">IP: {s.ip}</p>
                    </div>
                    {s.current ? (
                      <Badge variant="outline" className="text-[10px] text-success">Sessão Atual</Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="text-[10px] h-7 text-destructive">Encerrar</Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Preferences */}
        <TabsContent value="notifications">
          <div className="space-y-4 max-w-xl">
            {[
              { key: "email" as const, label: "Notificações por Email", desc: "Receba alertas importantes por email." },
              { key: "push" as const, label: "Notificações Push", desc: "Notificações no navegador em tempo real." },
              { key: "newMessage" as const, label: "Novas Mensagens", desc: "Aviso ao receber mensagens de clientes." },
              { key: "teamUpdates" as const, label: "Atualizações da Equipe", desc: "Novos membros, alterações de função, etc." },
              { key: "systemAlerts" as const, label: "Alertas do Sistema", desc: "Erros, manutenção e atualizações." },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="text-xs font-medium text-foreground">{n.label}</p>
                  <p className="text-[10px] text-muted-foreground">{n.desc}</p>
                </div>
                <Switch checked={notifications[n.key]} onCheckedChange={(v) => setNotifications({ ...notifications, [n.key]: v })} />
              </div>
            ))}
            <Button size="sm" className="gap-1.5" onClick={() => toast({ title: "Salvo!", description: "Preferências de notificação atualizadas." })}>
              <Save className="h-3.5 w-3.5" /> Salvar Preferências
            </Button>
          </div>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity">
          <div className="space-y-2 max-w-xl">
            {activityLog.map((item, i) => (
              <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{item.action}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> {item.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ProfilePage;
