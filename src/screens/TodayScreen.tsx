import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import DualRingChart from "@/components/DualRingChart";
import NutrientBar from "@/components/NutrientBar";
import RecentlyLogged from "@/components/RecentlyLogged";
import NomiIntelligence from "@/components/NomiIntelligence";
import MedicationTracker from "@/components/MedicationTracker";

const nutrients = [
  { name: "Carbohydrates", target: 250, actual: 162, unit: "g", color: "hsl(var(--nutrient-carbs))" },
  { name: "Protein", target: 80, actual: 34, unit: "g", color: "hsl(var(--nutrient-protein))" },
  { name: "Fat", target: 65, actual: 41, unit: "g", color: "hsl(var(--nutrient-fat))" },
  { name: "Fibre", target: 30, actual: 9, unit: "g", color: "hsl(var(--nutrient-fibre))" },
  { name: "Sugar", target: 50, actual: 28, unit: "g", color: "hsl(var(--nutrient-sugar))" },
  { name: "Creon", target: 3, actual: 0, unit: "", color: "hsl(var(--nomi-amber))" },
];

const recentMeal = {
  name: "Sandwich, crisps & orange juice",
  time: "12:48 PM",
  type: "Lunch",
  calories: 685,
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const TodayScreen = () => {
  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-muted-foreground text-sm">{getGreeting()}</p>
        <h1 className="text-2xl font-bold text-foreground">Sarah</h1>
      </motion.div>

      {/* NOMI Gentle Prompt — Enzyme not logged */}
      <motion.div
        className="mt-4 bg-nomi-yellow-soft border border-accent/30 rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-nomi-amber flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Enzyme replacement not logged</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              NOMI has noted you have not logged your enzyme replacement with lunch. Please let us know what happened — this helps your care team support you better.
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "I forgot to take them",
            "I took them but forgot to log",
          ].map((option) => (
            <button
              key={option}
              onClick={() => setCreonResponse(option)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                creonResponse === option
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-muted"
              }`}
            >
              {option}
            </button>
          ))}
          <button
            onClick={() => setCreonResponse(creonResponse === "__other__" ? null : "__other__")}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              creonResponse === "__other__" || (creonResponse && !["I forgot to take them", "I took them but forgot to log", null].includes(creonResponse))
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-foreground hover:bg-muted"
            }`}
          >
            Other
          </button>
        </div>

        {(creonResponse === "__other__" || (creonResponse && !["I forgot to take them", "I took them but forgot to log", null, "__other__"].includes(creonResponse))) && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Tell us what happened…"
              className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              value={creonResponse === "__other__" ? "" : (creonResponse || "")}
              onChange={(e) => setCreonResponse(e.target.value || "__other__")}
            />
          </div>
        )}

        {creonResponse && creonResponse !== "__other__" && (
          <motion.div
            className="mt-3 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button className="text-xs font-medium px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Submit
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Ring Chart */}
      <motion.div
        className="flex justify-center mt-6 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DualRingChart nutrients={nutrients} size={240} />
      </motion.div>

      {/* Nutrient breakdown */}
      <motion.div
        className="space-y-3 mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Today's Nutrients
        </h2>
        {nutrients.map((n) => (
          <NutrientBar key={n.name} {...n} />
        ))}
      </motion.div>

      {/* Medication */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <MedicationTracker />
      </motion.div>

      {/* Dietitian Message */}
      <motion.div
        className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">FA</span>
          </div>
          <span className="text-xs font-semibold text-primary">Faith Ahamefula</span>
          <span className="text-[10px] text-muted-foreground ml-auto">Just now</span>
        </div>
        <p className="text-sm text-foreground">
          Hi Sarah — I noticed you've had a few meals this week without logging your Creon. Remember to take it with every meal and snack that contains fat or protein. It really helps with absorption. Let me know if you're having trouble remembering! 💊
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
      >
        <RecentlyLogged meal={recentMeal} />
      </motion.div>

      {/* NOMI Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <NomiIntelligence />
      </motion.div>
    </div>
  );
};

export default TodayScreen;
