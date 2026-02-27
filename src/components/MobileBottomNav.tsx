import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, MessageSquare, BarChart3, Megaphone, Bot, MoreHorizontal,
  CalendarDays, Users, Settings, BookOpen, TrendingUp, Workflow, Contact,
  FileText, ShieldCheck, Share2, Bell, LifeBuoy, CreditCard, ScrollText, UsersRound,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/i18n/I18nContext";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const mainTabs = [
  { labelKey: "nav.dashboard", path: "/", icon: LayoutDashboard },
  { labelKey: "nav.conversations", path: "/conversations", icon: MessageSquare },
  { labelKey: "nav.marketing", path: "/marketing", icon: Megaphone },
  { labelKey: "nav.statistics", path: "/statistics", icon: BarChart3 },
];

const moreItems = [
  { labelKey: "nav.content", path: "/content", icon: FileText },
  { labelKey: "nav.approvals", path: "/approvals", icon: ShieldCheck },
  { labelKey: "nav.calendar", path: "/calendar", icon: CalendarDays },
  { labelKey: "nav.socialStats", path: "/social-stats", icon: Share2 },
  { labelKey: "nav.crm", path: "/crm", icon: Contact },
  { labelKey: "nav.knowledgeBase", path: "/knowledge-base", icon: BookOpen },
  { labelKey: "nav.analyticsPro", path: "/analytics-pro", icon: TrendingUp },
  { labelKey: "nav.automations", path: "/automations", icon: Workflow },
  { labelKey: "nav.aiAssistant", path: "/ai-assistant", icon: Bot },
  { labelKey: "nav.team", path: "/team", icon: UsersRound },
  { labelKey: "nav.integrations", path: "/profiles", icon: Users },
  { labelKey: "nav.subscription", path: "/subscription", icon: CreditCard },
  { labelKey: "nav.notifications", path: "/notifications", icon: Bell },
  { labelKey: "nav.settings", path: "/settings", icon: Settings },
  { labelKey: "nav.support", path: "/support", icon: LifeBuoy },
  { labelKey: "nav.logs", path: "/logs", icon: ScrollText },
];

export function MobileBottomNav() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  if (!isMobile) return null;

  const isMoreActive = moreItems.some((item) => item.path === location.pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {mainTabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors min-w-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium truncate">{t(tab.labelKey)}</span>
            </button>
          );
        })}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors",
                isMoreActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-medium">{t("nav.more")}</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[70vh] rounded-t-2xl px-4 pb-8">
            <div className="grid grid-cols-4 gap-4 pt-4">
              {moreItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setOpen(false); }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl p-3 transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium text-center leading-tight">{t(item.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
