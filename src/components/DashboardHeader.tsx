import { useState } from "react";
import { Bell, ChevronDown, Globe, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { useI18n, localeLabels, type Locale } from "@/i18n/I18nContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const mockNotifications = [
  { id: 1, text: "Nova mensagem de Carlos no Telegram", time: "2 min", read: false },
  { id: 2, text: "Tarefa atribuída: Responder WhatsApp", time: "15 min", read: false },
  { id: 3, text: "Integração Instagram reconectada", time: "1h", read: true },
];

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, locale, setLocale } = useI18n();
  const [notifications] = useState(mockNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  const initials = user?.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel = user?.role === "admin" ? t("header.admin") : user?.role === "manager" ? t("header.manager") : t("header.agent");

  return (
    <header className="h-14 shrink-0 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{t("header.myCompany")}</span>
        <span className="text-xs text-muted-foreground">/ {roleLabel}</span>
      </div>

      <div className="flex items-center gap-2">
        <GlobalSearch />
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 items-center gap-1.5 rounded-md px-2 hover:bg-accent transition-colors">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground hidden sm:inline">{localeLabels[locale].flag}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {(Object.entries(localeLabels) as [Locale, { label: string; flag: string }][]).map(([key, val]) => (
              <DropdownMenuItem key={key} className={cn("text-xs gap-2 cursor-pointer", locale === key && "font-semibold text-primary")}
                onClick={() => setLocale(key)}>
                <span>{val.flag}</span> {val.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeCustomizer />
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors">
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs font-semibold text-foreground">{t("header.notifications")}</p>
            </div>
            {notifications.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">{t("header.noNotifications")}</div>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                    <span className={cn("text-xs leading-snug", n.read ? "text-muted-foreground" : "text-foreground font-medium")}>{n.text}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-3.5">{n.time}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-primary">{initials}</span>
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-medium text-foreground truncate max-w-[100px]">{user?.name || "Usuário"}</span>
                <span className="text-[10px] text-muted-foreground">{user?.role || "—"}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="text-xs gap-2 cursor-pointer" onClick={() => navigate("/profile")}>
              <User className="h-3.5 w-3.5" /> {t("header.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs gap-2 cursor-pointer" onClick={() => navigate("/settings")}>
              <Settings className="h-3.5 w-3.5" /> {t("header.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-xs gap-2 cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="h-3.5 w-3.5" /> {t("header.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
