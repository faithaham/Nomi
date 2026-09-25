import { Download, ChevronLeft, ChevronRight, Clock, Utensils, Plus, X, Search, Camera, Mic, ArrowLeft, CalendarDays, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import PortionSelector from "@/components/PortionSelector";

type LoggedMeal = {
  type: string;
  time: string;
  items: string[];
  note?: string;
};

type PlannedMeal = {
  type: string;
  time: string;
  items: string[];
};

const MEAL_TYPES = [
  "Breakfast",
  "Morning Snack",
  "Lunch",
  "Afternoon Snack",
  "Dinner",
  "Evening Snack",
  "Drink",
] as const;

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Mock historical food diary entries keyed by day-of-month
const mockHistory: Record<number, LoggedMeal[]> = {
  1: [
    { type: "Breakfast", time: "07:45", items: ["Porridge", "Banana", "Whole milk"] },
    { type: "Lunch", time: "12:30", items: ["Chicken sandwich", "Crisps", "Apple juice"] },
    { type: "Dinner", time: "18:15", items: ["Salmon pasta bake", "Broccoli"] },
    { type: "Evening Snack", time: "20:30", items: ["Greek yogurt", "Honey"] },
  ],
  2: [
    { type: "Breakfast", time: "08:10", items: ["Croissant", "Orange juice"] },
    { type: "Lunch", time: "13:00", items: ["Jacket potato", "Cheese", "Beans"] },
    { type: "Dinner", time: "19:00", items: ["Beef stir fry", "Rice"] },
  ],
  3: [
    { type: "Breakfast", time: "07:30", items: ["Toast", "Peanut butter", "Tea"] },
    { type: "Morning Snack", time: "10:30", items: ["Cereal bar"] },
    { type: "Lunch", time: "12:45", items: ["Tuna pasta salad"] },
    { type: "Dinner", time: "18:30", items: ["Roast chicken", "Mashed potato", "Carrots"] },
  ],
  4: [
    { type: "Breakfast", time: "08:00", items: ["Smoothie", "Toast"] },
    { type: "Lunch", time: "12:15", items: ["Soup", "Bread roll"] },
  ],
  5: [
    { type: "Breakfast", time: "07:50", items: ["Pancakes", "Berries", "Maple syrup"] },
    { type: "Lunch", time: "13:15", items: ["Chicken wrap", "Side salad"] },
    { type: "Afternoon Snack", time: "15:30", items: ["Trail mix"] },
    { type: "Dinner", time: "19:30", items: ["Lasagne", "Garlic bread"] },
  ],
  8: [
    { type: "Breakfast", time: "08:15", items: ["Eggs on toast", "Avocado"] },
    { type: "Lunch", time: "12:30", items: ["Chicken Caesar salad"] },
    { type: "Dinner", time: "18:45", items: ["Cottage pie", "Peas"] },
  ],
  9: [
    { type: "Breakfast", time: "07:40", items: ["Overnight oats", "Berries"] },
    { type: "Lunch", time: "13:00", items: ["Quiche", "Coleslaw"] },
    { type: "Dinner", time: "19:00", items: ["Fish and chips", "Mushy peas"] },
  ],
  10: [
    { type: "Breakfast", time: "08:00", items: ["Bagel", "Cream cheese", "Smoked salmon"] },
    { type: "Lunch", time: "12:30", items: ["Chicken noodle soup"] },
  ],
  11: [
    { type: "Breakfast", time: "07:55", items: ["Yogurt", "Granola", "Honey"] },
    { type: "Lunch", time: "13:00", items: ["Sushi", "Miso soup"] },
    { type: "Dinner", time: "18:30", items: ["Stuffed peppers", "Rice"] },
    { type: "Evening Snack", time: "21:00", items: ["Hot chocolate", "Biscuits"] },
  ],
  12: [
    { type: "Breakfast", time: "08:30", items: ["Full English breakfast"] },
    { type: "Lunch", time: "13:30", items: ["Ham sandwich", "Yogurt"] },
    { type: "Dinner", time: "19:15", items: ["Pizza", "Salad"] },
  ],
};

interface CalendarScreenProps {
  onNavigateToLog?: () => void;
}

const CalendarScreen = ({ onNavigateToLog }: CalendarScreenProps = {}) => {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [showExport, setShowExport] = useState(false);
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [plans, setPlans] = useState<Record<string, PlannedMeal[]>>({});
  // Retrospective logs added by the patient for past days
  const [retroLogs, setRetroLogs] = useState<Record<string, LoggedMeal[]>>({});
  const [retroOpen, setRetroOpen] = useState(false);

  // Planning form state
  const [mealType, setMealType] = useState<string>("Lunch");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [time, setTime] = useState("12:30");
  const [portion, setPortion] = useState(1);

  const monthLabel = viewMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

  const isCurrentMonth =
    viewMonth.getMonth() === today.getMonth() && viewMonth.getFullYear() === today.getFullYear();
  const todayDate = today.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dayKey = (day: number) =>
    `${viewMonth.getFullYear()}-${viewMonth.getMonth() + 1}-${day}`;

  const getDayState = (day: number): "past" | "today" | "future" => {
    if (!isCurrentMonth) {
      const cellDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
      if (cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return "past";
      if (cellDate.getTime() === new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) return "today";
      return "future";
    }
    if (day < todayDate) return "past";
    if (day === todayDate) return "today";
    return "future";
  };

  const hasContent = (day: number) => {
    const state = getDayState(day);
    if (state === "past" || state === "today") return mockHistory[day] && mockHistory[day].length > 0;
    return (plans[dayKey(day)] || []).length > 0;
  };

  const goPrevMonth = () =>
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const goNextMonth = () =>
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

  const openDay = (day: number) => {
    if (getDayState(day) === "today" && onNavigateToLog) {
      onNavigateToLog();
      return;
    }
    setSelectedDay(day);
    // reset planner
    setMealType("Lunch");
    setSearch("");
    setItems([]);
    setTime("12:30");
    setPortion(1);
    setRetroOpen(false);
  };

  const closeDay = () => setSelectedDay(null);

  const addItem = () => {
    const v = search.trim();
    if (!v) return;
    setItems((p) => [...p, v]);
    setSearch("");
  };

  const removeItem = (i: number) =>
    setItems((p) => p.filter((_, idx) => idx !== i));

  const savePlan = () => {
    if (selectedDay === null || items.length === 0) return;
    const k = dayKey(selectedDay);
    setPlans((prev) => ({
      ...prev,
      [k]: [...(prev[k] || []), { type: mealType, time, items: [...items] }],
    }));
    setSearch("");
    setItems([]);
  };

  const removePlan = (idx: number) => {
    if (selectedDay === null) return;
    const k = dayKey(selectedDay);
    setPlans((prev) => ({
      ...prev,
      [k]: (prev[k] || []).filter((_, i) => i !== idx),
    }));
  };

  const saveRetroLog = () => {
    if (selectedDay === null || items.length === 0) return;
    const k = dayKey(selectedDay);
    setRetroLogs((prev) => ({
      ...prev,
      [k]: [...(prev[k] || []), { type: mealType, time, items: [...items] }],
    }));
    setSearch("");
    setItems([]);
    setRetroOpen(false);
  };

  const removeRetroLog = (idx: number) => {
    if (selectedDay === null) return;
    const k = dayKey(selectedDay);
    setRetroLogs((prev) => ({
      ...prev,
      [k]: (prev[k] || []).filter((_, i) => i !== idx),
    }));
  };

  const selectedDate = useMemo(() => {
    if (selectedDay === null) return null;
    return new Date(viewMonth.getFullYear(), viewMonth.getMonth(), selectedDay);
  }, [selectedDay, viewMonth]);

  const selectedState = selectedDay !== null ? getDayState(selectedDay) : null;
  const selectedHistory = useMemo(() => {
    if (selectedDay === null) return [] as LoggedMeal[];
    const base = mockHistory[selectedDay] || [];
    const retro = retroLogs[dayKey(selectedDay)] || [];
    return [...base, ...retro];
  }, [selectedDay, retroLogs, viewMonth]);
  const selectedPlans = selectedDay !== null ? plans[dayKey(selectedDay)] || [] : [];

  // Group meals into the 5 daily sections
  const SECTION_DEFS: { key: string; label: string; types: string[] }[] = [
    { key: "breakfast", label: "Breakfast", types: ["Breakfast"] },
    { key: "lunch", label: "Lunch", types: ["Lunch"] },
    { key: "dinner", label: "Dinner", types: ["Dinner"] },
    { key: "snacks", label: "Snacks", types: ["Morning Snack", "Afternoon Snack", "Evening Snack", "Snack"] },
    { key: "drinks", label: "Drinks", types: ["Drink"] },
  ];

  const groupedHistory = useMemo(() => {
    return SECTION_DEFS.map((s) => ({
      ...s,
      meals: selectedHistory.filter((m) => s.types.includes(m.type)),
    }));
  }, [selectedHistory]);

  const exportPdf = () => {
    const from = new Date(exportFrom);
    const to = new Date(exportTo);
    if (from > to) return;
    let rows = "";
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const meals = mockHistory[d.getDate()] || [];
      const label = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
      if (meals.length === 0) {
        rows += `<tr><td>${label}</td><td colspan="3" style="color:#888">No entries</td></tr>`;
      } else {
        meals.forEach((m, i) => {
          rows += `<tr><td>${i === 0 ? label : ""}</td><td>${m.type}</td><td>${m.time}</td><td>${m.items.join(", ")}</td></tr>`;
        });
      }
    }
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>NOMI Food Diary</title><style>body{font-family:'DM Sans',sans-serif;padding:24px;color:#1a1a1a}h1{margin:0 0 4px}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px}th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top}th{background:#eef8fc}</style></head><body><h1>NOMI Food Diary</h1><div>Sarah Johnson · ${from.toLocaleDateString("en-GB")} – ${to.toLocaleDateString("en-GB")}</div><table><thead><tr><th>Date</th><th>Meal</th><th>Time</th><th>Food</th></tr></thead><tbody>${rows}</tbody></table><p style="font-size:11px;color:#888;margin-top:16px">Generated by NOMI for review with your dietitian.</p></body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {selectedDay === null ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Calendar
                </h1>
                <Button size="sm" variant="outline" className="rounded-xl gap-1.5" onClick={() => setShowExport((v) => !v)}>
                  <Download className="w-4 h-4" /> Export
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Tap a past day to review your diary, or a future day to plan ahead
              </p>
              {showExport && (
                <div className="bg-card border border-border rounded-2xl p-4 mb-5 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Export food diary as PDF</p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs text-muted-foreground">From
                      <Input type="date" value={exportFrom} onChange={(e) => setExportFrom(e.target.value)} className="mt-1 h-10 rounded-xl" />
                    </label>
                    <label className="text-xs text-muted-foreground">To
                      <Input type="date" value={exportTo} onChange={(e) => setExportTo(e.target.value)} className="mt-1 h-10 rounded-xl" />
                    </label>
                  </div>
                  <Button className="w-full rounded-xl" onClick={exportPdf} disabled={!exportFrom || !exportTo}>
                    Download PDF
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goPrevMonth}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-secondary-foreground" />
              </button>
              <span className="font-semibold text-foreground">{monthLabel}</span>
              <button
                onClick={goNextMonth}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-secondary-foreground" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {daysOfWeek.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-medium text-muted-foreground py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Date cells */}
            <motion.div
              className="grid grid-cols-7 gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const state = getDayState(day);
                const filled = hasContent(day);

                return (
                  <button
                    key={day}
                    onClick={() => openDay(day)}
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative",
                      "hover:bg-secondary/60 hover:scale-105",
                      state === "today" && "ring-2 ring-primary font-bold text-primary bg-nomi-blue-soft",
                      state === "past" && "text-foreground",
                      state === "future" && "text-foreground/70",
                    )}
                  >
                    <span className="text-sm">{day}</span>
                    {filled && state !== "future" && (
                      <div className="w-1.5 h-1.5 rounded-full mt-0.5 bg-primary" />
                    )}
                    {filled && state === "future" && (
                      <div className="w-1.5 h-1.5 rounded-full mt-0.5 bg-rag-amber" />
                    )}
                  </button>
                );
              })}
            </motion.div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Logged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rag-amber" />
                <span className="text-xs text-muted-foreground">Planned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full ring-2 ring-primary" />
                <span className="text-xs text-muted-foreground">Today</span>
              </div>
            </div>

            {/* Helper cards */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl border border-border p-4">
                <CalendarDays className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm font-semibold text-foreground">Review</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tap a past day to see what you ate
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-4">
                <Sparkles className="w-5 h-5 text-rag-amber mb-2" />
                <p className="text-sm font-semibold text-foreground">Plan ahead</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tap a future day to plan a meal
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="day-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <button
              onClick={closeDay}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to calendar
            </button>

            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {selectedDate?.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h1>
              {selectedState === "today" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-nomi-blue-soft text-primary">
                  Today
                </span>
              )}
              {selectedState === "future" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-rag-amber/20 text-rag-amber">
                  Plan
                </span>
              )}
              {selectedState === "past" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  Review
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              {selectedState === "future"
                ? "Plan meals or recipes for this day"
                : "Your food diary for this day"}
            </p>

            {/* PAST / TODAY: review */}
            {(selectedState === "past" || selectedState === "today") && (
              <>
                {selectedHistory.length > 0 && (
                  <div className="bg-nomi-blue-soft rounded-2xl p-4 mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                      Day summary
                    </p>
                    <p className="text-sm text-foreground">
                      {selectedHistory.length} entr{selectedHistory.length === 1 ? "y" : "ies"} logged across the day.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {groupedHistory.map((section) => {
                    const retroKeyForDay = selectedDay !== null ? dayKey(selectedDay) : "";
                    const retroForDay = retroLogs[retroKeyForDay] || [];
                    return (
                      <div
                        key={section.key}
                        className="bg-card rounded-2xl border border-border p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-foreground">
                            {section.label}
                          </p>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {section.meals.length}{" "}
                            {section.meals.length === 1 ? "entry" : "entries"}
                          </span>
                        </div>
                        {section.meals.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">
                            No {section.label.toLowerCase()} logged
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {section.meals.map((meal, i) => {
                              const retroIdx = retroForDay.findIndex(
                                (r) =>
                                  r.type === meal.type &&
                                  r.time === meal.time &&
                                  r.items.join("|") === meal.items.join("|"),
                              );
                              return (
                                <div
                                  key={`${section.key}-${i}`}
                                  className="border-t border-border pt-2 first:border-t-0 first:pt-0"
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      {meal.time}
                                      <span className="text-foreground/60">
                                        · {meal.type}
                                      </span>
                                      {retroIdx !== -1 && (
                                        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-nomi-blue-soft text-primary">
                                          Added later
                                        </span>
                                      )}
                                    </span>
                                    {retroIdx !== -1 && (
                                      <button
                                        onClick={() => removeRetroLog(retroIdx)}
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {meal.items.map((item, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
                                      >
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Retrospective logging */}
                {selectedState === "past" && (
                  <div className="mt-5">
                    <Button
                      variant={retroOpen ? "secondary" : "outline"}
                      className="w-full h-11 rounded-xl gap-2"
                      onClick={() => setRetroOpen((o) => !o)}
                    >
                      {retroOpen ? (
                        <>
                          <X className="w-4 h-4" /> Cancel
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Log a missed meal
                        </>
                      )}
                    </Button>

                    <AnimatePresence initial={false}>
                      {retroOpen && (
                        <motion.div
                          key="retro"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-muted-foreground mt-3 mb-2">
                            Forgot to log something? Add it now — it'll be saved
                            to this day's diary.
                          </p>

                          <div className="mb-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                              Meal type
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {MEAL_TYPES.map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setMealType(t)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                    mealType === t
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                                  )}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="bg-card rounded-2xl border border-border p-4 mb-4">
                            <p className="text-sm font-medium text-foreground mb-3">
                              What did you have?
                            </p>
                            <div className="flex gap-2 mb-3">
                              <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                                  placeholder="Add a food item..."
                                  className="h-11 pl-10 rounded-xl bg-background border-border"
                                />
                              </div>
                              <Button onClick={addItem} className="h-11 px-4 rounded-xl">
                                Add
                              </Button>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-px flex-1 bg-border" />
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                or log with
                              </span>
                              <div className="h-px flex-1 bg-border" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <Button variant="outline" className="h-11 rounded-xl border-border gap-2">
                                <Camera className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Photo</span>
                              </Button>
                              <Button variant="outline" className="h-11 rounded-xl border-border gap-2">
                                <Mic className="w-4 h-4 text-destructive" />
                                <span className="text-sm font-medium">Voice</span>
                              </Button>
                            </div>

                            {items.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {items.map((item, i) => (
                                  <motion.span
                                    key={`${item}-${i}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nomi-blue-soft text-primary text-sm font-medium"
                                  >
                                    {item}
                                    <button
                                      onClick={() => removeItem(i)}
                                      className="hover:text-destructive transition-colors"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </motion.span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="bg-card rounded-2xl border border-border p-4 mb-4 space-y-5">
                            <div>
                              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                What time did you have this?
                              </label>
                              <Input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="h-10 rounded-xl bg-background border-border w-36"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                How much did you finish?
                              </label>
                              <PortionSelector value={portion} onChange={setPortion} />
                            </div>
                          </div>

                          <Button
                            onClick={saveRetroLog}
                            className="w-full h-12 rounded-xl text-base font-semibold gap-2"
                            disabled={items.length === 0}
                          >
                            <Plus className="w-4 h-4" />
                            Add to this day's diary
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}

            {/* FUTURE: plan */}
            {selectedState === "future" && (
              <>
                {/* Existing plans */}
                {selectedPlans.length > 0 && (
                  <div className="space-y-2 mb-5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Planned for this day
                    </p>
                    {selectedPlans.map((plan, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-2xl border border-border p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {plan.type}
                            </p>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {plan.time}
                            </span>
                          </div>
                          <button
                            onClick={() => removePlan(i)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {plan.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2.5 py-1 rounded-full bg-rag-amber/15 text-foreground"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Planner */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Add a planned meal
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MEAL_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setMealType(t)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                          mealType === t
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-4 mb-4">
                  <p className="text-sm font-medium text-foreground mb-3">
                    What are you planning?
                  </p>

                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addItem()}
                        placeholder="Add a food or recipe..."
                        className="h-11 pl-10 rounded-xl bg-background border-border"
                      />
                    </div>
                    <Button onClick={addItem} className="h-11 px-4 rounded-xl">
                      Add
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      or plan with
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Button variant="outline" className="h-11 rounded-xl border-border gap-2">
                      <Camera className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Photo</span>
                    </Button>
                    <Button variant="outline" className="h-11 rounded-xl border-border gap-2">
                      <Mic className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium">Voice</span>
                    </Button>
                  </div>

                  {items.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {items.map((item, i) => (
                        <motion.span
                          key={`${item}-${i}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nomi-blue-soft text-primary text-sm font-medium"
                        >
                          {item}
                          <button
                            onClick={() => removeItem(i)}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-card rounded-2xl border border-border p-4 mb-4 space-y-5">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Planned time
                    </label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-10 rounded-xl bg-background border-border w-36"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      Planned portion
                    </label>
                    <PortionSelector value={portion} onChange={setPortion} />
                  </div>
                </div>

                <Button
                  onClick={savePlan}
                  className="w-full h-12 rounded-xl text-base font-semibold gap-2"
                  disabled={items.length === 0}
                >
                  <Plus className="w-4 h-4" />
                  Add to plan
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarScreen;
