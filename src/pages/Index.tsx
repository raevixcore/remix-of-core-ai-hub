import {
  Brain,
  ShieldCheck,
  MessageSquare,
  CalendarClock,
  Instagram,
  Twitter,
  Send,
  Phone,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AIStatusBar } from "@/components/AIStatusBar";
import { AIEventCards } from "@/components/AIEventCards";
import { AttentionPanel } from "@/components/AttentionPanel";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { OnboardingChecklist } from "@/components/Onboarding";
import { CustomizableDashboard } from "@/components/CustomizableDashboard";

const aiActivities = [
  { action: "Auto-generated caption for IG post", time: "2m ago", type: "content" },
  { action: "Sentiment analysis on 12 new messages", time: "5m ago", type: "analysis" },
  { action: "Suggested reply for WhatsApp thread", time: "8m ago", type: "reply" },
  { action: "Flagged post for tone review", time: "15m ago", type: "review" },
];

const pendingApprovals = [
  { title: "Instagram Story — Product Launch", platform: "Instagram", priority: "high" },
  { title: "Thread on X — Industry Trends", platform: "X", priority: "medium" },
  { title: "Telegram Broadcast — Weekly Update", platform: "Telegram", priority: "low" },
];

const conversations = [
  { name: "Sarah K.", platform: "WhatsApp", preview: "Can you send the pricing details?", unread: 3 },
  { name: "Marketing Team", platform: "Telegram", preview: "Campaign assets are ready for review", unread: 7 },
  { name: "David L.", platform: "WhatsApp", preview: "Thanks, I'll review and get back to you", unread: 0 },
];

const scheduledPosts = [
  { title: "Product Feature Highlight", platform: "Instagram", time: "Today, 3:00 PM" },
  { title: "Industry Insight Thread", platform: "X", time: "Today, 5:30 PM" },
  { title: "Behind the Scenes Reel", platform: "Instagram", time: "Tomorrow, 10:00 AM" },
  { title: "Community Poll", platform: "X", time: "Tomorrow, 2:00 PM" },
];

const platformIcon = (platform: string) => {
  switch (platform) {
    case "Instagram":
      return <Instagram className="h-3.5 w-3.5" />;
    case "X":
      return <Twitter className="h-3.5 w-3.5" />;
    case "Telegram":
      return <Send className="h-3.5 w-3.5" />;
    case "WhatsApp":
      return <Phone className="h-3.5 w-3.5" />;
    default:
      return null;
  }
};

const priorityColor = (p: string) => {
  switch (p) {
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const Index = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Welcome back. Here's your AI-powered overview.</p>
      </motion.div>

      {/* Onboarding Checklist */}
      <OnboardingChecklist />

      {/* Customizable Dashboard Widgets */}
      <div className="mb-5">
        <CustomizableDashboard />
      </div>

      {/* AI Status Bar */}
      <AIStatusBar />

      {/* Central de Atenção */}
      <AttentionPanel />

      {/* Dynamic AI Event Cards */}
      <div className="mb-5">
        <AIEventCards />
      </div>

      {/* Standard Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* AI Activity */}
        <DashboardCard title="AI Activity" icon={<Brain className="h-4 w-4" />} delay={0.05}>
          <div className="space-y-2.5">
            {aiActivities.map((a, i) => (
              <div
                key={i}
                className="flex items-start justify-between rounded-lg border border-border/50 bg-background/50 px-3 py-2.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{a.action}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Pending Approvals */}
        <DashboardCard title="Pending Approvals" icon={<ShieldCheck className="h-4 w-4" />} delay={0.1}>
          <div className="space-y-2.5">
            {pendingApprovals.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-muted-foreground">{platformIcon(a.platform)}</span>
                  <p className="text-xs font-medium text-foreground truncate">{a.title}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColor(a.priority)}`}>
                  {a.priority}
                </Badge>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Conversations */}
        <DashboardCard title="Conversations" icon={<MessageSquare className="h-4 w-4" />} delay={0.15}>
          <div className="space-y-2.5">
            {conversations.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-muted-foreground">{platformIcon(c.platform)}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{c.preview}</p>
                  </div>
                </div>
                {c.unread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground shrink-0">
                    {c.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Scheduled Posts */}
        <DashboardCard title="Upcoming Posts" icon={<CalendarClock className="h-4 w-4" />} delay={0.2}>
          <div className="space-y-2.5">
            {scheduledPosts.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-muted-foreground">{platformIcon(p.platform)}</span>
                  <p className="text-xs font-medium text-foreground truncate">{p.title}</p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                  <Clock className="h-3 w-3" />
                  <span className="text-[11px]">{p.time}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
};

export default Index;
