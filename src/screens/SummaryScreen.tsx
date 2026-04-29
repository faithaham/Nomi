import { motion } from "framer-motion";
import { useState } from "react";
import { Flame, Lightbulb, TrendingUp, ShieldCheck, AlertTriangle, Cookie, GlassWater } from "lucide-react";

const weeklyData = [65, 72, 58, 80, 75, 88, 70];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SummaryScreen = () => {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const maxVal = Math.max(...weeklyData);

  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Summary</h1>
        <p className="text-sm text-muted-foreground mb-5">How you're managing your targets this week</p>
      </motion.div>

      {/* Period toggle */}
      <div className="flex gap-2 mb-6">
        {(["weekly", "monthly"] as const).map((p) =>
        <button
          key={p}
          onClick={() => setPeriod(p)}
          className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
          period === p ?
          "bg-primary text-primary-foreground" :
          "bg-secondary text-secondary-foreground"}`
          }>
          
            {p}
          </button>
        )}
      </div>

      {/* Bar chart */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}>
        
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Daily Targets Met %
        </p>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((val, i) =>
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
              className="w-full rounded-t-md bg-primary"
              initial={{ height: 0 }}
              animate={{ height: `${val / maxVal * 100}%` }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: "easeOut" }} />
            
              <span className="text-[10px] text-muted-foreground">{days[i]}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div
        className="bg-nomi-yellow-soft rounded-lg p-4 mb-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        
        <Flame className="w-8 h-8 text-nomi-amber" />
        <div>
          <p className="font-bold text-foreground">7-day streak!</p>
          <p className="text-xs text-muted-foreground">You've logged every day this week, well done!</p>
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
          NOMI has noticed your fibre intake has improved by 20% this week. Consistent fibre helps with bowel movement regularity — keep it up!
        </p>
      </motion.div>

      {/* Condition management summary */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          This Week's Management
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-rag-green flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Energy intake on target</p>
              <p className="text-xs text-muted-foreground">Averaging 2,180 kcal/day (target: 2,200)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rag-amber flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Creon taken with 5 of 7 meals</p>
              <p className="text-xs text-muted-foreground">2 meals logged without enzyme replacement</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-rag-green flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Protein targets consistently met</p>
              <p className="text-xs text-muted-foreground">Averaging 82g/day (target: 80g)</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Snacks summary */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}>
        
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Cookie className="w-3.5 h-3.5 text-nomi-amber" />
            Snacks This Week
          </p>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-nomi-yellow-soft text-nomi-amber">
            12 logged
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-rag-green flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Snack frequency on track</p>
              <p className="text-xs text-muted-foreground">Averaging 1.7 snacks/day (target: 2)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rag-amber flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Mostly low-energy snacks</p>
              <p className="text-xs text-muted-foreground">Try adding nut butter or cheese for extra calories</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Drinks summary */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <GlassWater className="w-3.5 h-3.5 text-primary" />
            Drinks This Week
          </p>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-nomi-blue-soft text-primary">
            21 logged
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-rag-green flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Hydration target met</p>
              <p className="text-xs text-muted-foreground">Averaging 1.9L/day (target: 1.8L)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rag-amber flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Limited high-energy drinks</p>
              <p className="text-xs text-muted-foreground">Only 3 nourishing drinks (e.g. milk, smoothies) this week</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>);

};

export default SummaryScreen;
