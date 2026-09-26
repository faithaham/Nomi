import { motion } from "framer-motion";
import { Bell, ChevronRight, Shield, User, Stethoscope, Link2 } from "lucide-react";

const ProfileScreen = () => {
  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* User info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Sarah Johnson</h1>
            <p className="text-sm text-muted-foreground">Cystic Fibrosis — Nutrition Management</p>
          </div>
        </div>
      </motion.div>

      {/* NHS connection */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4 mb-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link2 className="w-5 h-5 text-nomi-green" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">NHS Login</p>
          <p className="text-xs text-nomi-green font-medium">Connected</p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-nomi-green" />
      </motion.div>

      {/* Dietitian */}
      <motion.div
        className="bg-card rounded-lg border border-border p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nomi-blue-soft flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
             <p className="text-sm font-medium text-foreground"><p className="text-sm font-medium text-foreground">Faith Ahamefula</p></p>
             <p className="text-xs text-muted-foreground">Registered Dietitian</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </motion.div>

      {/* Menu items */}
      <motion.div
        className="bg-card rounded-lg border border-border divide-y divide-border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { icon: Stethoscope, label: "Nutrition Guidance", sub: "Personalised by your dietitian" },
          { icon: Bell, label: "Notifications", sub: "Meal reminders, dietitian messages" },
          { icon: Shield, label: "Privacy & Data Sharing", sub: "How your data is shared with NHS" },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 p-4 text-left transition-colors"
          >
            <item.icon className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default ProfileScreen;
