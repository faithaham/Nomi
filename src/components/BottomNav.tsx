import { Fragment } from "react";
import { Home, Plus, Calendar, ClipboardList, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "today", icon: Home, label: "Today" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "summary", icon: ClipboardList, label: "Summary" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
];

const logTab = { id: "log", icon: Plus, label: "Log" };

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav aria-label="Patient navigation" className="fixed bottom-0 left-0 right-0 bg-nav-bg border-t border-border safe-bottom z-50">
      <div className="relative grid grid-cols-5 items-end max-w-lg mx-auto px-2 pt-1 pb-2">
        {/* Centred Log action button */}
        <Button
          variant="ghost"
          aria-label="Log"
          aria-current={activeTab === "log" ? "page" : undefined}
          onClick={() => onTabChange(logTab.id)}
          className="absolute left-1/2 -translate-x-1/2 -top-5 h-auto p-0 gap-0 flex flex-col items-center z-10 hover:bg-transparent"
        >
          <div className="w-14 h-14 rounded-full bg-log-action flex items-center justify-center shadow-lg shadow-nomi-green/30 transition-transform active:scale-95">
            <Plus className="!w-7 !h-7 text-log-action-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] mt-0.5 font-medium text-muted-foreground">
            {logTab.label}
          </span>
        </Button>

        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <Fragment key={tab.id}>
              {/* Equal-width spacer keeps the centre clear for the Log button */}
              {index === 2 && <div aria-hidden="true" />}
              <Button
                variant="ghost"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onTabChange(tab.id)}
                className="min-w-0 h-12 px-0 gap-0 flex flex-col items-center justify-center py-1 hover:bg-muted"
              >
                <Icon
                  className={`!w-5 !h-5 transition-colors ${
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
              </Button>
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
