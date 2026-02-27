import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Eye, EyeOff, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import raevixLogo from "@/assets/raevix-logo.png";
import { API_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  { icon: Zap, title: "IA Autônoma", desc: "Atendimento e conteúdo gerenciados por especialistas de IA" },
  { icon: Shield, title: "Segurança Total", desc: "Seus dados protegidos com criptografia de ponta" },
  { icon: BarChart3, title: "Analytics Avançado", desc: "Métricas em tempo real e insights estratégicos" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({ title: t("auth.error"), description: data.error || t("auth.invalidCredentials"), variant: "destructive" });
        return;
      }
      login(data.access_token, data.refresh_token, data.user);
      toast({ title: t("auth.welcome"), description: `${t("auth.hello")}, ${data.user.name}` });
      navigate("/");
    } catch {
      toast({ title: t("auth.error"), description: t("auth.serverError"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />

        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground w-full">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <img src={raevixLogo} alt="Raevix Core" className="h-10 w-10 rounded-xl" />
            <span className="text-xl font-bold tracking-tight">Raevix Core</span>
          </motion.div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl font-bold leading-tight mb-3">
                Gerencie tudo com<br />inteligência artificial.
              </h1>
              <p className="text-primary-foreground/70 text-base max-w-md">
                Plataforma completa de atendimento, conteúdo e análise — tudo automatizado por IA.
              </p>
            </motion.div>

            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3"
                >
                  <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-primary-foreground/60">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Raevix Core. Todos os direitos reservados.
          </motion.p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="w-full max-w-[400px] space-y-8"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden mb-2">
            <img src={raevixLogo} alt="Raevix Core" className="h-10 w-10 rounded-xl" />
            <span className="text-xl font-bold text-foreground tracking-tight">Raevix Core</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("auth.login")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("auth.enterAccount")}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium">{t("auth.email")}</Label>
              <Input
                id="email"
                placeholder="seu@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium">{t("auth.password")}</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-semibold gap-2" disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {t("auth.loggingIn")}</>
              ) : (
                <>{t("auth.login")} <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">ou</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">{t("auth.register")}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
