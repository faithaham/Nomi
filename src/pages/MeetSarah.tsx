import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Home, Pill, Sparkles, Info, User, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import nomiLogo from "@/assets/nomi-logo.png";

const CONDITIONS = [
  "Cystic Fibrosis",
  "Diabetes Type 1",
  "Diabetes Type 2",
  "Coeliac Disease",
  "IBD (Crohn's / Colitis)",
  "IBS",
  "High Cholesterol",
  "Other",
];
const MEDICATIONS = ["Creon 25,000", "Creon 10,000", "Kaftrio", "Vitamin D 1000IU", "Omeprazole", "Insulin", "Metformin", "Iron supplement", "Calcium supplement"];
const TIMINGS = ["With breakfast, lunch and dinner", "With every meal", "Morning", "Evening", "Twice daily", "As needed"];

const STEPS = ["Patient details", "Medications", "Ready"];

const MeetSarah = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Sarah Johnson");
  const [age, setAge] = useState("32");
  const [condition, setCondition] = useState("Cystic Fibrosis");
  const [meds, setMeds] = useState([
    { name: "Creon 25,000", timing: "With breakfast, lunch and dinner" },
    { name: "Vitamin D 1000IU", timing: "Morning" },
  ]);
  const hasCreon = meds.some((m) => m.name.startsWith("Creon"));

  const updateMed = (i: number, key: "name" | "timing", v: string) =>
    setMeds((prev) => prev.map((m, idx) => (idx === i ? { ...m, [key]: v } : m)));

  const iconBtn = "w-9 h-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:shadow-md active:scale-95 transition-all";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          {step > 0 ? (
            <button onClick={() => setStep((s) => s - 1)} className={iconBtn} aria-label="Back">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : <div className="w-9" />}
          <img src={nomiLogo} alt="NOMI logo" className="h-8 w-auto" />
          <button onClick={() => navigate("/")} className={iconBtn} aria-label="Home">
            <Home className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2 mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-nomi-blue-soft text-primary">NHS Patient Demo</span>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mt-3">Meet Sarah</h1>
                <p className="text-sm text-muted-foreground mt-1">The patient whose day you'll follow through the demo.</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-12 rounded-xl" />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" className="mt-1.5 h-12 rounded-xl" />
                </div>
                <div>
                  <Label>Medical condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {condition === "Cystic Fibrosis" && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      In CF, thick mucus affects the pancreas, so enzymes and a higher-energy diet are essential to absorb nutrients.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-start p-3 rounded-xl bg-nomi-yellow-soft border border-accent/30">
                <Info className="w-4 h-4 text-nomi-amber mt-0.5 shrink-0" />
                <p className="text-xs text-foreground">In practice, this is configured by the dietitian before the patient ever opens the app.</p>
              </div>

              <Button onClick={() => setStep(1)} className="w-full h-12 rounded-xl">Continue</Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Sarah's medications</h1>
                <p className="text-sm text-muted-foreground mt-1">Set up by her dietitian and CF team.</p>
              </div>

              <div className="space-y-3">
                {meds.map((m, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-4 flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-xl bg-nomi-blue-soft flex items-center justify-center shrink-0">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 grid sm:grid-cols-2 gap-2">
                      <Select value={m.name} onValueChange={(v) => updateMed(i, "name", v)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{MEDICATIONS.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                      </Select>
                      <Select value={m.timing} onValueChange={(v) => updateMed(i, "timing", v)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{TIMINGS.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              {hasCreon && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-ai-card border border-primary/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">NOMI Intelligence</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    NOMI will remind Sarah to log her enzymes alongside every meal containing fat.
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-2">AI assisted — reviewed by dietitian.</p>
                </motion.div>
              )}

              <Button onClick={() => setStep(2)} className="w-full h-12 rounded-xl">Continue</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-10 space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{name.split(" ")[0] || "Sarah"} is ready</h1>
                <p className="text-base text-muted-foreground mt-3 max-w-sm mx-auto">
                  Sarah has been set up by her dietitian and is ready to start logging. See her day →
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <button onClick={() => navigate("/patient")} className="rounded-2xl border border-nomi-green/30 bg-nomi-green-soft p-5 flex items-center gap-3 text-left hover:shadow-md transition-all">
                  <User className="w-6 h-6 text-nomi-green" />
                  <span className="flex-1 font-semibold text-foreground">Patient Interface</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => navigate("/dietitian")} className="rounded-2xl border border-primary/30 bg-nomi-blue-soft p-5 flex items-center gap-3 text-left hover:shadow-md transition-all">
                  <Stethoscope className="w-6 h-6 text-primary" />
                  <span className="flex-1 font-semibold text-foreground">Dietitian Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MeetSarah;
