import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserRound, Stethoscope, User } from "lucide-react";

const cards = [
  {
    id: "one-time",
    icon: UserRound,
    label: "Generate a Food Diary",
    subtitle: "Log your day of eating",
    route: "/one-time",
    colorClass: "bg-nomi-yellow-soft text-accent-foreground border-accent/30",
    iconColor: "text-accent",
  },
  {
    id: "dietitian",
    icon: Stethoscope,
    label: "Dietitian Dashboard",
    subtitle: "Professional patient management portal",
    route: "/dietitian",
    colorClass: "bg-nomi-blue-soft text-primary-foreground border-primary/30",
    iconColor: "text-primary",
  },
  {
    id: "patient",
    icon: User,
    label: "Patient Interface",
    subtitle: "Your full personalised nutrition journey",
    route: "/patient",
    colorClass: "bg-nomi-green-soft text-foreground border-nomi-green/30",
    iconColor: "text-nomi-green",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 max-w-lg mx-auto relative">
      {/* Demo Mode Pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute top-4 right-4"
      >
        <span className="text-[10px] font-medium tracking-wide uppercase px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
          Demo Mode
        </span>
      </motion.div>

      {/* App Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          NOMI
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Nutrition Optimisation. Made Intelligent.
        </p>
        <p className="text-muted-foreground text-xs mt-3 max-w-xs mx-auto leading-relaxed">
          A smart nutrition companion for patients and their dietitians — tracking meals, medication and clinical insights in real time across any condition where nutrition matters.
        </p>
      </motion.div>

      {/* Card Buttons */}
      <div className="w-full flex flex-col gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.15 }}
              onClick={() => navigate(card.route)}
              className={`w-full rounded-2xl border p-6 flex items-center gap-5 text-left transition-all active:scale-[0.98] hover:shadow-md ${card.colorClass}`}
            >
              <div className="w-14 h-14 rounded-xl bg-background/70 flex items-center justify-center shrink-0 shadow-sm">
                <Icon className={`w-7 h-7 ${card.iconColor}`} />
              </div>
              <div>
                <span className="text-base font-semibold text-foreground block">
                  {card.label}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 block">
                  {card.subtitle}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Landing;
