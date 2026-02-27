import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FunnelKPIs } from "@/components/marketing/FunnelKPIs";
import { StrategyTools } from "@/components/marketing/StrategyTools";
import { ContentGrowth } from "@/components/marketing/ContentGrowth";
import { AutomationLeads } from "@/components/marketing/AutomationLeads";
import {
  BarChart3, Brain, PenTool, Zap, Megaphone,
} from "lucide-react";

const MarketingPage = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" /> Hub de Marketing
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ferramentas completas de marketing: funil, SWOT, SEO, automações e mais.
        </p>
      </motion.div>

      <Tabs defaultValue="funnel" className="w-full">
        <TabsList className="h-9 mb-6 bg-muted/50 flex-wrap">
          <TabsTrigger value="funnel" className="text-xs gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" /> Funil & KPIs
          </TabsTrigger>
          <TabsTrigger value="strategy" className="text-xs gap-1.5">
            <Brain className="h-3.5 w-3.5" /> Estratégia
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs gap-1.5">
            <PenTool className="h-3.5 w-3.5" /> Conteúdo & Growth
          </TabsTrigger>
          <TabsTrigger value="automation" className="text-xs gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Automação & Leads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funnel"><FunnelKPIs /></TabsContent>
        <TabsContent value="strategy"><StrategyTools /></TabsContent>
        <TabsContent value="content"><ContentGrowth /></TabsContent>
        <TabsContent value="automation"><AutomationLeads /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MarketingPage;
