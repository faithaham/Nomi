import { Camera, Search } from "lucide-react";
import { motion } from "framer-motion";
import MedicationTracker from "@/components/MedicationTracker";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

const LogScreen = () => {
  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Log a Meal</h1>
        <p className="text-sm text-muted-foreground mb-5">Search for foods or use Photo Log</p>
      </motion.div>

      {/* Search + Camera */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search foods..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-transform active:scale-95">
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Photo Log</span>
        </button>
      </motion.div>

      {/* Meal type selector */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Meal type
        </p>
        <div className="flex gap-2">
          {mealTypes.map((type, i) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                i === 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Placeholder content */}
      <motion.div
        className="bg-card rounded-lg border border-border p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-sm text-muted-foreground">
          Search for a food item or tap Photo Log to analyse a meal photo
        </p>
      </motion.div>

      {/* Medication tracker */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <MedicationTracker />
      </motion.div>
    </div>
  );
};

export default LogScreen;
