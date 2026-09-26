import { motion } from "framer-motion";

interface Nutrient {
  name: string;
  guide: number;
  actual: number;
  color: string;
}

interface DualRingChartProps {
  nutrients: Nutrient[];
  energyLogged: number;
  size?: number;
  className?: string;
}

const DualRingChart = ({ nutrients, energyLogged, size = 220, className = "" }: DualRingChartProps) => {
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
      dashLength: Math.max(0, (slot - slotGap) * Math.min(item.actual / item.guide, 1)),
      offset: -(index * slot),
    }));
  };

  const outerSegments = buildSegments(nutrients.slice(0, 3), outerRadius);
  const innerSegments = buildSegments(nutrients.slice(3), innerRadius);

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
        

        {[...outerSegments, ...innerSegments].map((seg, i) =>
        <motion.circle
          key={seg.name}
          cx={center} cy={center} r={seg.radius}
          fill="none"
          stroke={seg.color}
          strokeWidth={seg.radius === outerRadius ? outerStroke : innerStroke}
          strokeDasharray={`${seg.dashLength} ${seg.circumference - seg.dashLength}`}
          strokeDashoffset={seg.offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: i * 0.1, duration: 0.5 }} />

        )}
        
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-bold text-foreground text-base px-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}>
          
          {energyLogged.toLocaleString("en-GB")} kcal
        </motion.span>
        <span className="text-center text-xs text-muted-foreground">logged today</span>
      </div>
    </div>);

};

export default DualRingChart;