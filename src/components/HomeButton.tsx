import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="fixed top-4 left-4 z-50 w-9 h-9 rounded-full bg-card border border-border shadow-sm flex items-center justify-center transition-all hover:shadow-md active:scale-95"
      aria-label="Back to home"
    >
      <Home className="w-4 h-4 text-muted-foreground" />
    </button>
  );
};

export default HomeButton;
