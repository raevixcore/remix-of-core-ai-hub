import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIEngineProvider } from "@/context/AIEngineContext";
import { I18nProvider } from "@/i18n/I18nContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OnboardingProvider, OnboardingTour } from "@/components/Onboarding";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Conversations from "./pages/Conversations";
import Approvals from "./pages/Approvals";
import Content from "./pages/Content";
import Calendar from "./pages/Calendar";
import Profiles from "./pages/Profiles";
import Subscription from "./pages/Subscription";
import Statistics from "./pages/Statistics";
import SocialMediaStats from "./pages/SocialMediaStats";
import SettingsPage from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";
import TeamManagement from "./pages/TeamManagement";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import SupportPage from "./pages/Support";
import LogsPage from "./pages/Logs";
import NotificationsPage from "./pages/Notifications";
import ProfilePage from "./pages/Profile";
import CRMPage from "./pages/CRM";
import MarketingPage from "./pages/Marketing";
import KnowledgeBasePage from "./pages/KnowledgeBase";
import AnalyticsProPage from "./pages/AnalyticsPro";
import AutomationsPage from "./pages/Automations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nProvider>
        <AIEngineProvider>
          <OnboardingProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <OnboardingTour />
              <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
                <Route path="/conversations" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
                <Route path="/approvals" element={<ProtectedRoute requiredRole="admin"><Approvals /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="/profiles" element={<ProtectedRoute requiredRole="admin"><Profiles /></ProtectedRoute>} />
                <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
                <Route path="/social-stats" element={<ProtectedRoute><SocialMediaStats /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute requiredRole="admin"><Subscription /></ProtectedRoute>} />
                <Route path="/team" element={<ProtectedRoute requiredRole="admin"><TeamManagement /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><SettingsPage /></ProtectedRoute>} />
                <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
                <Route path="/logs" element={<ProtectedRoute requiredRole="admin"><LogsPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
                <Route path="/marketing" element={<ProtectedRoute><MarketingPage /></ProtectedRoute>} />
                <Route path="/knowledge-base" element={<ProtectedRoute><KnowledgeBasePage /></ProtectedRoute>} />
                <Route path="/analytics-pro" element={<ProtectedRoute><AnalyticsProPage /></ProtectedRoute>} />
                <Route path="/automations" element={<ProtectedRoute><AutomationsPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
          </OnboardingProvider>
        </AIEngineProvider>
      </I18nProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
