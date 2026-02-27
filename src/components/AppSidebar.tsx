import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, createContext, useContext } from "react";
import raevixLogo from "@/assets/raevix-logo.png";
import {
  LayoutDashboard, FileText, MessageSquare, ShieldCheck,
  CalendarDays, Users, CreditCard, BarChart3, Settings,
  Bot, UsersRound, Share2, LifeBuoy, ScrollText, Bell, Contact,
  Megaphone, BookOpen, TrendingUp, Workflow, ChevronLeft, ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/* ─── Sidebar Context ─── */
interface SidebarCtx { collapsed: boolean; toggle: () => void }
const SidebarContext = createContext<SidebarCtx>({ collapsed: false, toggle: () => {} });
export const useSidebarState = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("sidebar-collapsed") === "true"; } catch { return false; }
  });
  const toggle = () => {
    setCollapsed((p) => {
      localStorage.setItem("sidebar-collapsed", String(!p));
      return !p;
    });
  };
  return <SidebarContext.Provider value={{ collapsed, toggle }}>{children}</SidebarContext.Provider>;
}

/* ─── Nav Groups ─── */
interface NavItem {
  labelKey: string;
  path: string;
  icon: any;
  adminOnly: boolean;
}

interface NavGroup {
  labelKey: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navGroups: NavGroup[] = [
  {
    labelKey: "nav.group.main",
    defaultOpen: true,
    items: [
      { labelKey: "nav.conversations", path: "/conversations", icon: MessageSquare, adminOnly: false },
      { labelKey: "nav.content", path: "/content", icon: FileText, adminOnly: false },
      { labelKey: "nav.calendar", path: "/calendar", icon: CalendarDays, adminOnly: false },
      { labelKey: "nav.approvals", path: "/approvals", icon: ShieldCheck, adminOnly: true },
    ],
  },
  {
    labelKey: "nav.group.analytics",
    defaultOpen: true,
    items: [
      { labelKey: "nav.statistics", path: "/statistics", icon: BarChart3, adminOnly: false },
      { labelKey: "nav.socialStats", path: "/social-stats", icon: Share2, adminOnly: false },
      { labelKey: "nav.analyticsPro", path: "/analytics-pro", icon: TrendingUp, adminOnly: false },
    ],
  },
  {
    labelKey: "nav.group.marketing",
    defaultOpen: false,
    items: [
      { labelKey: "nav.marketing", path: "/marketing", icon: Megaphone, adminOnly: false },
      { labelKey: "nav.crm", path: "/crm", icon: Contact, adminOnly: false },
      { labelKey: "nav.automations", path: "/automations", icon: Workflow, adminOnly: false },
    ],
  },
  {
    labelKey: "nav.group.knowledge",
    defaultOpen: false,
    items: [
      { labelKey: "nav.knowledgeBase", path: "/knowledge-base", icon: BookOpen, adminOnly: false },
      { labelKey: "nav.aiAssistant", path: "/ai-assistant", icon: Bot, adminOnly: false },
    ],
  },
  {
    labelKey: "nav.group.admin",
    defaultOpen: false,
    items: [
      { labelKey: "nav.team", path: "/team", icon: UsersRound, adminOnly: true },
      { labelKey: "nav.integrations", path: "/profiles", icon: Users, adminOnly: true },
      { labelKey: "nav.subscription", path: "/subscription", icon: CreditCard, adminOnly: true },
      { labelKey: "nav.logs", path: "/logs", icon: ScrollText, adminOnly: true },
      { labelKey: "nav.settings", path: "/settings", icon: Settings, adminOnly: true },
    ],
  },
  {
    labelKey: "nav.group.other",
    defaultOpen: false,
    items: [
      { labelKey: "nav.notifications", path: "/notifications", icon: Bell, adminOnly: false },
      { labelKey: "nav.support", path: "/support", icon: LifeBuoy, adminOnly: false },
    ],
  },
];

/* ─── Collapsible Group ─── */
function SidebarGroup({ group, collapsed: sidebarCollapsed }: { group: NavGroup; collapsed: boolean }) {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useI18n();

  const visibleItems = group.items.filter((item) => !item.adminOnly || user?.role === "admin");
  const hasActive = visibleItems.some((item) => location.pathname === item.path);
  const [open, setOpen] = useState(group.defaultOpen || hasActive);

  if (visibleItems.length === 0) return null;

  // In collapsed sidebar, always show items (no group headers)
  if (sidebarCollapsed) {
    return (
      <div className="space-y-0.5">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tooltip key={item.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <RouterNavLink
                  to={item.path}
                  className={cn(
                    "flex items-center justify-center rounded-lg p-2 transition-all",
                    isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                </RouterNavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">{t(item.labelKey)}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        <span>{t(group.labelKey)}</span>
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>

      {open && (
        <div className="space-y-0.5 mt-0.5">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <RouterNavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
                  isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                {t(item.labelKey)}
              </RouterNavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main Sidebar ─── */
export function AppSidebar() {
  const location = useLocation();
  const { t } = useI18n();
  const { collapsed, toggle } = useSidebarState();
  const isDashboardActive = location.pathname === "/";

  return (
    <aside className={cn(
      "flex h-full flex-col border-r border-border bg-sidebar transition-all duration-200",
      collapsed ? "w-14" : "w-56"
    )}>
      {/* Logo */}
      <div className={cn("flex items-center h-14 border-b border-border shrink-0", collapsed ? "justify-center px-2" : "gap-2.5 px-5")}>
        <img src={raevixLogo} alt="Raevix Core" className="h-7 w-7 rounded-md shrink-0" />
        {!collapsed && <span className="text-sm font-bold tracking-tight text-foreground">Raevix Core</span>}
      </div>

      {/* Dashboard (standalone, always visible) */}
      <div className={cn("px-2 pt-3 pb-1", collapsed && "px-1.5")}>
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <RouterNavLink
                to="/"
                className={cn(
                  "flex items-center justify-center rounded-lg p-2 transition-all",
                  isDashboardActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <LayoutDashboard className={cn("h-4 w-4", isDashboardActive && "text-primary")} />
              </RouterNavLink>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">{t("nav.dashboard")}</TooltipContent>
          </Tooltip>
        ) : (
          <RouterNavLink
            to="/"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
              isDashboardActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <LayoutDashboard className={cn("h-4 w-4 shrink-0", isDashboardActive && "text-primary")} />
            {t("nav.dashboard")}
          </RouterNavLink>
        )}
      </div>

      {/* Separator */}
      <div className="mx-3 my-1 border-t border-border" />

      {/* Grouped nav */}
      <nav className={cn("flex-1 space-y-3 overflow-y-auto py-2", collapsed ? "px-1.5" : "px-2")}>
        {navGroups.map((group) => (
          <SidebarGroup key={group.labelKey} group={group} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2 shrink-0">
        <button
          onClick={toggle}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all w-full",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
