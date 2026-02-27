export interface SeasonalDate {
  name: string;
  date: string; // MM-DD format (fixed dates) or special key for movable dates
  type: "feriado" | "comemorativa" | "marketing";
  emoji: string;
  tip?: string; // marketing tip
}

// Fixed Brazilian dates (recurring yearly)
export const fixedSeasonalDates: SeasonalDate[] = [
  // Feriados nacionais
  { name: "Ano Novo", date: "01-01", type: "feriado", emoji: "🎆", tip: "Posts de retrospectiva e metas do novo ano" },
  { name: "Tiradentes", date: "04-21", type: "feriado", emoji: "🇧🇷" },
  { name: "Dia do Trabalho", date: "05-01", type: "feriado", emoji: "💼", tip: "Homenageie sua equipe e clientes trabalhadores" },
  { name: "Independência", date: "09-07", type: "feriado", emoji: "🇧🇷", tip: "Conteúdo patriótico e promoções especiais" },
  { name: "N. Sra. Aparecida", date: "10-12", type: "feriado", emoji: "🙏" },
  { name: "Finados", date: "11-02", type: "feriado", emoji: "🕯️" },
  { name: "Proclamação da República", date: "11-15", type: "feriado", emoji: "🇧🇷" },
  { name: "Natal", date: "12-25", type: "feriado", emoji: "🎄", tip: "Campanhas de fim de ano e agradecimento" },

  // Datas comemorativas e de marketing
  { name: "Dia da Mulher", date: "03-08", type: "comemorativa", emoji: "💜", tip: "Empoderamento feminino — posts engajam muito" },
  { name: "Dia do Consumidor", date: "03-15", type: "marketing", emoji: "🛍️", tip: "\"Black Friday do 1º semestre\" — promoções agressivas" },
  { name: "Páscoa", date: "03-30", type: "comemorativa", emoji: "🐣", tip: "Conteúdo criativo com chocolate e renovação" },
  { name: "Dia das Mães", date: "05-11", type: "marketing", emoji: "💐", tip: "2ª maior data do varejo — campanha obrigatória" },
  { name: "Dia dos Namorados", date: "06-12", type: "marketing", emoji: "❤️", tip: "Campanhas de casal e presentes" },
  { name: "Festa Junina", date: "06-24", type: "comemorativa", emoji: "🎪", tip: "Posts temáticos com bandeirinhas e comidas típicas" },
  { name: "Dia dos Pais", date: "08-10", type: "marketing", emoji: "👨‍👧", tip: "Campanhas de presente e homenagem" },
  { name: "Dia do Cliente", date: "09-15", type: "marketing", emoji: "🤝", tip: "Promoções exclusivas e agradecimento ao cliente" },
  { name: "Dia das Crianças", date: "10-12", type: "marketing", emoji: "🧸", tip: "Conteúdo lúdico e promoções infantis" },
  { name: "Halloween", date: "10-31", type: "comemorativa", emoji: "🎃", tip: "Conteúdo divertido e temático" },
  { name: "Black Friday", date: "11-28", type: "marketing", emoji: "🏷️", tip: "Maior data de vendas — preparação com 2 semanas" },
  { name: "Cyber Monday", date: "12-01", type: "marketing", emoji: "💻", tip: "Extensão da Black Friday para e-commerce" },
  { name: "Dia do Ecommerce", date: "01-28", type: "marketing", emoji: "📦", tip: "Promoções e descontos para loja virtual" },
  { name: "Carnaval", date: "03-04", type: "comemorativa", emoji: "🎭", tip: "Conteúdo festivo e criativo — alto engajamento" },
  { name: "Dia do Orgulho", date: "06-28", type: "comemorativa", emoji: "🏳️‍🌈", tip: "Inclusão e diversidade — posicionamento de marca" },
];

/**
 * Get seasonal dates for a specific month/year
 * Returns dates formatted as YYYY-MM-DD for matching
 */
export function getSeasonalDatesForMonth(year: number, month: number): (SeasonalDate & { fullDate: string })[] {
  const monthStr = String(month + 1).padStart(2, "0");
  return fixedSeasonalDates
    .filter((d) => d.date.startsWith(monthStr))
    .map((d) => ({
      ...d,
      fullDate: `${year}-${d.date}`,
    }));
}

export function getSeasonalDateForDay(year: number, month: number, day: number): (SeasonalDate & { fullDate: string })[] {
  const dateStr = `${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return fixedSeasonalDates
    .filter((d) => d.date === dateStr)
    .map((d) => ({
      ...d,
      fullDate: `${year}-${d.date}`,
    }));
}

export const typeConfig = {
  feriado: { label: "Feriado", color: "bg-destructive/10 text-destructive border-destructive/20" },
  comemorativa: { label: "Comemorativa", color: "bg-warning/10 text-warning border-warning/20" },
  marketing: { label: "Marketing", color: "bg-success/10 text-success border-success/20" },
};
