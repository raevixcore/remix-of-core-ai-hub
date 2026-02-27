import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import raevixLogo from "@/assets/raevix-logo.png";
import { API_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const benefits = [
  "Dashboard inteligente com IA",
  "Atendimento automatizado multi-canal",
  "Calendário com datas sazonais brasileiras",
  "Analytics avançado e relatórios",
  "Gestão de equipe e CRM integrado",
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, label: "", color: "" };
    if (password.length < 6) return { level: 1, label: "Fraca", color: "bg-destructive" };
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [password.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score <= 1) return { level: 1, label: "Fraca", color: "bg-destructive" };
    if (score === 2) return { level: 2, label: "Média", color: "bg-warning" };
    if (score === 3) return { level: 3, label: "Forte", color: "bg-success" };
    return { level: 4, label: "Muito forte", color: "bg-success" };
  })();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast({ title: t("auth.error"), description: data.error || t("auth.registerError"), variant: "destructive" });
        return;
      }
      toast({ title: t("auth.accountCreated"), description: t("auth.loginToContinue") });
      navigate("/login");
    } catch {
      toast({ title: t("auth.error"), description: t("auth.serverError"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="w-full max-w-[420px] space-y-8"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden mb-2">
            <img src={raevixLogo} alt="Raevix Core" className="h-10 w-10 rounded-xl" />
            <span className="text-xl font-bold text-foreground tracking-tight">Raevix Core</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("auth.createAccount")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("auth.fillData")}</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium">{t("auth.name")}</Label>
              <Input
                id="name"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>
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
              <Label htmlFor="password" className="text-xs font-medium">{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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
              {/* Password strength */}
              {password.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors",
                        i <= passwordStrength.level ? passwordStrength.color : "bg-border"
                      )} />
                    ))}
                  </div>
                  <p className={cn("text-[10px] font-medium", passwordStrength.color.replace("bg-", "text-"))}>
                    {passwordStrength.label}
                  </p>
                </motion.div>
              )}
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-semibold gap-2" disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {t("auth.registering")}</>
              ) : (
                <>{t("auth.register")} <ArrowRight className="h-4 w-4" /></>
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
            {t("auth.hasAccount")}{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">{t("auth.login")}</Link>
          </p>
        </motion.div>
      </div>

      {/* Right panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary via-primary/90 to-primary/70" />
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
                Comece grátis.<br />Escale com IA.
              </h1>
              <p className="text-primary-foreground/70 text-base max-w-md">
                Crie sua conta e tenha acesso completo à plataforma de gestão inteligente.
              </p>
            </motion.div>

            <div className="space-y-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground/80 shrink-0" />
                  <span className="text-sm text-primary-foreground/80">{b}</span>
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
    </div>
  );
};

export default Register;
