import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarDays, Plus, ChevronLeft, ChevronRight, Clock, User,
  CheckCircle2, AlertCircle, Circle, Trash2, Star, Lightbulb,
} from "lucide-react";
import { getSeasonalDateForDay, getSeasonalDatesForMonth, typeConfig, type SeasonalDate } from "@/data/brazilianDates";

/* ─── Types ─── */
type TaskStatus = "todo" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";

interface CalendarTask {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  platform?: string;
}

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: typeof Circle }> = {
  todo: { label: "A Fazer", color: "text-muted-foreground", icon: Circle },
  in_progress: { label: "Em Andamento", color: "text-warning", icon: Clock },
  done: { label: "Concluído", color: "text-success", icon: CheckCircle2 },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Baixa", color: "text-muted-foreground" },
  medium: { label: "Média", color: "text-warning" },
  high: { label: "Alta", color: "text-destructive" },
};

const teamMembers = ["João Silva", "Ana Costa", "Pedro Santos", "Maria Oliveira"];

const initialTasks: CalendarTask[] = [
  { id: 1, title: "Publicar IG Story", date: "2024-01-15", time: "10:00", assignee: "Ana Costa", status: "done", priority: "medium", platform: "Instagram" },
  { id: 2, title: "Thread no X", date: "2024-01-17", time: "09:00", assignee: "João Silva", status: "in_progress", priority: "high", platform: "X" },
  { id: 3, title: "Broadcast Telegram", date: "2024-01-17", time: "15:00", assignee: "Pedro Santos", status: "todo", priority: "medium", platform: "Telegram" },
  { id: 4, title: "Gravar Reels", date: "2024-01-18", time: "14:00", assignee: "Ana Costa", status: "todo", priority: "high", platform: "Instagram" },
  { id: 5, title: "Enquete no X", date: "2024-01-19", time: "11:00", assignee: "Maria Oliveira", status: "todo", priority: "low", platform: "X" },
  { id: 6, title: "Responder DMs Instagram", date: "2024-01-15", time: "16:00", assignee: "Pedro Santos", status: "done", priority: "medium", platform: "Instagram" },
  { id: 7, title: "Newsletter semanal", date: "2024-01-19", time: "08:00", assignee: "João Silva", status: "todo", priority: "high" },
  { id: 8, title: "Análise de métricas", date: "2024-01-16", time: "10:00", assignee: "Ana Costa", status: "in_progress", priority: "medium" },
  { id: 9, title: "Planejamento mensal", date: "2024-01-22", time: "09:00", assignee: "João Silva", status: "todo", priority: "high" },
  { id: 10, title: "Post LinkedIn", date: "2024-01-23", time: "12:00", assignee: "Maria Oliveira", status: "todo", priority: "low" },
];

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.3 } }),
};

const platformColor = (p?: string) => {
  if (p === "Instagram") return "bg-primary/10 border-primary/20 text-primary";
  if (p === "X") return "bg-info/10 border-info/20 text-info";
  if (p === "Telegram") return "bg-warning/10 border-warning/20 text-warning";
  return "bg-accent border-border text-foreground";
};

