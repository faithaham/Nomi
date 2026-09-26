import { Home, Plus, Calendar, ClipboardList, User, MessageSquare } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "today", icon: Home, label: "Today" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "log", icon: Plus, label: "Log", isAction: true },
  { id: "summary", icon: ClipboardList, label: "Summary" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
  { id: "profile", icon: User, label: "Profile" },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-nav-bg border-t border-border safe-bottom z-50">
      <div className="flex items-end justify-around px-2 pt-1 pb-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center -mt-4"
              >
                <div className="w-14 h-14 rounded-full bg-log-action flex items-center justify-center shadow-lg shadow-nomi-green/30 transition-transform active:scale-95">
                  <Icon className="w-7 h-7 text-log-action-foreground" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center py-1 px-3 transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-nav-active" : "text-nav-inactive"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] mt-0.5 font-medium transition-colors ${
                  isActive ? "text-nav-active" : "text-nav-inactive"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
