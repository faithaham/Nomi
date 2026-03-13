import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Home, Camera, X, Download, ExternalLink } from "lucide-react";
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

const MEAL_SECTIONS = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;

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
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [condition, setCondition] = useState("");
  const [restrictions, setRestrictions] = useState<string[]>([]);

  // Food diary state
  const [meals, setMeals] = useState<Record<string, string[]>>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
  const [searchInputs, setSearchInputs] = useState<Record<string, string>>({
    Breakfast: "",
    Lunch: "",
    Dinner: "",
    Snacks: "",
  });

  const toggleRestriction = (r: string) => {
    setRestrictions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
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

  const totalItems = Object.values(meals).flat().length;

  // Summary nutrients (demo data)
  const summaryNutrients = [
    { name: "Carbs", target: 250, actual: 180, unit: "g", color: "hsl(var(--nutrient-carbs))" },
    { name: "Protein", target: 80, actual: 62, unit: "g", color: "hsl(var(--nutrient-protein))" },
    { name: "Fat", target: 65, actual: 45, unit: "g", color: "hsl(var(--nutrient-fat))" },
    { name: "Fibre", target: 30, actual: 14, unit: "g", color: "hsl(var(--nutrient-fibre))" },
    { name: "Sugar", target: 50, actual: 32, unit: "g", color: "hsl(var(--nutrient-sugar))" },
  ];

  const ProgressIndicator = ({ current }: { current: number }) => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
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
          {s < 3 && (
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
                  Log your meals today —<br />no account needed
                </motion.h1>

                <motion.p
                  className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-12 leading-relaxed"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  Your GP or dietitian has asked you to keep a food diary. Fill
                  in what you eat today and we'll generate a simple summary you
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

          {/* PAGE 3 — FOOD DIARY */}
          {step === 2 && (
            <motion.div key="diary" {...fadeUp}>
              <TopBar />
              <ProgressIndicator current={2} />

              <h2 className="text-2xl font-bold text-foreground mb-2">
                What did you eat today?
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Add items to each meal. Don't worry about being exact.
              </p>

              <div className="space-y-8">
                {MEAL_SECTIONS.map((section) => (
                  <div key={section}>
                    <h3 className="text-base font-semibold text-foreground mb-3">
                      {section}
                    </h3>

                    <div className="flex gap-2 mb-3">
                      <Input
                        value={searchInputs[section]}
                        onChange={(e) =>
                          setSearchInputs((prev) => ({
                            ...prev,
                            [section]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && addFoodItem(section)
                        }
                        placeholder={`Search for a food item...`}
                        className="h-11 rounded-xl bg-card border-border flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-xl border-border shrink-0"
                        onClick={() => {}}
                      >
                        <Camera className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>

                    {meals[section].length > 0 && (
                      <div className="flex flex-wrap gap-2">
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
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button
                  onClick={() => setStep(3)}
                  disabled={false}
                  className="w-full h-14 text-base font-semibold rounded-xl"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {/* PAGE 4 — SUMMARY */}
          {step === 3 && (
            <motion.div key="summary" {...fadeUp}>
              <TopBar />
              <ProgressIndicator current={3} />

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Your summary{firstName ? `, ${firstName}` : ""}
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Here's an overview of what you logged today.
              </p>

              {/* Logged items */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  What you logged
                </h3>
                {MEAL_SECTIONS.map(
                  (section) =>
                    meals[section].length > 0 && (
                      <div key={section} className="mb-3 last:mb-0">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {section}
                        </span>
                        <p className="text-sm text-foreground mt-0.5">
                          {meals[section].join(", ")}
                        </p>
                      </div>
                    )
                )}
              </div>

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
