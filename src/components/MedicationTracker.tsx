import { motion } from "framer-motion";
import { Check, Clock, Pill, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Medication {
  id: string;
  name: string;
  dose: string;
  time: string;
  taken: boolean;
}

const initialMeds: Medication[] = [
  { id: "1", name: "Metformin", dose: "500 mg", time: "Breakfast", taken: true },
  { id: "2", name: "Metformin", dose: "500 mg", time: "Dinner", taken: false },
  { id: "3", name: "Vitamin D", dose: "1000 IU", time: "Morning", taken: true },
  { id: "4", name: "Iron Supplement", dose: "65 mg", time: "Afternoon", taken: false },
];

const MedicationTracker = () => {
  const [medications, setMedications] = useState(initialMeds);
  const takenCount = medications.filter((m) => m.taken).length;
  const missed = medications.filter((m) => !m.taken).length;

  const toggleMed = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Medication
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {takenCount}/{medications.length} taken
        </span>
      </div>

      {missed > 0 && (
        <div className="flex items-center gap-2 mb-3 px-2.5 py-2 rounded-lg bg-nomi-yellow-soft border border-accent/20">
          <AlertTriangle className="w-3.5 h-3.5 text-nomi-amber flex-shrink-0" />
          <span className="text-xs text-nomi-amber font-medium">
            {missed} medication{missed > 1 ? "s" : ""} not logged today
          </span>
        </div>
      )}

      <div className="space-y-2">
        {medications.map((med, i) => (
          <motion.button
            key={med.id}
            onClick={() => toggleMed(med.id)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
              med.taken
                ? "bg-nomi-green-soft"
                : "bg-nomi-yellow-soft/50"
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  med.taken
                    ? "bg-nomi-green border-nomi-green"
                    : "border-nomi-amber"
              }`}
            >
              {med.taken && <Check className="w-3 h-3 text-log-action-foreground" />}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className={`text-sm font-medium ${med.taken ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {med.name} — {med.dose}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{med.time}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MedicationTracker;
