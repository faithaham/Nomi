import { motion } from "framer-motion";

export interface Nutrient {
  name: string;
  guide: number;
  actual: number;
  color: string;
  unit?: string;
}

interface DualRingChartProps {
  nutrients: Nutrient[];
  energyLogged: number;
  size?: number;
  className?: string;
  selectedName?: string | null;
  onSelect?: (name: string) => void;
  energySelected?: boolean;
  onEnergySelect?: () => void;
}

const DualRingChart = ({
  nutrients,
  energyLogged,
  size = 220,
  className = "",
  selectedName = null,
  onSelect,
  energySelected = false,
  onEnergySelect,
}: DualRingChartProps) => {
  const center = size / 2;
  const outerRadius = size / 2 - 8;
  const innerRadius = size / 2 - 32;
  const outerStroke = 16;
  const innerStroke = 14;

  // Each arc is an individual nutrient reading against the dietitian's guide.
  // The values are never added together into a combined clinical score.
  const buildSegments = (items: Nutrient[], radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const slot = circumference / items.length;
    const slotGap = 7;

    return items.map((item, index) => ({
      ...item,
      radius,
      circumference,
      slotLength: Math.max(0, slot - slotGap),
      dashLength: Math.max(0, (slot - slotGap) * Math.min(item.actual / item.guide, 1)),
      offset: -(index * slot),
    }));
  };

  const outerSegments = buildSegments(nutrients.slice(0, 3), outerRadius);
  const innerSegments = buildSegments(nutrients.slice(3), innerRadius);
  const allSegments = [...outerSegments, ...innerSegments];
  const selected = nutrients.find((n) => n.name === selectedName) || null;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background rings */}
        <circle
          cx={center} cy={center} r={outerRadius}
          fill="none" stroke="hsl(var(--border))" strokeWidth={outerStroke}
          opacity={0.5} />

        <circle
          cx={center} cy={center} r={innerRadius}
          fill="none" stroke="hsl(var(--border))" strokeWidth={innerStroke}
          opacity={0.3} />

        {allSegments.map((seg, i) => {
          const stroke = seg.radius === outerRadius ? outerStroke : innerStroke;
          const isSelected = selectedName === seg.name;
          const dimmed = selectedName !== null && !isSelected;
          return (
            <g key={seg.name}>
              <motion.circle
                cx={center} cy={center} r={seg.radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isSelected ? stroke + 3 : stroke}
                strokeDasharray={`${seg.dashLength} ${seg.circumference - seg.dashLength}`}
                strokeDashoffset={seg.offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: dimmed ? 0.3 : isSelected ? 1 : 0.85 }}
                transition={{ delay: i * 0.1, duration: 0.5 }} />

              {onSelect &&
              <circle
                cx={center} cy={center} r={seg.radius}
                fill="none"
                stroke="transparent"
                strokeWidth={stroke + 10}
                strokeDasharray={`${seg.slotLength} ${seg.circumference - seg.slotLength}`}
                strokeDashoffset={seg.offset}
                transform={`rotate(-90 ${center} ${center})`}
                style={{ cursor: "pointer", pointerEvents: "stroke" }}
                onClick={() => onSelect(seg.name)} />
              }
            </g>);

        })}

      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">
        {selected ?
        <>
            <span className="text-center text-xs text-muted-foreground">{selected.name}</span>
            <span className="font-bold text-foreground text-base">
              {selected.actual}{selected.unit ?? "g"}
            </span>
            <span className="text-center text-xs text-muted-foreground">
              guide {selected.guide}{selected.unit ?? "g"}
            </span>
          </> :

        onEnergySelect ?
        <button
          type="button"
          aria-pressed={energySelected}
          aria-label="Show where today's calories came from"
          onClick={onEnergySelect}
          className={`pointer-events-auto rounded-lg px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          energySelected ? "bg-primary/10" : "hover:bg-muted"}`}
        >
            <motion.span
            className="block font-bold text-foreground text-base px-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}>

              {energyLogged.toLocaleString("en-GB")} kcal
            </motion.span>
            <span className="block text-center text-xs text-muted-foreground">logged today</span>
          </button> :

        <>
            <motion.span
            className="font-bold text-foreground text-base px-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}>

              {energyLogged.toLocaleString("en-GB")} kcal
            </motion.span>
            <span className="text-center text-xs text-muted-foreground">logged today</span>
          </>
        }
      </div>
    </div>);

};

export default DualRingChart;
