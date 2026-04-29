import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Mic, Clock, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import PortionSelector from "@/components/PortionSelector";
import MedicationTracker from "@/components/MedicationTracker";

const MEAL_SECTIONS = ["Breakfast", "Lunch", "Dinner", "Snacks", "Drinks"] as const;
const SNACK_SUBSECTIONS = ["Morning Snack", "Afternoon Snack", "Evening Snack"] as const;
const ALL_SECTIONS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Morning Snack",
  "Afternoon Snack",
  "Evening Snack",
  "Snacks",
  "Drinks",
];

const LogScreen = () => {
  const [diaryDate, setDiaryDate] = useState<Date>(new Date());
  const [meals, setMeals] = useState<Record<string, string[]>>(
    Object.fromEntries(ALL_SECTIONS.map((s) => [s, []])),
  );
  const [searchInputs, setSearchInputs] = useState<Record<string, string>>(
    Object.fromEntries(ALL_SECTIONS.map((s) => [s, ""])),
  );
  const [mealTimes, setMealTimes] = useState<Record<string, string>>(
    Object.fromEntries(ALL_SECTIONS.map((s) => [s, ""])),
  );
  const [mealPortions, setMealPortions] = useState<Record<string, number>>(
    Object.fromEntries(ALL_SECTIONS.map((s) => [s, 1])),
  );

  const addFoodItem = (section: string) => {
    const val = searchInputs[section]?.trim();
    if (!val) return;
    setMeals((prev) => ({ ...prev, [section]: [...prev[section], val] }));
    setSearchInputs((prev) => ({ ...prev, [section]: "" }));
  };

  const removeFoodItem = (section: string, index: number) => {
    setMeals((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const renderSectionInputs = (section: string, isSnackSub = false) => (
    <>
      <div className="flex gap-2 mb-3">
        <Input
          value={searchInputs[section]}
          onChange={(e) =>
            setSearchInputs((prev) => ({ ...prev, [section]: e.target.value }))
          }
          onKeyDown={(e) => e.key === "Enter" && addFoodItem(section)}
          placeholder={
            section === "Drinks" ? "Search for a drink..." : "Search for a food item..."
          }
          className="h-11 rounded-xl bg-background border-border flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-xl border-border shrink-0"
        >
          <Camera className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {meals[section].length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {meals[section].map((item, i) => (
            <motion.span
              key={`${item}-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nomi-blue-soft text-primary text-sm font-medium"
            >
              {item}
              <button
                onClick={() => removeFoodItem(section, i)}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      <div className="mb-3">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
          <Clock className="w-3.5 h-3.5" />
          {isSnackSub ? "When did you have this snack?" : "When did you have this meal?"}
        </label>
        <Input
          type="time"
          value={mealTimes[section]}
          onChange={(e) =>
            setMealTimes((prev) => ({ ...prev, [section]: e.target.value }))
          }
          className="h-10 rounded-xl bg-background border-border w-36"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          How much did you finish?
        </label>
        <PortionSelector
          value={mealPortions[section]}
          onChange={(val) =>
            setMealPortions((prev) => ({ ...prev, [section]: val }))
          }
        />
      </div>
    </>
  );

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
          Record your day of eating
        </p>
      </motion.div>

      {/* Diary date */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
          Diary date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-11 justify-start rounded-xl bg-card border-border font-normal",
                !diaryDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {diaryDate ? format(diaryDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={diaryDate}
              onSelect={(d) => d && setDiaryDate(d)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </motion.div>

      {/* Voice recording */}
      <motion.div
        className="bg-card rounded-2xl border border-border p-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="text-sm font-medium text-foreground mb-1 block">
          Record a verbal diet history
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Tap the microphone to dictate what you ate. Your recording will be
          transcribed automatically.
        </p>
        <Button
          variant="outline"
          className="h-12 w-full rounded-xl border-border gap-2 text-muted-foreground hover:text-foreground"
        >
          <Mic className="w-5 h-5 text-destructive" />
          Start recording
        </Button>
      </motion.div>

      {/* Manual meal logging */}
      <div className="pt-2 pb-3">
        <h2 className="text-lg font-bold text-foreground">
          Manually record your meal
        </h2>
      </div>

      <div className="space-y-6">
        {MEAL_SECTIONS.map((section) => {
          if (section === "Snacks") {
            return (
              <div
                key="Snacks"
                className="bg-card rounded-2xl border border-border p-4"
              >
                <h3 className="text-base font-semibold text-foreground mb-4">
                  Snacks
                </h3>
                <div className="space-y-6">
                  {SNACK_SUBSECTIONS.map((sub) => (
                    <div
                      key={sub}
                      className="border-t border-border pt-4 first:border-t-0 first:pt-0"
                    >
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        {sub}
                      </h4>
                      {renderSectionInputs(sub, true)}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div
              key={section}
              className="bg-card rounded-2xl border border-border p-4"
            >
              <h3 className="text-base font-semibold text-foreground mb-3">
                {section}
              </h3>
              {renderSectionInputs(section)}
            </div>
          );
        })}
      </div>

      {/* Medication tracker */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MedicationTracker />
      </motion.div>
    </div>
  );
};

export default LogScreen;
