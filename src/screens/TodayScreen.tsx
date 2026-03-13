import { motion } from "framer-motion";
import DualRingChart from "@/components/DualRingChart";
import NutrientBar from "@/components/NutrientBar";
import RecentlyLogged from "@/components/RecentlyLogged";
import MedicationTracker from "@/components/MedicationTracker";

const nutrients = [
  { name: "Carbs", target: 250, actual: 145, unit: "g", color: "hsl(var(--nutrient-carbs))" },
  { name: "Protein", target: 80, actual: 52, unit: "g", color: "hsl(var(--nutrient-protein))" },
  { name: "Fat", target: 65, actual: 38, unit: "g", color: "hsl(var(--nutrient-fat))" },
  { name: "Fibre", target: 30, actual: 18, unit: "g", color: "hsl(var(--nutrient-fibre))" },
  { name: "Sugar", target: 50, actual: 22, unit: "g", color: "hsl(var(--nutrient-sugar))" },
];

const recentMeal = {
  name: "Grilled chicken salad with quinoa",
  time: "12:35 PM",
  type: "Lunch",
  calories: 420,
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

      {/* Ring Chart */}
      <motion.div
        className="flex justify-center mt-6 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
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

      {/* Recently logged */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <RecentlyLogged meal={recentMeal} />
      </motion.div>
    </div>
  );
};

export default TodayScreen;
