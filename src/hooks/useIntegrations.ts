import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

export type Platform = "telegram" | "whatsapp" | "instagram";

export interface IntegrationStatus {
  telegram: boolean;
  whatsapp: boolean;
  instagram: boolean;
}

export interface TelegramPayload {
  token: string;
  username?: string;
  name?: string;
  description?: string;
}

export interface WhatsappPayload {
  phone_number_id: string;
  access_token: string;
  business_account_id?: string;
}

export interface InstagramPayload {
  page_id: string;
  access_token: string;
}

export function useIntegrations() {
  const { toast } = useToast();

  const [statuses, setStatuses] = useState<IntegrationStatus>({
    telegram: false,
    whatsapp: false,
    instagram: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/integrations/status");
      setStatuses({
        telegram: !!data.telegram,
        whatsapp: !!data.whatsapp,
        instagram: !!data.instagram,
      });
    } catch (err) {
      console.error("Erro ao buscar status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const save = useCallback(
    async (platform: Platform, body: TelegramPayload | WhatsappPayload | InstagramPayload) => {
      setSaving(true);
      try {
        await apiFetch(`/integrations/${platform}`, {
          method: "POST",
          body: JSON.stringify(body),
        });

        if (platform === "telegram") {
          await apiFetch("/integrations/telegram/start", { method: "POST" });
        }

        setStatuses((prev) => ({ ...prev, [platform]: true }));
        toast({ title: "Integração salva", description: `${platform.toUpperCase()} configurado com sucesso.` });
        return true;
      } catch (err: any) {
        toast({ title: "Erro", description: err.message || "Falha ao salvar integração", variant: "destructive" });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [toast],
  );

  const disconnect = useCallback(
    async (platform: Platform) => {
      setDisconnecting(true);
      try {
        await apiFetch(`/integrations/${platform}`, { method: "DELETE" });
        setStatuses((prev) => ({ ...prev, [platform]: false }));
        toast({ title: "Desconectado", description: `${platform.toUpperCase()} removido com sucesso.` });
        return true;
      } catch (err: any) {
        toast({ title: "Erro", description: err.message || "Falha ao desconectar", variant: "destructive" });
        return false;
      } finally {
        setDisconnecting(false);
      }
    },
    [toast],
  );

  return { statuses, loading, saving, disconnecting, save, disconnect, refetch: fetchStatuses };
}
