import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import HomeButton from "@/components/HomeButton";
import TodayScreen from "@/screens/TodayScreen";
import LogScreen from "@/screens/LogScreen";
import CalendarScreen from "@/screens/CalendarScreen";
import SummaryScreen from "@/screens/SummaryScreen";
import ProfileScreen from "@/screens/ProfileScreen";

const Index = () => {
  const [activeTab, setActiveTab] = useState("today");

  const renderScreen = () => {
    switch (activeTab) {
      case "log":
        return <LogScreen />;
      case "calendar":
        return <CalendarScreen onNavigateToLog={() => setActiveTab("log")} />;
      case "summary":
        return <SummaryScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <TodayScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <HomeButton />
      {renderScreen()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
