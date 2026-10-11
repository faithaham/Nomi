import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Droplets, Flame, Lightbulb, NotebookPen, Stethoscope } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const energyBaseline = 2300;
const fluidGuide = 2000;

const weeks = [
  {
    label: "28 Sep – 4 Oct",
    energy: [2050, 2240, 2110, 1980, 2290, 2350, 2120],
    fluids: [1600, 1800, 1700, 1900, 1750, 2000, 1650],
    insight: (
      <>NOMI noticed your energy dipped slightly mid-week. Days with a <span className="font-semibold">mid-morning flapjack</span> sat closer to your dietitian's baseline.</>
    ),
  },
  {
    label: "5 – 11 Oct",
    energy: [2180, 2310, 2040, 2265, 2195, 2380, 2135],
    fluids: [1750, 1900, 1650, 2000, 1850, 2100, 1800],
    insight: (
      <>NOMI noticed your fibre intake increased this week. <span className="font-semibold">Porridge with seeds</span> at breakfast and <span className="font-semibold">wholemeal bread</span> at lunch were the main sources.</>
    ),
  },
];

const SummaryScreen = () => {
  const [weekIndex, setWeekIndex] = useState(weeks.length - 1);
  const [notes, setNotes] = useState("");
  const [prepOpen, setPrepOpen] = useState(false);
  const week = weeks[weekIndex];
  const isThisWeek = weekIndex === weeks.length - 1;

  const maxEnergy = Math.max(...week.energy, energyBaseline) * 1.05;
  const avgEnergy = Math.round(week.energy.reduce((s, v) => s + v, 0) / 7);
  const avgFluids = week.fluids.reduce((s, v) => s + v, 0) / 7;
  const maxFluid = Math.max(...week.fluids, fluidGuide) * 1.05;

  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Your Week</h1>
      <p className="text-sm text-muted-foreground mb-4">Your weekly food diary summary and key patterns.</p>

      {/* Week switcher */}
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-2 py-1.5 mb-4">
        <button
          type="button"
          aria-label="Previous week"
          disabled={weekIndex === 0}
          onClick={() => setWeekIndex((i) => i - 1)}
          className="p-2 rounded-md hover:bg-muted disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {week.label}{isThisWeek && <span className="text-muted-foreground font-normal"> · This week</span>}
        </span>
        <button
          type="button"
          aria-label="Next week"
          disabled={isThisWeek}
          onClick={() => setWeekIndex((i) => i + 1)}
          className="p-2 rounded-md hover:bg-muted disabled:opacity-30">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Daily energy */}
      <motion.div key={`e-${weekIndex}`} className="bg-card rounded-lg border border-border p-4 mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Daily Energy (kcal)</p>
            <p className="text-xs text-muted-foreground mt-0.5">Average {avgEnergy.toLocaleString("en-GB")} kcal/day</p>
          </div>
          <Flame className="w-5 h-5 text-primary" />
        </div>
        <div className="relative h-28">
          <div
            className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/50"
            style={{ bottom: `${(energyBaseline / maxEnergy) * 100}%` }} />
          <div className="absolute inset-0 flex items-end gap-2">
            {week.energy.map((val, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-md bg-primary/80"
                initial={{ height: 0 }}
                animate={{ height: `${(val / maxEnergy) * 100}%` }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                title={`${days[i]}: ${val} kcal`} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-1.5">
          {days.map((d) => <span key={d} className="flex-1 text-center text-[10px] text-muted-foreground">{d}</span>)}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Dashed line: your dietitian's baseline of {energyBaseline.toLocaleString("en-GB")} kcal/day.
        </p>
      </motion.div>

      {/* Hydration */}
      <motion.div key={`f-${weekIndex}`} className="bg-card rounded-lg border border-border p-4 mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Hydration & Fluids</p>
            <p className="text-xs text-muted-foreground mt-0.5">Average {(avgFluids / 1000).toFixed(1)}L/day · guide {(fluidGuide / 1000).toFixed(1)}L</p>
          </div>
          <Droplets className="w-5 h-5 text-primary" />
        </div>
        <div className="relative h-16">
          <div
            className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/50"
            style={{ bottom: `${(fluidGuide / maxFluid) * 100}%` }} />
          <div className="absolute inset-0 flex items-end gap-2">
            {week.fluids.map((val, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-primary/40" style={{ height: `${(val / maxFluid) * 100}%` }} title={`${days[i]}: ${val}ml`} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-1.5">
          {days.map((d) => <span key={d} className="flex-1 text-center text-[10px] text-muted-foreground">{d}</span>)}
        </div>
      </motion.div>

      {/* NOMI Intelligence */}
      <div className="bg-ai-card rounded-lg border border-primary/15 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">NOMI Intelligence</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{week.insight}</p>
        <p className="text-[10px] text-muted-foreground mt-2">AI assisted — reviewed by dietitian.</p>
      </div>

      {/* Notes */}
      <div className="bg-card rounded-lg border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <NotebookPen className="w-5 h-5 text-primary" />
          <p className="text-sm font-semibold text-foreground">My notes for this week</p>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Symptoms, appetite changes, or questions for Faith…"
          className="min-h-24 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      {/* Clinic prep (collapsible) */}
      <div className="bg-card rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setPrepOpen((o) => !o)}
          aria-expanded={prepOpen}
          className="w-full flex items-center justify-between p-4 text-left">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Prepare for your next review</p>
              <p className="text-xs text-muted-foreground">Next review with Faith: 24 Oct</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${prepOpen ? "rotate-180" : ""}`} />
        </button>
        {prepOpen && (
          <ul className="px-4 pb-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary font-semibold">1.</span><span>Your breakfasts with porridge and seeds have been working well — worth mentioning to Faith.</span></li>
            <li className="flex gap-2"><span className="text-primary font-semibold">2.</span><span>Bring along anything from your notes, like changes in appetite or digestion.</span></li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default SummaryScreen;
