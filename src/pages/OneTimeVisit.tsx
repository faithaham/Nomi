import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Home, Camera, X, Download, ExternalLink, Clock, CalendarIcon, Mic, Pill, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DualRingChart from "@/components/DualRingChart";
import PortionSelector from "@/components/PortionSelector";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CONDITIONS = [
  "Diabetes Type 1",
  "Diabetes Type 2",
  "Coeliac Disease",
  "IBS",
  "High Cholesterol",
  "Other",
];

const DIETARY_RESTRICTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Halal",
  "Kosher",
  "Nut allergy",
  "None",
];

const MEAL_SECTIONS = ["Breakfast", "Lunch", "Dinner", "Snacks", "Drinks"] as const;
const SNACK_SUBSECTIONS = ["Morning Snack", "Afternoon Snack", "Evening Snack"] as const;

const FREQUENCY_OPTIONS = ["Once daily", "Twice daily", "Three times daily", "With every meal", "As needed"];

const COMMON_MEDICATIONS = [
  "Creon 25,000",
  "Creon 10,000",
  "Kaftrio",
  "Omeprazole",
  "Insulin",
  "Metformin",
  "Vitamin D",
  "Iron supplement",
  "Calcium supplement",
  "Multivitamin",
  "Omega-3",
  "Probiotics",
];

const MEAL_ASSIGN_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snacks", "All meals"];

interface MedicationEntry {
  id: string;
  name: string;
  frequency: string;
  mealTimes: string[];
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35 },
};

// Condition-specific summaries
const getSummary = (condition: string) => {
  const summaries: Record<string, string> = {
    IBS: "You had a good intake of protein today but your fibre was below the recommended amount for someone managing IBS. Consider adding more soluble fibre sources like oats or bananas.",
    "Diabetes Type 1": "Your carbohydrate intake was well-balanced across meals today. Your protein and fat intake look good. Consider spacing carbohydrates more evenly if blood sugar management is a concern.",
    "Diabetes Type 2": "Your overall intake looks reasonable today. Your sugar intake was moderate — try to keep an eye on refined sugars. Adding more fibre-rich foods could help with blood sugar stability.",
    "Coeliac Disease": "Your meal choices today appear well-balanced. Make sure all items listed are certified gluten-free. Your fibre intake is a little low — gluten-free wholegrains can help.",
    "High Cholesterol": "Your fat intake today was within a healthy range. Try to focus on unsaturated fats from sources like olive oil, nuts and oily fish. Your fibre intake could benefit from an increase.",
    Other: "Your overall intake today looks balanced. You met most of your nutritional targets. Consider adding more variety in your fruit and vegetable intake for additional micronutrients.",
  };
  return summaries[condition] || summaries["Other"];
};

