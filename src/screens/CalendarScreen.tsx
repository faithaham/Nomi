import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Mock data: day of month -> RAG score (0-1)
const mockData: Record<number, number> = {
  1: 0.9, 2: 0.7, 3: 0.85, 4: 0.4, 5: 0.95, 6: 0.6, 7: 0.3,
  8: 0.8, 9: 0.75, 10: 0.5, 11: 0.92, 12: 0.65,
};

const getRagClass = (score: number) => {
  if (score >= 0.8) return "bg-rag-green";
  if (score >= 0.5) return "bg-rag-amber";
  return "bg-rag-red";
};

const CalendarScreen = () => {
  const [currentDate] = useState(new Date());
  const month = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const today = currentDate.getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-4">Calendar</h1>
      </motion.div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 rounded-lg bg-secondary">
          <ChevronLeft className="w-4 h-4 text-secondary-foreground" />
        </button>
        <span className="font-semibold text-foreground">{month}</span>
        <button className="p-2 rounded-lg bg-secondary">
          <ChevronRight className="w-4 h-4 text-secondary-foreground" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {daysOfWeek.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <motion.div
        className="grid grid-cols-7 gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const score = mockData[day];
          const isToday = day === today;

          return (
            <button
              key={day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                isToday
                  ? "ring-2 ring-primary font-bold text-primary"
                  : "text-foreground"
              } ${day > today ? "opacity-30" : ""}`}
            >
              <span className="text-xs">{day}</span>
              {score !== undefined && (
                <div className={`w-3 h-3 rounded-full mt-0.5 ${getRagClass(score)}`} />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {[
          { label: "On track", cls: "bg-rag-green" },
          { label: "Partial", cls: "bg-rag-amber" },
          { label: "Low", cls: "bg-rag-red" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${item.cls}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarScreen;
