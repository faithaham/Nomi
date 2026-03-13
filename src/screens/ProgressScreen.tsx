import { motion } from "framer-motion";
import { useState } from "react";
import { Flame, TrendingUp } from "lucide-react";

const weeklyData = [65, 72, 58, 80, 75, 88, 70];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ProgressScreen = () => {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const maxVal = Math.max(...weeklyData);

  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">Progress</h1>
        <p className="text-sm text-muted-foreground mb-5">Your nutritional journey</p>
      </motion.div>

      {/* Period toggle */}
      <div className="flex gap-2 mb-6">
        {(["weekly", "monthly"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              period === p
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Target Achievement %
        </p>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-md bg-primary"
                initial={{ height: 0 }}
                animate={{ height: `${(val / maxVal) * 100}%` }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: "easeOut" }}
              />
              <span className="text-[10px] text-muted-foreground">{days[i]}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div
        className="bg-nomi-yellow-soft rounded-lg p-4 mb-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Flame className="w-8 h-8 text-nomi-amber" />
        <div>
          <p className="font-bold text-foreground">7-day streak!</p>
          <p className="text-xs text-muted-foreground">You've logged every day this week</p>
        </div>
      </motion.div>

      {/* Insight card */}
      <motion.div
        className="bg-nomi-blue-soft rounded-lg p-4 flex items-start gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Your fibre intake has improved 20% this week
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Keep it up — consistent fibre helps support your digestive health goals.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressScreen;
