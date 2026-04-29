import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Mic, Clock, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import PortionSelector from "@/components/PortionSelector";
import MedicationTracker from "@/components/MedicationTracker";

const MEAL_TYPES = [
  "Breakfast",
  "Morning Snack",
  "Lunch",
  "Afternoon Snack",
  "Dinner",
  "Evening Snack",
  "Drink",
] as const;

const LogScreen = () => {
  const [mealType, setMealType] = useState<string>("Lunch");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [time, setTime] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });
  const [portion, setPortion] = useState(1);

  const addItem = () => {
    const v = search.trim();
    if (!v) return;
    setItems((prev) => [...prev, v]);
    setSearch("");
  };

  const removeItem = (i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Log a Meal
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          Add to today's food diary
        </p>
      </motion.div>

      {/* Meal type */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Meal type
        </p>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setMealType(t)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
                mealType === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Manual search */}
      <motion.div
        className="bg-card rounded-2xl border border-border p-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
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
              placeholder={
                mealType === "Drink"
                  ? "Search for a drink..."
                  : "Search for a food item..."
              }
              className="h-11 pl-10 rounded-xl bg-background border-border"
            />
          </div>
          <Button
            onClick={addItem}
            className="h-11 px-4 rounded-xl"
          >
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
          <Button
            variant="outline"
            className="h-11 rounded-xl border-border gap-2"
          >
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Photo</span>
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-border gap-2"
          >
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
      </motion.div>

      {/* Time + portion */}
      <motion.div
        className="bg-card rounded-2xl border border-border p-4 mb-6 space-y-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
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
      </motion.div>

      {/* Save */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Button
          className="w-full h-12 rounded-xl text-base font-semibold"
          disabled={items.length === 0}
        >
          Add to food diary
        </Button>
      </motion.div>

      {/* Medication tracker */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MedicationTracker />
      </motion.div>
    </div>
  );
};

export default LogScreen;
