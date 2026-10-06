import { motion } from "framer-motion";
import { useState } from "react";
import { Activity, Droplets, Lightbulb, NotebookPen, Pill, Stethoscope } from "lucide-react";

const energyData = [2180, 2310, 2040, 2265, 2195, 2380, 2135];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const energyBaseline = 2300;

const enzymeCoverage = [
  { day: "Mon", covered: 3, meals: 3 },
  { day: "Tue", covered: 2, meals: 3 },
  { day: "Wed", covered: 3, meals: 3 },
  { day: "Thu", covered: 2, meals: 3 },
  { day: "Fri", covered: 3, meals: 3 },
  { day: "Sat", covered: 3, meals: 3 },
  { day: "Sun", covered: 2, meals: 3 },
];

const fluidData = [1750, 1900, 1650, 2000, 1850, 2100, 1800];
const fluidGuide = 2000;

const fourWeekAverages = [
  { label: "Energy", value: "2,190 kcal/day" },
  { label: "Creon coverage", value: "86% of meals" },
  { label: "Fluids", value: "1.85L/day" },
];

const SummaryScreen = () => {
  const [clinicNotes, setClinicNotes] = useState("");
  const maxEnergy = Math.max(...energyData, energyBaseline);
  const avgEnergy = Math.round(energyData.reduce((sum, value) => sum + value, 0) / energyData.length);
  const avgFluids = Math.round(fluidData.reduce((sum, value) => sum + value, 0) / fluidData.length);
  const totalCovered = enzymeCoverage.reduce((sum, day) => sum + day.covered, 0);
  const totalMeals = enzymeCoverage.reduce((sum, day) => sum + day.meals, 0);
  const enzymePercent = Math.round(totalCovered / totalMeals * 100);

  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Weekly Clinical Summary</h1>
        <p className="text-sm text-muted-foreground mb-5">A supportive review of Sarah's food diary patterns this week</p>
      </motion.div>

      {/* Energy stability */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}>
        
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              7-day energy stability
            </p>
            <p className="text-sm font-semibold text-foreground mt-1">{avgEnergy.toLocaleString("en-GB")} kcal/day average</p>
          </div>
          <Activity className="w-5 h-5 text-primary flex-shrink-0" />
        </div>
        <div className="flex items-end justify-between gap-2 h-36">
          {energyData.map((val, i) =>
          <div key={days[i]} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
               className="w-full rounded-t-md bg-primary/85"
              initial={{ height: 0 }}
               animate={{ height: `${val / maxEnergy * 100}%` }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: "easeOut" }} />
            
               <span className="text-[10px] text-muted-foreground">{days[i]}</span>
               <span className="text-[10px] font-medium text-foreground">{Math.round(val / 100) / 10}k</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Baseline set by Faith: {energyBaseline.toLocaleString("en-GB")} kcal/day. This week shows a steady pattern without large dips.
        </p>
      </motion.div>

      {/* Enzyme and fluids */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-5 h-5 text-primary" />
            <p className="text-sm font-semibold text-foreground">Creon meal coverage</p>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{enzymePercent}%</p>
          <p className="text-xs text-muted-foreground mt-1">{totalCovered} of {totalMeals} meals had enzyme replacement logged.</p>
          <div className="mt-3 flex gap-1">
            {enzymeCoverage.map((day) =>
            <span
              key={day.day}
              className={`h-2 flex-1 rounded-full ${day.covered === day.meals ? "bg-rag-green" : "bg-rag-amber"}`}
              aria-label={`${day.day}: ${day.covered} of ${day.meals} meals covered`} />
            )}
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="w-5 h-5 text-primary" />
            <p className="text-sm font-semibold text-foreground">Fluid consistency</p>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{(avgFluids / 1000).toFixed(1)}L</p>
          <p className="text-xs text-muted-foreground mt-1">Average logged each day. Faith's guide is {(fluidGuide / 1000).toFixed(1)}L.</p>
          <div className="mt-3 flex items-end gap-1 h-8">
            {fluidData.map((val, i) =>
            <span
              key={days[i]}
              className="flex-1 rounded-t-sm bg-nomi-blue-soft border border-primary/20"
              style={{ height: `${Math.max(20, val / fluidGuide * 100)}%` }}
              aria-label={`${days[i]}: ${val}ml logged`} />
            )}
          </div>
        </div>
      </motion.div>

      {/* NOMI Intelligence */}
      <motion.div
        className="bg-ai-card rounded-lg border border-primary/15 p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            NOMI Intelligence
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          NOMI has noticed Sarah's fibre intake increased this week. <span className="font-semibold">Porridge with seeds</span> at breakfast and <span className="font-semibold">wholemeal bread</span> at lunch were the main contributors, helping Faith see what is working.
        </p>
      </motion.div>

      {/* Clinic prep */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="w-5 h-5 text-primary" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Clinic prep
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {fourWeekAverages.map((item) =>
          <div key={item.label} className="rounded-lg bg-secondary p-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{item.value}</p>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Discussion points for Faith</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary font-semibold">1.</span><span>Creon was not logged with three meals containing fat; Sarah may need a simpler reminder.</span></li>
            <li className="flex gap-2"><span className="text-primary font-semibold">2.</span><span>Breakfasts with porridge and seeds are supporting fibre intake and could be kept in Sarah's routine.</span></li>
          </ul>
        </div>
      </motion.div>

      {/* Notes */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        <div className="flex items-center gap-2 mb-3">
          <NotebookPen className="w-5 h-5 text-primary" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes</p>
        </div>
        <textarea
          value={clinicNotes}
          onChange={(event) => setClinicNotes(event.target.value)}
          placeholder="Add anything Sarah wants to discuss with Faith…"
          className="min-h-28 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </motion.div>
    </div>);

};

export default SummaryScreen;
