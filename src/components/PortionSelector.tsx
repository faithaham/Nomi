import { cn } from "@/lib/utils";

const PORTIONS = [
  { label: "0", value: 0 },
  { label: "¼", value: 0.25 },
  { label: "½", value: 0.5 },
  { label: "¾", value: 0.75 },
  { label: "All", value: 1 },
] as const;

interface PortionSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const PortionPie = ({ fraction, active }: { fraction: number; active: boolean }) => {
  const size = 32;
  const r = 12;
  const cx = size / 2;
  const cy = size / 2;

  if (fraction === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
          strokeWidth={1.5}
          opacity={active ? 1 : 0.4}
        />
      </svg>
    );
  }

  if (fraction === 1) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
          opacity={active ? 1 : 0.4}
        />
      </svg>
    );
  }

  const angle = fraction * 360;
  const rad = ((angle - 90) * Math.PI) / 180;
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
        strokeWidth={1.5}
        opacity={active ? 1 : 0.3}
      />
      <path
        d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y} Z`}
        fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
        opacity={active ? 1 : 0.4}
      />
    </svg>
  );
};

const PortionSelector = ({ value, onChange }: PortionSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      {PORTIONS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={cn(
            "flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all",
            value === p.value
              ? "bg-primary/10 ring-1 ring-primary/30"
              : "hover:bg-muted"
          )}
        >
          <PortionPie fraction={p.value} active={value === p.value} />
          <span
            className={cn(
              "text-[11px] font-medium",
              value === p.value ? "text-primary" : "text-muted-foreground"
            )}
          >
            {p.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PortionSelector;
