import { motion } from "framer-motion";

interface NutrientBarProps {
  name: string;
  actual: number;
  target: number;
  unit: string;
  color: string;
}

const NutrientBar = ({ name, actual, target, unit, color }: NutrientBarProps) => {
  const pct = Math.min(actual / target, 1);

  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">
            {actual}{unit} / {target}{unit}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
};

export default NutrientBar;