const OneTimeVisit = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Form state
  const [diaryDate, setDiaryDate] = useState<Date>(new Date());
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [condition, setCondition] = useState("");
  const [restrictions, setRestrictions] = useState<string[]>([]);

  // Medications state
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [medSearch, setMedSearch] = useState("");
  const [selectedMed, setSelectedMed] = useState("");
  const [medFrequency, setMedFrequency] = useState("");
  const [medMealTimes, setMedMealTimes] = useState<string[]>([]);

  // Food diary state
  const allSections = ["Breakfast", "Lunch", "Dinner", "Morning Snack", "Afternoon Snack", "Evening Snack", "Snacks", "Drinks"];
  const [meals, setMeals] = useState<Record<string, string[]>>(
    Object.fromEntries(allSections.map((s) => [s, []]))
  );
  const [searchInputs, setSearchInputs] = useState<Record<string, string>>(
    Object.fromEntries(allSections.map((s) => [s, ""]))
  );
  const [mealTimes, setMealTimes] = useState<Record<string, string>>(
    Object.fromEntries(allSections.map((s) => [s, ""]))
  );
  const [mealPortions, setMealPortions] = useState<Record<string, number>>(
    Object.fromEntries(allSections.map((s) => [s, 1]))
  );

  const toggleRestriction = (r: string) => {
    setRestrictions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const toggleMedMealTime = (meal: string) => {
    setMedMealTimes((prev) =>
      prev.includes(meal) ? prev.filter((x) => x !== meal) : [...prev, meal]
    );
  };

  const addMedication = () => {
    const name = selectedMed || medSearch.trim();
    if (!name || !medFrequency) return;
    setMedications((prev) => [
      ...prev,
      { id: Date.now().toString(), name, frequency: medFrequency, mealTimes: medMealTimes },
    ]);
    setSelectedMed("");
    setMedSearch("");
    setMedFrequency("");
    setMedMealTimes([]);
  };

  const removeMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

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

  // Summary nutrients (demo data)
  const summaryNutrients = [
    { name: "Carbohydrates", target: 250, actual: 180, unit: "g", color: "hsl(var(--nutrient-carbs))" },
    { name: "Protein", target: 80, actual: 62, unit: "g", color: "hsl(var(--nutrient-protein))" },
    { name: "Fat", target: 65, actual: 45, unit: "g", color: "hsl(var(--nutrient-fat))" },
    { name: "Fibre", target: 30, actual: 14, unit: "g", color: "hsl(var(--nutrient-fibre))" },
    { name: "Sugar", target: 50, actual: 32, unit: "g", color: "hsl(var(--nutrient-sugar))" },
  ];

  const filteredMeds = medSearch
    ? COMMON_MEDICATIONS.filter((m) => m.toLowerCase().includes(medSearch.toLowerCase()))
    : [];

  const ProgressIndicator = ({ current }: { current: number }) => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <button
            onClick={() => setStep(s)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer hover:ring-2 hover:ring-primary/30 ${
              s <= current
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s}
          </button>
          {s < 4 && (
            <div
              className={`w-8 h-0.5 ${
                s < current ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const TopBar = ({ showBack = true }: { showBack?: boolean }) => (
    <div className="flex items-center justify-between mb-8">
      {showBack && step > 0 ? (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="w-9 h-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:shadow-md active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
      ) : (
        <div className="w-9" />
      )}
      <div className="text-lg font-bold text-foreground tracking-tight">NOMI</div>
      <button
        onClick={() => navigate("/")}
        className="w-9 h-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:shadow-md active:scale-95 transition-all"
      >
        <Home className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* PAGE 1 — WELCOME */}
          {step === 0 && (
            <motion.div key="welcome" {...fadeUp}>
              <TopBar showBack={false} />

              <div className="text-center py-12">
                <motion.h1
                  className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  Log your day of eating
                </motion.h1>

                <motion.p
                  className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-12 leading-relaxed"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  Your Dietitian or GP has asked you to keep a food diary. Fill
                  in what you ate today, and we'll generate a simple summary you
                  can share at your next appointment.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Button
                    onClick={() => setStep(1)}
                    className="h-14 px-12 text-base font-semibold rounded-xl bg-nomi-green text-primary-foreground hover:bg-nomi-green/90 shadow-lg shadow-nomi-green/20"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </div>

              <motion.p
                className="text-center text-xs text-muted-foreground mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                Already have the NHS App? Find us there to continue tracking
                long term.
              </motion.p>
            </motion.div>
          )}

          {/* PAGE 2 — BASIC DETAILS */}
          {step === 1 && (
            <motion.div key="details" {...fadeUp}>
              <TopBar />
              <ProgressIndicator current={1} />

              <h2 className="text-2xl font-bold text-foreground mb-2">
                A few details first
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                This helps us tailor your summary.
              </p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="mt-1.5 h-12 rounded-xl bg-card border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email address
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">
                    So we can save your diary if you want to access it later
                  </p>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 rounded-xl bg-card border-border"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Medical condition
                  </Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger className="mt-1.5 h-12 rounded-xl bg-card border-border">
                      <SelectValue placeholder="Select your condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Any dietary restrictions?
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {DIETARY_RESTRICTIONS.map((r) => (
                      <label
                        key={r}
                        className="flex items-center gap-2.5 cursor-pointer"
                      >
                        <Checkbox
                          checked={restrictions.includes(r)}
                          onCheckedChange={() => toggleRestriction(r)}
                        />
                        <span className="text-sm text-foreground">{r}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Button
                  onClick={() => setStep(2)}
                  disabled={false}
                  className="w-full h-14 text-base font-semibold rounded-xl"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {/* PAGE 3 — MEDICATIONS & SUPPLEMENTS */}
          {step === 2 && (
            <motion.div key="medications" {...fadeUp}>
              <TopBar />
              <ProgressIndicator current={2} />

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Medications & Supplements
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Tell us about your prescribed medications and supplements.
              </p>

              {/* Example notification */}
              <div className="bg-nomi-blue-soft rounded-2xl border border-primary/20 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Example: Creon (Pancreatic Enzyme Replacement)
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      If you take Creon, it's important to take this medication with any food, drink, or snack containing fat. NOMI will remind you to log your enzymes alongside your meals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add medication form */}
              <div className="bg-card rounded-2xl border border-border p-4 mb-4">
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-primary" />
                  Add a medication or supplement
                </h3>

                {/* Search / select medication */}
                <div className="mb-3">
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Medication or supplement name
                  </Label>
                  <Input
                    value={medSearch}
                    onChange={(e) => {
                      setMedSearch(e.target.value);
                      setSelectedMed("");
                    }}
                    placeholder="Search or type a medication..."
                    className="h-11 rounded-xl bg-background border-border"
                  />
                  {filteredMeds.length > 0 && !selectedMed && (
                    <div className="mt-1 bg-card border border-border rounded-xl overflow-hidden">
                      {filteredMeds.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setSelectedMed(m);
                            setMedSearch(m);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Frequency */}
                <div className="mb-3">
                  <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    How often do you take this?
                  </Label>
                  <Select value={medFrequency} onValueChange={setMedFrequency}>
                    <SelectTrigger className="h-11 rounded-xl bg-background border-border">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assign to meal times */}
                <div className="mb-4">
                  <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Assign to meal times (optional)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {MEAL_ASSIGN_OPTIONS.map((meal) => (
                      <button
                        key={meal}
                        onClick={() => toggleMedMealTime(meal)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          medMealTimes.includes(meal)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {meal}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={addMedication}
                  disabled={!(selectedMed || medSearch.trim()) || !medFrequency}
                  className="w-full h-11 rounded-xl gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add medication
                </Button>
              </div>

              {/* Added medications list */}
              {medications.length > 0 && (
                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Your medications ({medications.length})
                  </h4>
                  {medications.map((med) => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-xl border border-border p-3 flex items-start justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{med.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{med.frequency}</p>
                        {med.mealTimes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {med.mealTimes.map((mt) => (
                              <span key={mt} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {mt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeMedication(med.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors mt-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-10">
                <Button
                  onClick={() => setStep(3)}
                  className="w-full h-14 text-base font-semibold rounded-xl"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {/* PAGE 4 — FOOD DIARY */}
          {step === 3 && (
            <motion.div key="diary" {...fadeUp}>
              <TopBar />
              <ProgressIndicator current={3} />

              <h2 className="text-2xl font-bold text-foreground mb-2">
                What did you eat today?
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Add items to each meal. Don't worry about being exact.
              </p>

              {/* Date picker */}
              <div className="bg-card rounded-2xl border border-border p-4 mb-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Date of diary entry
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal rounded-xl bg-background border-border",
                        !diaryDate && "text-muted-foreground"
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
              </div>

              {/* Voice recording */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Record a verbal diet history
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Tap the microphone to dictate what you ate. Your recording will be transcribed automatically. Try to follow the structure of the sections below — mention your breakfast, lunch, dinner, snacks, and drinks in order.
                </p>
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-xl border-border gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Mic className="w-5 h-5 text-destructive" />
                  Start recording
                </Button>
              </div>

              {/* Divider & manual title */}
              <div className="pt-6 pb-2">
                <h3 className="text-lg font-bold text-foreground">
                  Manually record your day of eating
                </h3>
              </div>

              <div className="space-y-8">
                {MEAL_SECTIONS.map((section) => {
                  if (section === "Snacks") {
                    return (
                      <div key="Snacks" className="bg-card rounded-2xl border border-border p-4">
                        <h3 className="text-base font-semibold text-foreground mb-4">Snacks</h3>
                        <div className="space-y-6">
                          {SNACK_SUBSECTIONS.map((sub) => (
                            <div key={sub} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">{sub}</h4>

                              <div className="flex gap-2 mb-3">
                                <Input
                                  value={searchInputs[sub]}
                                  onChange={(e) =>
                                    setSearchInputs((prev) => ({ ...prev, [sub]: e.target.value }))
                                  }
                                  onKeyDown={(e) => e.key === "Enter" && addFoodItem(sub)}
                                  placeholder="Search for a food item..."
                                  className="h-11 rounded-xl bg-background border-border flex-1"
                                />
                                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border shrink-0">
                                  <Camera className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </div>

                              {meals[sub].length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {meals[sub].map((item, i) => (
                                    <motion.span
                                      key={`${item}-${i}`}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nomi-blue-soft text-primary text-sm font-medium"
                                    >
                                      {item}
                                      <button onClick={() => removeFoodItem(sub, i)} className="hover:text-destructive transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </motion.span>
                                  ))}
                                </div>
                              )}

                              <div className="mb-3">
                                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  When did you have this snack?
                                </label>
                                <Input
                                  type="time"
                                  value={mealTimes[sub]}
                                  onChange={(e) => setMealTimes((prev) => ({ ...prev, [sub]: e.target.value }))}
                                  className="h-10 rounded-xl bg-background border-border w-36"
                                />
                              </div>

                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                  How much did you finish?
                                </label>
                                <PortionSelector
                                  value={mealPortions[sub]}
                                  onChange={(val) => setMealPortions((prev) => ({ ...prev, [sub]: val }))}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={section} className="bg-card rounded-2xl border border-border p-4">
                      <h3 className="text-base font-semibold text-foreground mb-3">{section}</h3>
                      <div className="flex gap-2 mb-3">
                        <Input
                          value={searchInputs[section]}
                          onChange={(e) => setSearchInputs((prev) => ({ ...prev, [section]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && addFoodItem(section)}
                          placeholder={section === "Drinks" ? "Search for a drink..." : "Search for a food item..."}
                          className="h-11 rounded-xl bg-background border-border flex-1"
                        />
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border shrink-0" onClick={() => {}}>
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
                              <button onClick={() => removeFoodItem(section, i)} className="hover:text-destructive transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </motion.span>
                          ))}
                        </div>
                      )}
                      <div className="mb-3">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          When did you have this meal?
                        </label>
                        <Input
                          type="time"
                          value={mealTimes[section]}
                          onChange={(e) => setMealTimes((prev) => ({ ...prev, [section]: e.target.value }))}
                          className="h-10 rounded-xl bg-background border-border w-36"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          How much of this meal did you finish?
                        </label>
                        <PortionSelector
                          value={mealPortions[section]}
                          onChange={(val) => setMealPortions((prev) => ({ ...prev, [section]: val }))}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10">
                <Button
                  onClick={() => setStep(4)}
                  disabled={false}
                  className="w-full h-14 text-base font-semibold rounded-xl"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {/* PAGE 5 — SUMMARY */}
          {step === 4 && (
            <motion.div key="summary" {...fadeUp}>
              <TopBar />
              <ProgressIndicator current={4} />

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Your summary{firstName ? `, ${firstName}` : ""}
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Here's an overview of what you logged today.
              </p>

              {/* Food Diary */}
              {(() => {
                const EXAMPLE_DIARY: Record<string, string[]> = {
                  Breakfast: ["Porridge with honey", "Glass of orange juice"],
                  Lunch: ["Ham & cheese sandwich", "Apple", "Packet of crisps"],
                  Dinner: ["Spaghetti bolognese", "Side salad", "Garlic bread"],
                  "Morning Snack": ["Banana"],
                  "Afternoon Snack": ["Yoghurt"],
                  "Evening Snack": ["Biscuits x2"],
                  Drinks: ["Water", "Tea with milk", "Ribena"],
                };

                const DIARY_SECTIONS = ["Breakfast", "Lunch", "Dinner", "Morning Snack", "Afternoon Snack", "Evening Snack", "Drinks"];
                const hasUserData = DIARY_SECTIONS.some((s) => meals[s]?.length > 0);
                const displayData = hasUserData ? meals : EXAMPLE_DIARY;

                return (
                  <div className="bg-card rounded-2xl border border-border p-5 mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      Your Food Diary
                    </h3>
                    {!hasUserData && (
                      <p className="text-xs text-muted-foreground italic mb-3">Example food diary</p>
                    )}
                    {DIARY_SECTIONS.map((section) => {
                      const items = displayData[section];
                      if (!items || items.length === 0) return null;
                      return (
                        <div key={section} className="mb-3 last:mb-0">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {section}
                          </span>
                          <p className="text-sm text-foreground mt-0.5">
                            {items.join(", ")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Medications summary */}
              {medications.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-5 mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Pill className="w-3.5 h-3.5 text-primary" />
                    Your medications
                  </h3>
                  {medications.map((med) => (
                    <div key={med.id} className="mb-2 last:mb-0">
                      <p className="text-sm text-foreground font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {med.frequency}
                        {med.mealTimes.length > 0 && ` · ${med.mealTimes.join(", ")}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Ring chart */}
              <div className="bg-card rounded-2xl border border-border p-6 mb-2 flex flex-col items-center">
                <DualRingChart
                  nutrients={summaryNutrients}
                  size={180}
                  className="mb-4"
                />
                <p className="text-xs text-muted-foreground text-center italic">
                  Based on general guidelines for{" "}
                  {condition ? `someone managing ${condition}` : "your condition"}
                </p>
              </div>

              {/* Nutrient bars */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-6">
                {summaryNutrients.map((n) => {
                  const pct = Math.min(n.actual / n.target, 1);
                  return (
                    <div key={n.name} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">{n.name}</span>
                        <span className="text-muted-foreground">
                          {n.actual}{n.unit} / {n.target}{n.unit}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: n.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Written summary */}
              <div className="bg-nomi-blue-soft rounded-2xl border border-primary/20 p-5 mb-8">
                <p className="text-sm text-foreground leading-relaxed">
                  {getSummary(condition)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  variant="outline"
                  className="w-full h-14 text-base font-semibold rounded-xl border-border gap-2"
                  onClick={() => {}}
                >
                  <Download className="w-5 h-5" />
                  Download my summary as PDF
                </Button>
                <Button
                  className="w-full h-14 text-base font-semibold rounded-xl bg-primary text-primary-foreground gap-2"
                  onClick={() => {}}
                >
                  <ExternalLink className="w-5 h-5" />
                  Continue on the NHS App
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Your diary has already been saved — open the NHS App to find
                NOMI and your history will be waiting for you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OneTimeVisit;
