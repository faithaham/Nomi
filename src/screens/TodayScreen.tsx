import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import DualRingChart from "@/components/DualRingChart";
import NutrientBar from "@/components/NutrientBar";
import RecentlyLogged from "@/components/RecentlyLogged";
import NomiIntelligence from "@/components/NomiIntelligence";

const nutrients = [
 { name: "Carbohydrates", guide: 250, actual: 162, unit: "g", color: "hsl(var(--nutrient-carbs))" },
 { name: "Protein", guide: 80, actual: 34, unit: "g", color: "hsl(var(--nutrient-protein))" },
 { name: "Fat", guide: 65, actual: 41, unit: "g", color: "hsl(var(--nutrient-fat))" },
 { name: "Fibre", guide: 30, actual: 9, unit: "g", color: "hsl(var(--nutrient-fibre))" },
 { name: "Sugar", guide: 50, actual: 28, unit: "g", color: "hsl(var(--nutrient-sugar))" }];

// Which meals and ingredients today contributed to each nutrient
const contributions: Record<string, { meal: string; time: string; items: { food: string; amount: number }[] }[]> = {
  Carbohydrates: [
  { meal: "Breakfast", time: "08:10", items: [{ food: "Porridge with whole milk", amount: 48 }, { food: "Banana", amount: 24 }] },
  { meal: "Morning snack", time: "10:30", items: [{ food: "Flapjack", amount: 28 }] },
  { meal: "Lunch", time: "12:48", items: [{ food: "Chicken & mayo sandwich", amount: 38 }, { food: "Crisps", amount: 14 }, { food: "Orange juice", amount: 10 }] }],

  Protein: [
  { meal: "Breakfast", time: "08:10", items: [{ food: "Porridge with whole milk", amount: 9 }] },
  { meal: "Lunch", time: "12:48", items: [{ food: "Chicken & mayo sandwich", amount: 23 }, { food: "Crisps", amount: 2 }] }],

  Fat: [
  { meal: "Breakfast", time: "08:10", items: [{ food: "Porridge with whole milk", amount: 11 }] },
  { meal: "Morning snack", time: "10:30", items: [{ food: "Flapjack", amount: 9 }] },
  { meal: "Lunch", time: "12:48", items: [{ food: "Chicken & mayo sandwich", amount: 15 }, { food: "Crisps", amount: 6 }] }],

  Fibre: [
  { meal: "Breakfast", time: "08:10", items: [{ food: "Porridge with whole milk", amount: 4 }, { food: "Banana", amount: 2 }] },
  { meal: "Lunch", time: "12:48", items: [{ food: "Chicken & mayo sandwich", amount: 3 }] }],

  Sugar: [
  { meal: "Breakfast", time: "08:10", items: [{ food: "Banana", amount: 12 }] },
  { meal: "Morning snack", time: "10:30", items: [{ food: "Flapjack", amount: 7 }] },
  { meal: "Lunch", time: "12:48", items: [{ food: "Orange juice", amount: 9 }] }]

};



const recentMeal = {
  name: "Sandwich, crisps & orange juice",
  time: "12:48 PM",
  type: "Lunch",
  calories: 685
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const TodayScreen = () => {
  const [creonResponse, setCreonResponse] = useState<string | null>(null);
  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        
        <p className="text-muted-foreground text-sm">{getGreeting()}</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sarah</h1>
      </motion.div>

      {/* NOMI Gentle Prompt — Enzyme not logged */}
      <motion.div
        className="mt-4 bg-nomi-yellow-soft border border-accent/30 rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}>
        
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-nomi-amber flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Creon (enzyme replacement) not logged</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              NOMI has noticed that enzyme replacement has not been logged with lunch. Please let NOMI know what happened — this helps your care team support you better.
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
          "I forgot to take them",
          "I took them but forgot to log"].
          map((option) =>
          <button
            key={option}
            onClick={() => setCreonResponse(option)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            creonResponse === option ?
            "bg-primary text-primary-foreground border-primary" :
            "bg-background border-border text-foreground hover:bg-muted"}`
            }>
            
              {option}
            </button>
          )}
          <button
            onClick={() => setCreonResponse(creonResponse === "__other__" ? null : "__other__")}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            creonResponse === "__other__" || creonResponse && !["I forgot to take them", "I took them but forgot to log", null].includes(creonResponse) ?
            "bg-primary text-primary-foreground border-primary" :
            "bg-background border-border text-foreground hover:bg-muted"}`
            }>
            
            Other
          </button>
        </div>

        {(creonResponse === "__other__" || creonResponse && !["I forgot to take them", "I took them but forgot to log", null, "__other__"].includes(creonResponse)) &&
        <div className="mt-2">
            <input
            type="text"
            placeholder="Tell us what happened…"
            className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={creonResponse === "__other__" ? "" : creonResponse || ""}
            onChange={(e) => setCreonResponse(e.target.value || "__other__")} />
          
          </div>
        }

        {creonResponse && creonResponse !== "__other__" &&
        <motion.div
          className="mt-3 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}>
          
            <button className="text-xs font-medium px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Submit
            </button>
          </motion.div>
        }
      </motion.div>

      {/* Ring Chart */}
      <motion.div
        className="flex justify-center mt-6 mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        
        <div className="text-center">
          <h2 className="text-sm font-semibold text-foreground mb-1">Today's dietary intake</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Tap a colour to see which meals and ingredients contributed to it.
          </p>
          <DualRingChart
            nutrients={nutrients}
            energyLogged={1840}
            size={240}
            selectedName={selectedNutrient}
            onSelect={(name) => setSelectedNutrient((prev) => prev === name ? null : name)} />
        </div>
      </motion.div>

      {/* Segment breakdown */}
      {selected &&
      <motion.div
        className="mb-6 bg-card border border-border rounded-xl p-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>
        
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selected.color }} />
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.actual}{selected.unit} logged · guide {selected.guide}{selected.unit}
                </p>
              </div>
            </div>
            <button
            onClick={() => setSelectedNutrient(null)}
            className="text-xs text-muted-foreground hover:text-foreground">
            Close
          </button>
          </div>

          <div className="mt-3 space-y-3">
            {(contributions[selected.name] || []).map((entry) =>
          <div key={entry.meal}>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-medium text-foreground">{entry.meal}</p>
                  <p className="text-xs text-muted-foreground">{entry.time}</p>
                </div>
                <ul className="mt-1 space-y-1">
                  {entry.items.map((item) =>
              <li key={item.food} className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.food}</span>
                      <span className="text-foreground font-medium">+{item.amount}{selected.unit}</span>
                    </li>
              )}
                </ul>
              </div>
          )}
            {!contributions[selected.name] &&
          <p className="text-xs text-muted-foreground">No meals logged for this nutrient yet today.</p>
          }
          </div>
        </motion.div>
      }

      {/* Nutrient breakdown */}
      <motion.div
        className="space-y-3 mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}>
        
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            From the meals logged today
          </h2>
          <p className="text-xs text-muted-foreground mt-1 normal-case">
            NOMI works out this breakdown from the meals and drinks Sarah has logged.
          </p>
        </div>
        {nutrients.map((n) =>
        <button
          key={n.name}
          onClick={() => setSelectedNutrient((prev) => prev === n.name ? null : n.name)}
          className="w-full text-left">
          <NutrientBar {...n} />
        </button>
        )}
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}>
        
        <RecentlyLogged meal={recentMeal} />
      </motion.div>

      {/* NOMI Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}>
        
        <NomiIntelligence />
      </motion.div>
    </div>);

};

export default TodayScreen;