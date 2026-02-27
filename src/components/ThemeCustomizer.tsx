import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type ThemePreset = "blue" | "violet" | "emerald" | "rose" | "amber" | "cyan";

interface PresetConfig {
  label: string;
  color: string; // preview swatch
  light: Record<string, string>;
  dark: Record<string, string>;
}

const presets: Record<ThemePreset, PresetConfig> = {
  blue: {
    label: "Azul",
    color: "hsl(220,80%,56%)",
    light: { "--primary": "220 80% 56%", "--ring": "220 80% 56%", "--glow-primary": "220 80% 56%", "--sidebar-primary": "220 80% 56%", "--sidebar-ring": "220 80% 56%" },
    dark: { "--primary": "220 80% 60%", "--ring": "220 80% 60%", "--glow-primary": "220 80% 60%", "--sidebar-primary": "220 80% 60%", "--sidebar-ring": "220 80% 60%" },
  },
  violet: {
    label: "Violeta",
    color: "hsl(263,70%,58%)",
    light: { "--primary": "263 70% 58%", "--ring": "263 70% 58%", "--glow-primary": "263 70% 58%", "--sidebar-primary": "263 70% 58%", "--sidebar-ring": "263 70% 58%" },
    dark: { "--primary": "263 70% 62%", "--ring": "263 70% 62%", "--glow-primary": "263 70% 62%", "--sidebar-primary": "263 70% 62%", "--sidebar-ring": "263 70% 62%" },
  },
  emerald: {
    label: "Esmeralda",
    color: "hsl(160,84%,39%)",
    light: { "--primary": "160 84% 39%", "--ring": "160 84% 39%", "--glow-primary": "160 84% 39%", "--sidebar-primary": "160 84% 39%", "--sidebar-ring": "160 84% 39%" },
    dark: { "--primary": "160 84% 45%", "--ring": "160 84% 45%", "--glow-primary": "160 84% 45%", "--sidebar-primary": "160 84% 45%", "--sidebar-ring": "160 84% 45%" },
  },
  rose: {
    label: "Rosa",
    color: "hsl(347,77%,50%)",
    light: { "--primary": "347 77% 50%", "--ring": "347 77% 50%", "--glow-primary": "347 77% 50%", "--sidebar-primary": "347 77% 50%", "--sidebar-ring": "347 77% 50%" },
    dark: { "--primary": "347 77% 55%", "--ring": "347 77% 55%", "--glow-primary": "347 77% 55%", "--sidebar-primary": "347 77% 55%", "--sidebar-ring": "347 77% 55%" },
  },
  amber: {
    label: "Âmbar",
    color: "hsl(38,92%,50%)",
    light: { "--primary": "38 92% 50%", "--ring": "38 92% 50%", "--glow-primary": "38 92% 50%", "--sidebar-primary": "38 92% 50%", "--sidebar-ring": "38 92% 50%" },
    dark: { "--primary": "38 92% 55%", "--ring": "38 92% 55%", "--glow-primary": "38 92% 55%", "--sidebar-primary": "38 92% 55%", "--sidebar-ring": "38 92% 55%" },
  },
  cyan: {
    label: "Ciano",
    color: "hsl(199,89%,48%)",
    light: { "--primary": "199 89% 48%", "--ring": "199 89% 48%", "--glow-primary": "199 89% 48%", "--sidebar-primary": "199 89% 48%", "--sidebar-ring": "199 89% 48%" },
    dark: { "--primary": "199 89% 52%", "--ring": "199 89% 52%", "--glow-primary": "199 89% 52%", "--sidebar-primary": "199 89% 52%", "--sidebar-ring": "199 89% 52%" },
  },
};

function getStoredPreset(): ThemePreset {
  try {
    const s = localStorage.getItem("theme-preset");
    if (s && s in presets) return s as ThemePreset;
  } catch {}
  return "blue";
}

function applyPreset(preset: ThemePreset) {
  const isDark = document.documentElement.classList.contains("dark");
  const vars = isDark ? presets[preset].dark : presets[preset].light;
  Object.entries(vars).forEach(([key, val]) => {
    document.documentElement.style.setProperty(key, val);
  });
}

export function useThemePreset() {
  const [preset, setPresetState] = useState<ThemePreset>(getStoredPreset);

  useEffect(() => {
    applyPreset(preset);
  }, [preset]);

  // Re-apply when dark/light toggles
  useEffect(() => {
    const observer = new MutationObserver(() => {
      applyPreset(getStoredPreset());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const setPreset = (p: ThemePreset) => {
    localStorage.setItem("theme-preset", p);
    setPresetState(p);
  };

  return { preset, setPreset };
}

export function ThemeCustomizer() {
  const { preset, setPreset } = useThemePreset();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 p-3">
        <p className="text-xs font-semibold text-foreground mb-2">Tema de Cor</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(presets) as [ThemePreset, PresetConfig][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors hover:bg-accent",
                preset === key && "ring-2 ring-primary bg-primary/5"
              )}
            >
              <div
                className="h-6 w-6 rounded-full border-2 border-border relative"
                style={{ backgroundColor: cfg.color }}
              >
                {preset === key && (
                  <Check className="h-3 w-3 text-white absolute inset-0 m-auto" />
                )}
              </div>
              <span className="text-[9px] text-muted-foreground">{cfg.label}</span>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