const Calendar = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<CalendarTask[]>(initialTasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
  const [selectedSeasonal, setSelectedSeasonal] = useState<(SeasonalDate & { fullDate: string }) | null>(null);
  const [form, setForm] = useState({ title: "", date: "", time: "09:00", assignee: teamMembers[0], priority: "medium" as TaskPriority, platform: "" });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const seasonalThisMonth = getSeasonalDatesForMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDate = (dateStr: string) => tasks.filter((t) => t.date === dateStr);

  const formatDate = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const handleCreate = () => {
    if (!form.title.trim() || !form.date) return;
    const newTask: CalendarTask = {
      id: Date.now(), title: form.title, date: form.date, time: form.time,
      assignee: form.assignee, status: "todo", priority: form.priority,
      platform: form.platform || undefined,
    };
    setTasks((prev) => [...prev, newTask]);
    setCreateOpen(false);
    setForm({ title: "", date: "", time: "09:00", assignee: teamMembers[0], priority: "medium", platform: "" });
    toast({ title: "Tarefa criada!", description: `${newTask.title} — ${newTask.date}` });
  };

  const handleStatusChange = (task: CalendarTask, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: newStatus } : t));
    setSelectedTask(task.id === selectedTask?.id ? { ...task, status: newStatus } : selectedTask);
    toast({ title: "Status atualizado!", description: `${task.title} → ${statusConfig[newStatus].label}` });
  };

  const handleDelete = (task: CalendarTask) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setSelectedTask(null);
    toast({ title: "Removida", description: `${task.title} foi removida.` });
  };

  const openCreateForDate = (dateStr: string) => {
    setForm({ ...form, date: dateStr });
    setCreateOpen(true);
  };

  // Stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  // Week view data
  const weekStart = new Date(currentDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const weekHours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Calendário</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie tarefas, atribuições e agendamentos.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => { setForm({ title: "", date: formatDate(currentDate.getDate()), time: "09:00", assignee: teamMembers[0], priority: "medium", platform: "" }); setCreateOpen(true); }}>
          <Plus className="h-3.5 w-3.5" /> Nova Tarefa
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: CalendarDays },
          { label: "A Fazer", value: stats.todo, icon: Circle },
          { label: "Em Andamento", value: stats.inProgress, icon: Clock },
          { label: "Concluídas", value: stats.done, icon: CheckCircle2 },
        ].map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seasonal dates for this month */}
      {seasonalThisMonth.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 rounded-xl border border-border bg-card p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-warning" /> Datas Sazonais — {MONTHS[month]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {seasonalThisMonth.map((sd) => (
              <button
                key={sd.name}
                onClick={() => setSelectedSeasonal(sd)}
                className={cn("rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors hover:scale-105", typeConfig[sd.type].color)}
              >
                {sd.emoji} {sd.name} <span className="opacity-60 ml-1">{sd.date.split("-")[1]}/{sd.date.split("-")[0]}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <Tabs defaultValue="month" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="h-9 bg-muted/50">
            <TabsTrigger value="month" className="text-xs">Mensal</TabsTrigger>
            <TabsTrigger value="week" className="text-xs">Semanal</TabsTrigger>
            <TabsTrigger value="list" className="text-xs">Lista</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold text-foreground min-w-[140px] text-center">
              {MONTHS[month]} {year}
            </span>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Month View */}
        <TabsContent value="month">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border">
              {DAYS.map((d) => (
                <div key={d} className="p-2 text-center text-[11px] font-semibold text-muted-foreground">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="border-b border-r border-border/50 min-h-[80px] bg-muted/10" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = formatDate(day);
                const dayTasks = getTasksForDate(dateStr);
                const isToday = dateStr === todayStr;
                const seasonalDates = getSeasonalDateForDay(year, month, day);

                return (
                  <div key={day}
                    className={cn("border-b border-r border-border/50 min-h-[80px] p-1 cursor-pointer hover:bg-accent/20 transition-colors",
                      isToday && "bg-primary/5",
                      seasonalDates.length > 0 && "bg-warning/5")}
                    onClick={() => dayTasks.length > 0 ? setSelectedDate(dateStr) : seasonalDates.length > 0 ? setSelectedSeasonal(seasonalDates[0]) : openCreateForDate(dateStr)}
                  >
                    <div className="flex items-center justify-between px-1 mb-0.5">
                      <span className={cn("text-[10px] font-medium",
                        isToday ? "text-primary font-bold" : "text-foreground"
                      )}>{day}</span>
                      {seasonalDates.length > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-[10px] cursor-help">{seasonalDates[0].emoji}</span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs max-w-[200px]">
                              <p className="font-semibold">{seasonalDates[0].name}</p>
                              {seasonalDates[0].tip && <p className="text-muted-foreground mt-0.5">{seasonalDates[0].tip}</p>}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {seasonalDates.map((sd) => (
                      <div key={sd.name} className={cn("text-[7px] px-1 py-0.5 rounded mb-0.5 truncate border font-medium", typeConfig[sd.type].color)}>
                        {sd.emoji} {sd.name}
                      </div>
                    ))}
                    {dayTasks.slice(0, seasonalDates.length > 0 ? 1 : 2).map((t) => (
                      <div key={t.id} className={cn("text-[8px] px-1 py-0.5 rounded mb-0.5 truncate border", platformColor(t.platform))}>
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > (seasonalDates.length > 0 ? 1 : 2) && (
                      <span className="text-[8px] text-muted-foreground px-1">+{dayTasks.length - (seasonalDates.length > 0 ? 1 : 2)} mais</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Week View */}
        <TabsContent value="week">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
              <div className="p-2" />
              {weekDays.map((d) => (
                <div key={d.toISOString()} className="p-2 text-center text-[11px] font-semibold text-foreground border-l border-border">
                  <span className="block text-muted-foreground">{DAYS[d.getDay()]}</span>
                  <span>{d.getDate()}</span>
                </div>
              ))}
            </div>
            {weekHours.map((hour) => (
              <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/50 last:border-b-0">
                <div className="p-2 text-[10px] text-muted-foreground text-right pr-3">{hour}</div>
                {weekDays.map((d) => {
                  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                  const ev = tasks.find((t) => t.date === dateStr && t.time === hour);
                  return (
                    <div key={dateStr} className="p-0.5 border-l border-border/50 min-h-[36px] flex items-center">
                      {ev && (
                        <Badge variant="outline" className={cn("text-[8px] px-1.5 py-0.5 w-full justify-center cursor-pointer", platformColor(ev.platform))}
                          onClick={() => setSelectedTask(ev)}>
                          {ev.title}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tarefa</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Responsável</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Prioridade</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tasks.sort((a, b) => a.date.localeCompare(b.date)).map((task, i) => {
                  const sc = statusConfig[task.status];
                  const pc = priorityConfig[task.priority];
                  return (
                    <motion.tr key={task.id} initial="hidden" animate="visible" variants={fadeUp} custom={i}
                      className="border-b border-border/50 hover:bg-accent/20 transition-colors"
                    >
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          {task.platform && <Badge variant="outline" className={cn("text-[8px]", platformColor(task.platform))}>{task.platform}</Badge>}
                          <span className="font-medium text-foreground">{task.title}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground">{task.date} {task.time}</td>
                      <td className="py-2.5 px-4">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <User className="h-3 w-3 text-muted-foreground" /> {task.assignee}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <Select value={task.status} onValueChange={(v) => handleStatusChange(task, v as TaskStatus)}>
                          <SelectTrigger className="h-7 w-[130px] text-[10px] border-none bg-transparent p-0">
                            <Badge variant="outline" className={cn("text-[10px] gap-0.5", sc.color)}>
                              <sc.icon className="h-2.5 w-2.5" /> {sc.label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.entries(statusConfig) as [TaskStatus, typeof statusConfig.todo][]).map(([key, s]) => (
                              <SelectItem key={key} value={key} className="text-xs">{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2.5 px-4">
                        <Badge variant="outline" className={cn("text-[10px]", pc.color)}>{pc.label}</Badge>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(task)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Nova Tarefa</DialogTitle>
            <DialogDescription>Crie uma nova tarefa e atribua a um membro.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Título *</Label>
              <Input placeholder="Ex: Publicar post no Instagram" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Data *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Horário</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Responsável</Label>
                <Select value={form.assignee} onValueChange={(v) => setForm({ ...form, assignee: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Prioridade</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TaskPriority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Plataforma (opcional)</Label>
              <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="X">X (Twitter)</SelectItem>
                  <SelectItem value="Telegram">Telegram</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button disabled={!form.title.trim() || !form.date} onClick={handleCreate}>Criar Tarefa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Tasks Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> Tarefas — {selectedDate}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {selectedDate && getTasksForDate(selectedDate).map((task) => {
              const sc = statusConfig[task.status];
              return (
                <div key={task.id} className="rounded-lg border border-border p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground">{task.title}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <Clock className="h-2.5 w-2.5" /> {task.time}
                      <User className="h-2.5 w-2.5" /> {task.assignee}
                    </p>
                  </div>
                  <Select value={task.status} onValueChange={(v) => handleStatusChange(task, v as TaskStatus)}>
                    <SelectTrigger className="h-7 w-[120px] text-[10px]">
                      <Badge variant="outline" className={cn("text-[10px] gap-0.5", sc.color)}>
                        <sc.icon className="h-2.5 w-2.5" /> {sc.label}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(statusConfig) as [TaskStatus, typeof statusConfig.todo][]).map(([key, s]) => (
                        <SelectItem key={key} value={key} className="text-xs">{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => { setSelectedDate(null); openCreateForDate(selectedDate!); }}>
              <Plus className="h-3.5 w-3.5" /> Adicionar Tarefa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">{selectedTask?.title}</DialogTitle>
            <DialogDescription className="text-[10px]">
              {selectedTask?.date} às {selectedTask?.time} · {selectedTask?.assignee}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-3">
                <Label className="text-xs w-20">Status</Label>
                <Select value={selectedTask.status} onValueChange={(v) => handleStatusChange(selectedTask, v as TaskStatus)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.entries(statusConfig) as [TaskStatus, typeof statusConfig.todo][]).map(([key, s]) => (
                      <SelectItem key={key} value={key} className="text-xs">{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedTask.platform && (
                <div className="flex items-center gap-3">
                  <Label className="text-xs w-20">Plataforma</Label>
                  <Badge variant="outline" className={cn("text-[10px]", platformColor(selectedTask.platform))}>{selectedTask.platform}</Badge>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Label className="text-xs w-20">Prioridade</Label>
                <Badge variant="outline" className={cn("text-[10px]", priorityConfig[selectedTask.priority].color)}>
                  {priorityConfig[selectedTask.priority].label}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-destructive gap-1.5 text-xs" onClick={() => selectedTask && handleDelete(selectedTask)}>
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Seasonal Date Detail Dialog */}
      <Dialog open={!!selectedSeasonal} onOpenChange={(open) => !open && setSelectedSeasonal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <span className="text-xl">{selectedSeasonal?.emoji}</span> {selectedSeasonal?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedSeasonal && (
                <Badge variant="outline" className={cn("text-[10px] mt-1", typeConfig[selectedSeasonal.type].color)}>
                  {typeConfig[selectedSeasonal.type].label}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedSeasonal?.tip && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs font-medium text-primary mb-1 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Dica de Marketing
              </p>
              <p className="text-xs text-foreground">{selectedSeasonal.tip}</p>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => {
              if (selectedSeasonal) {
                setSelectedSeasonal(null);
                openCreateForDate(selectedSeasonal.fullDate);
              }
            }}>
              <Plus className="h-3.5 w-3.5" /> Criar Tarefa para esta data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Calendar;
