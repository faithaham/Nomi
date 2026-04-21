import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type FlagSeverity = "red" | "amber";
export interface Flag {
  label: string;
  severity: FlagSeverity;
}

interface FlagsBadgeProps {
  flags: Flag[];
  align?: "start" | "center" | "end";
}

const severityRank: Record<FlagSeverity, number> = { red: 0, amber: 1 };

const FlagsBadge = ({ flags, align = "start" }: FlagsBadgeProps) => {
  if (flags.length === 0) {
    return <span className="text-xs text-nomi-green font-medium">All on track</span>;
  }

  const sorted = [...flags].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  const hasRed = sorted.some((f) => f.severity === "red");
  const colorClass = hasRed
    ? "bg-rag-red/15 text-rag-red ring-rag-red/30"
    : "bg-rag-amber/15 text-rag-amber ring-rag-amber/30";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label={`${flags.length} flag${flags.length === 1 ? "" : "s"}`}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ring-1 transition-transform hover:scale-105 active:scale-95 ${colorClass}`}
        >
          {flags.length}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-60 p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Flagged areas · by priority
        </p>
        <ul className="space-y-1.5">
          {sorted.map((f) => (
            <li key={f.label} className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  f.severity === "red" ? "bg-rag-red" : "bg-rag-amber"
                }`}
              />
              <span className="text-sm text-foreground">{f.label}</span>
              <span
                className={`ml-auto text-[10px] font-medium uppercase tracking-wide ${
                  f.severity === "red" ? "text-rag-red" : "text-rag-amber"
                }`}
              >
                {f.severity === "red" ? "High" : "Medium"}
              </span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default FlagsBadge;