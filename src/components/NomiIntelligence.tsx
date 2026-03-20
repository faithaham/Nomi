import { Lightbulb } from "lucide-react";

const NomiIntelligence = () => {
  return (
    <div className="bg-ai-card rounded-xl p-4 border border-primary/15">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          NOMI Intelligence
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        NOMI has noticed that a <span className="font-semibold">sandwich</span> was recently logged for lunch. NOMI suggests adding a slice of cheese for a source of fat and calcium. For further guidance, message your dietitian in the <span className="font-semibold text-primary">Messages</span> tab.
      </p>
    </div>
  );
};

export default NomiIntelligence;
