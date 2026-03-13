import { Clock, UtensilsCrossed } from "lucide-react";

interface MealEntry {
  name: string;
  time: string;
  type: string;
  calories: number;
  photoUrl?: string;
}

interface RecentlyLoggedProps {
  meal: MealEntry;
}

const RecentlyLogged = ({ meal }: RecentlyLoggedProps) => {
  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Recently logged
        </span>
      </div>
      <div className="flex items-center gap-3">
        {meal.photoUrl ? (
          <img
            src={meal.photoUrl}
            alt={meal.name}
            className="w-14 h-14 rounded-lg object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{meal.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-primary font-medium bg-nomi-blue-soft px-2 py-0.5 rounded-full">
              {meal.type}
            </span>
            <span className="text-xs text-muted-foreground">{meal.time}</span>
          </div>
        </div>
        <span className="text-sm font-semibold text-foreground">{meal.calories} kcal</span>
      </div>
    </div>
  );
};

export default RecentlyLogged;
