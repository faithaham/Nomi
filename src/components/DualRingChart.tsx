import { motion } from "framer-motion";

interface Nutrient {
  name: string;
  target: number;
  actual: number;
  color: string;
}

interface DualRingChartProps {
  nutrients: Nutrient[];
  size?: number;
  className?: string;
}

const DualRingChart = ({ nutrients, size = 220, className = "" }: DualRingChartProps) => {
  const center = size / 2;
  const outerRadius = size / 2 - 8;
  const innerRadius = size / 2 - 32;
  const outerStroke = 16;
  const innerStroke = 14;

  const totalTarget = nutrients.reduce((sum, n) => sum + n.target, 0);
  const totalActual = nutrients.reduce((sum, n) => sum + n.actual, 0);
  const overallPercent = Math.min(totalActual / totalTarget, 1);

  // RAG color for outer ring
  const getRagColor = (pct: number) => {
    if (pct >= 0.8) return "hsl(var(--rag-green))";
    if (pct >= 0.5) return "hsl(var(--rag-amber))";
    return "hsl(var(--rag-red))";
  };

  // Inner ring: nutrient segments
  const innerCircumference = 2 * Math.PI * innerRadius;
  let cumulativeOffset = 0;
  const segments = nutrients.map((n) => {
    const fraction = n.target / totalTarget;
    const dashLength = fraction * innerCircumference;
    const gap = innerCircumference - dashLength;
    const offset = -cumulativeOffset;
    cumulativeOffset += dashLength;
    return { ...n, dashLength, gap, offset };
  });

  // Outer ring
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerDash = overallPercent * outerCircumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background rings */}
        <circle
          cx={center} cy={center} r={outerRadius}
          fill="none" stroke="hsl(var(--border))" strokeWidth={outerStroke}
          opacity={0.5}
        />
        <circle
          cx={center} cy={center} r={innerRadius}
          fill="none" stroke="hsl(var(--border))" strokeWidth={innerStroke}
          opacity={0.3}
        />

        {/* Inner ring segments (target proportions) */}
        {segments.map((seg, i) => (
          <motion.circle
            key={seg.name}
            cx={center} cy={center} r={innerRadius}
            fill="none"
            stroke={seg.color}
            strokeWidth={innerStroke}
            strokeDasharray={`${seg.dashLength} ${seg.gap}`}
            strokeDashoffset={seg.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${center} ${center})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          />
        ))}

        {/* Outer ring (progress fill) */}
        <motion.circle
          cx={center} cy={center} r={outerRadius}
          fill="none"
          stroke={getRagColor(overallPercent)}
          strokeWidth={outerStroke}
          strokeDasharray={`${outerDash} ${outerCircumference - outerDash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          initial={{ strokeDasharray: `0 ${outerCircumference}` }}
          animate={{ strokeDasharray: `${outerDash} ${outerCircumference - outerDash}` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {Math.round(overallPercent * 100)}%
        </motion.span>
        <span className="text-xs text-muted-foreground">of daily target</span>
      </div>
    </div>
  );
};

export default DualRingChart;
