import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserRound, Stethoscope, User } from "lucide-react";

const cards = [
  {
    id: "one-time",
    icon: UserRound,
    label: "One Time Visit",
    subtitle: "Log your meals without an account",
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
    label: "Patient App",
    subtitle: "Your full personalised nutrition journey",
    route: "/patient",
    colorClass: "bg-nomi-green-soft text-foreground border-nomi-green/30",
    iconColor: "text-nomi-green",
  },
];

const BreadTagLogo = () => {
  const now = new Date();
  const day = now.getDate().toString();
  const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();

  return (
    <svg width="120" height="130" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="topHalf">
          <rect x="0" y="0" width="120" height="58" />
        </clipPath>
        <clipPath id="bottomHalf">
          <rect x="0" y="58" width="120" height="72" />
        </clipPath>
      </defs>

      {/* Bottom half grey */}
      <path
        d="M18 6 C16 3, 20 2, 24 3 Q30 1, 38 2 Q50 0, 62 1 Q74 0, 82 2 Q90 1, 96 3 C100 2, 103 5, 102 8 Q104 18, 103 30 Q104 42, 102 52 Q104 62, 103 72 Q104 82, 102 90 C103 94, 100 97, 96 98 Q88 100, 78 98 L72 98 Q68 99, 65 106 C63 112, 61 118, 60 120 C59 118, 57 112, 55 106 Q52 99, 48 98 L42 98 Q32 100, 24 98 C20 97, 17 94, 18 90 Q16 82, 17 72 Q16 62, 17 52 Q16 42, 17 30 Q16 18, 18 6 Z"
        fill="hsl(210, 10%, 82%)"
        clipPath="url(#bottomHalf)"
      />
      {/* Top half white */}
      <path
        d="M18 6 C16 3, 20 2, 24 3 Q30 1, 38 2 Q50 0, 62 1 Q74 0, 82 2 Q90 1, 96 3 C100 2, 103 5, 102 8 Q104 18, 103 30 Q104 42, 102 52 Q104 62, 103 72 Q104 82, 102 90 C103 94, 100 97, 96 98 Q88 100, 78 98 L72 98 Q68 99, 65 106 C63 112, 61 118, 60 120 C59 118, 57 112, 55 106 Q52 99, 48 98 L42 98 Q32 100, 24 98 C20 97, 17 94, 18 90 Q16 82, 17 72 Q16 62, 17 52 Q16 42, 17 30 Q16 18, 18 6 Z"
        fill="white"
        clipPath="url(#topHalf)"
      />

      {/* Thick doodle outline */}
      <path
        d="M18 6 C16 3, 20 2, 24 3 Q30 1, 38 2 Q50 0, 62 1 Q74 0, 82 2 Q90 1, 96 3 C100 2, 103 5, 102 8 Q104 18, 103 30 Q104 42, 102 52 Q104 62, 103 72 Q104 82, 102 90 C103 94, 100 97, 96 98 Q88 100, 78 98 L72 98 Q68 99, 65 106 C63 112, 61 118, 60 120 C59 118, 57 112, 55 106 Q52 99, 48 98 L42 98 Q32 100, 24 98 C20 97, 17 94, 18 90 Q16 82, 17 72 Q16 62, 17 52 Q16 42, 17 30 Q16 18, 18 6 Z"
        fill="none"
        stroke="hsl(215, 25%, 15%)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Notch / bite on right */}
      <path
        d="M102 32 C110 38, 110 50, 102 56"
        fill="hsl(210, 20%, 98%)"
        stroke="hsl(215, 25%, 15%)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Two wonky holes */}
      <ellipse cx="38" cy="22" rx="5" ry="4" fill="none" stroke="hsl(215, 25%, 15%)" strokeWidth="3" transform="rotate(-8, 38, 22)" />
      <ellipse cx="62" cy="22" rx="5" ry="4" fill="none" stroke="hsl(215, 25%, 15%)" strokeWidth="3" transform="rotate(6, 62, 22)" />

      {/* Date text */}
      <text
        x="58"
        y="78"
        textAnchor="middle"
        fontFamily="'DM Sans', system-ui, sans-serif"
        fontWeight="800"
        fontSize="28"
        fill="hsl(215, 25%, 15%)"
      >
        {day}
      </text>
      <text
        x="58"
        y="96"
        textAnchor="middle"
        fontFamily="'DM Sans', system-ui, sans-serif"
        fontWeight="700"
        fontSize="16"
        letterSpacing="2"
        fill="hsl(215, 25%, 15%)"
      >
        {month}
      </text>
    </svg>
  );
};

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

      {/* Logo Unit: Bread Tag + NOMI + Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-10 flex flex-col items-center gap-4"
      >
        <BreadTagLogo />
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: "hsl(215, 50%, 22%)" }}>
          NOMI
        </h1>
        <p className="text-muted-foreground text-sm -mt-2">
          Nutrition. Organised. Made Intuitive.
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
