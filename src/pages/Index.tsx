import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import HomeButton from "@/components/HomeButton";
import TodayScreen from "@/screens/TodayScreen";
import LogScreen from "@/screens/LogScreen";
import CalendarScreen from "@/screens/CalendarScreen";
import ProgressScreen from "@/screens/ProgressScreen";
import ProfileScreen from "@/screens/ProfileScreen";

const screens: Record<string, React.FC> = {
  today: TodayScreen,
  log: LogScreen,
  calendar: CalendarScreen,
  progress: ProgressScreen,
  profile: ProfileScreen,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("today");
  const Screen = screens[activeTab] || TodayScreen;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <HomeButton />
      <Screen />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
