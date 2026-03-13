import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Search,
  MessageSquare,
  Settings,
  Bell,
  Home,
  ChevronRight,
  Eye,
  TrendingUp,
  Calendar,
  Send,
  X,
  ArrowLeft,
  Camera,
  Menu,
} from "lucide-react";
import DualRingChart from "@/components/DualRingChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Mock Data ──────────────────────────────────────────────

const mockPatients = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 34,
    condition: "Cystic Fibrosis",
    lastLogged: "Today",
    lastLoggedDays: 0,
    compliance: 72,
    alerts: true,
    nutrients: [
      { name: "Carbs", target: 250, actual: 162, unit: "g", color: "hsl(var(--nutrient-carbs))" },
      { name: "Protein", target: 80, actual: 34, unit: "g", color: "hsl(var(--nutrient-protein))" },
      { name: "Fat", target: 65, actual: 41, unit: "g", color: "hsl(var(--nutrient-fat))" },
      { name: "Fibre", target: 30, actual: 9, unit: "g", color: "hsl(var(--nutrient-fibre))" },
      { name: "Sugar", target: 50, actual: 28, unit: "g", color: "hsl(var(--nutrient-sugar))" },
      { name: "Creon", target: 3, actual: 0, unit: "", color: "hsl(var(--nomi-amber))" },
    ],
  },
  {
    id: 2,
    name: "James Carter",
    age: 52,
    condition: "Diabetes Type 2",
    lastLogged: "Yesterday",
    lastLoggedDays: 1,
    compliance: 72,
    alerts: false,
    nutrients: [
      { name: "Carbs", target: 200, actual: 130, unit: "g", color: "hsl(var(--nutrient-carbs))" },
      { name: "Protein", target: 90, actual: 70, unit: "g", color: "hsl(var(--nutrient-protein))" },
      { name: "Fat", target: 55, actual: 48, unit: "g", color: "hsl(var(--nutrient-fat))" },
      { name: "Fibre", target: 35, actual: 15, unit: "g", color: "hsl(var(--nutrient-fibre))" },
      { name: "Sugar", target: 45, actual: 30, unit: "g", color: "hsl(var(--nutrient-sugar))" },
      { name: "Medication", target: 3, actual: 2, unit: "", color: "hsl(var(--nomi-amber))" },
    ],
  },
  {
    id: 3,
    name: "Amara Osei",
    age: 28,
    condition: "Coeliac Disease",
    lastLogged: "3 days ago",
    lastLoggedDays: 3,
    compliance: 54,
    alerts: true,
    nutrients: [
      { name: "Carbs", target: 240, actual: 100, unit: "g", color: "hsl(var(--nutrient-carbs))" },
      { name: "Protein", target: 75, actual: 40, unit: "g", color: "hsl(var(--nutrient-protein))" },
      { name: "Fat", target: 60, actual: 55, unit: "g", color: "hsl(var(--nutrient-fat))" },
      { name: "Fibre", target: 28, actual: 10, unit: "g", color: "hsl(var(--nutrient-fibre))" },
      { name: "Sugar", target: 50, actual: 42, unit: "g", color: "hsl(var(--nutrient-sugar))" },
      { name: "Medication", target: 2, actual: 0, unit: "", color: "hsl(var(--nomi-amber))" },
    ],
  },
  {
    id: 4,
    name: "David Chen",
    age: 45,
    condition: "High Cholesterol",
    lastLogged: "5 days ago",
    lastLoggedDays: 5,
    compliance: 38,
    alerts: true,
    nutrients: [
      { name: "Carbs", target: 230, actual: 80, unit: "g", color: "hsl(var(--nutrient-carbs))" },
      { name: "Protein", target: 85, actual: 50, unit: "g", color: "hsl(var(--nutrient-protein))" },
      { name: "Fat", target: 50, actual: 45, unit: "g", color: "hsl(var(--nutrient-fat))" },
      { name: "Fibre", target: 30, actual: 8, unit: "g", color: "hsl(var(--nutrient-fibre))" },
      { name: "Sugar", target: 40, actual: 35, unit: "g", color: "hsl(var(--nutrient-sugar))" },
      { name: "Medication", target: 2, actual: 1, unit: "", color: "hsl(var(--nomi-amber))" },
    ],
  },
  {
    id: 5,
    name: "Emily Watson",
    age: 39,
    condition: "Diabetes Type 1",
    lastLogged: "Today",
    lastLoggedDays: 0,
    compliance: 93,
    alerts: false,
    nutrients: [
      { name: "Carbs", target: 220, actual: 210, unit: "g", color: "hsl(var(--nutrient-carbs))" },
      { name: "Protein", target: 80, actual: 78, unit: "g", color: "hsl(var(--nutrient-protein))" },
      { name: "Fat", target: 60, actual: 55, unit: "g", color: "hsl(var(--nutrient-fat))" },
      { name: "Fibre", target: 30, actual: 28, unit: "g", color: "hsl(var(--nutrient-fibre))" },
      { name: "Sugar", target: 45, actual: 20, unit: "g", color: "hsl(var(--nutrient-sugar))" },
      { name: "Medication", target: 4, actual: 4, unit: "", color: "hsl(var(--nomi-amber))" },
    ],
  },
];

const mockAlerts = [
  { id: 1, patientId: 1, patient: "Sarah Johnson", type: "Meal logged without medication — 3 occurrences this week", date: "13 Mar 2026", severity: "red" as const },
  { id: 2, patientId: 4, patient: "David Chen", type: "Not logged in 5 days", date: "11 Mar 2026", severity: "red" as const },
  { id: 3, patientId: 3, patient: "Amara Osei", type: "Not logged in 3 days", date: "12 Mar 2026", severity: "amber" as const },
  { id: 4, patientId: 1, patient: "Sarah Johnson", type: "Fibre consistently under 50%", date: "13 Mar 2026", severity: "amber" as const },
  { id: 5, patientId: 4, patient: "David Chen", type: "Sudden change in logging pattern", date: "10 Mar 2026", severity: "red" as const },
  { id: 6, patientId: 3, patient: "Amara Osei", type: "Protein consistently under 50%", date: "12 Mar 2026", severity: "amber" as const },
];

const mockMessages = [
  {
    patientId: 1,
    patient: "Sarah Johnson",
    preview: "Hi Sarah — I noticed you've had a few meals...",
    messages: [
      { from: "patient", text: "Hi, I logged my lunch but forgot to take my medication again. Sorry!", time: "12:50" },
      { from: "dietitian", text: "Hi Sarah — I noticed you've missed logging your medication a few times this week. Staying consistent really helps with your progress. Let me know if you need help with reminders! 💊", time: "13:15" },
      { from: "patient", text: "Thank you — I'll set a reminder on my phone. It's just easy to forget when I'm at work.", time: "13:22" },
      { from: "dietitian", text: "That's a great idea. You could also keep a small pack in your bag so it's always to hand. We'll review at your next appointment.", time: "13:30" },
    ],
  },
  {
    patientId: 2,
    patient: "James Carter",
    preview: "My blood sugar was a bit high yesterday...",
    messages: [
      { from: "patient", text: "My blood sugar was a bit high yesterday, should I adjust my carbs?", time: "14:20" },
      { from: "dietitian", text: "Let's look at your log — it seems like the evening snack may have been high GI. Try swapping for nuts or yoghurt.", time: "15:00" },
    ],
  },
  {
    patientId: 3,
    patient: "Amara Osei",
    preview: "I've been finding it hard to eat enough...",
    messages: [
      { from: "patient", text: "I've been finding it hard to eat enough protein without gluten. Any recommendations?", time: "08:00" },
    ],
  },
];

const weeklyTrend = [
  { day: "Mon", compliance: 82 },
  { day: "Tue", compliance: 78 },
  { day: "Wed", compliance: 85 },
  { day: "Thu", compliance: 70 },
  { day: "Fri", compliance: 90 },
  { day: "Sat", compliance: 65 },
  { day: "Sun", compliance: 88 },
];

const calendarDays = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  logged: Math.random() > 0.3,
  compliance: Math.floor(Math.random() * 60) + 40,
}));

// ── Sidebar ──────────────────────────────────────────────

type Page = "dashboard" | "patients" | "alerts" | "messages" | "settings" | "profile";

const sidebarItems: { id: Page; icon: typeof LayoutDashboard; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "patients", icon: Users, label: "Patients" },
  { id: "alerts", icon: AlertTriangle, label: "Alerts" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
  { id: "settings", icon: Settings, label: "Settings" },
];

// ── Main Component ────────────────────────────────────────

const DietitianDashboard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);
  const [selectedMessagePatient, setSelectedMessagePatient] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedCalDay, setSelectedCalDay] = useState<number | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openPatientProfile = (id: number) => {
    setSelectedPatientId(id);
    setPage("profile");
  };

  const activeAlerts = mockAlerts.filter((a) => !dismissedAlerts.includes(a.id));
  const selectedPatient = mockPatients.find((p) => p.id === selectedPatientId);

  const getLogColor = (days: number) => {
    if (days >= 4) return "text-rag-red font-semibold";
    if (days >= 2) return "text-rag-amber font-semibold";
    return "text-foreground";
  };

  // ── Render helpers ──

  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Patients", value: mockPatients.length, color: "text-primary" },
          { label: "Logged Today", value: mockPatients.filter((p) => p.lastLoggedDays === 0).length, color: "text-nomi-green" },
          { label: "Open Alerts", value: activeAlerts.length, color: "text-rag-red" },
          { label: "Avg Compliance", value: `${Math.round(mockPatients.reduce((s, p) => s + p.compliance, 0) / mockPatients.length)}%`, color: "text-primary" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-border">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Patient table */}
      <Card className="border-border">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base font-semibold text-foreground">Patient Overview</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Condition</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Today</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Last Logged</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Compliance</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Alert</th>
                  <th className="text-center p-3 font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {mockPatients.filter((p) => p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.condition.toLowerCase().includes(patientSearch.toLowerCase())).map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => openPatientProfile(p.id)}
                  >
                    <td className="p-3 font-medium text-foreground">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.condition}</td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <DualRingChart nutrients={p.nutrients} size={48} />
                      </div>
                    </td>
                    <td className={`p-3 ${getLogColor(p.lastLoggedDays)}`}>{p.lastLogged}</td>
                    <td className="p-3 text-center">
                      <span className={`font-semibold ${p.compliance >= 80 ? "text-nomi-green" : p.compliance >= 50 ? "text-nomi-amber" : "text-rag-red"}`}>
                        {p.compliance}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {p.alerts && <AlertTriangle className="w-4 h-4 text-rag-amber mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      <Button variant="ghost" size="sm" className="text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPatients = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-lg font-semibold text-foreground mb-4">All Patients</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockPatients.map((p) => (
          <Card
            key={p.id}
            className="border-border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openPatientProfile(p.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{p.name.split(" ").map((n) => n[0]).join("")}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.condition} · Age {p.age}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Compliance: <span className={`font-semibold ${p.compliance >= 80 ? "text-nomi-green" : p.compliance >= 50 ? "text-nomi-amber" : "text-rag-red"}`}>{p.compliance}%</span></span>
                <span className={getLogColor(p.lastLoggedDays)}>Last: {p.lastLogged}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderAlerts = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Active Alerts</h2>
      {activeAlerts.length === 0 ? (
        <Card className="border-border"><CardContent className="p-8 text-center text-muted-foreground">No active alerts — all patients on track.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {activeAlerts.map((a) => (
            <Card key={a.id} className={`border-l-4 ${a.severity === "red" ? "border-l-rag-red" : "border-l-rag-amber"} border-border`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${a.severity === "red" ? "text-rag-red" : "text-rag-amber"}`} />
                  <div>
                    <p className="font-medium text-foreground">{a.patient}</p>
                    <p className="text-sm text-muted-foreground">{a.type} · {a.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setDismissedAlerts([...dismissedAlerts, a.id])}>
                    Dismiss
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => openPatientProfile(a.patientId)}>
                    View Patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderMessages = () => {
    const convo = mockMessages[selectedMessagePatient];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-4 h-auto md:h-[calc(100vh-140px)]">
        {/* Patient list */}
        <div className="w-full md:w-72 md:shrink-0 border border-border rounded-lg overflow-hidden bg-card">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Conversations</p>
          </div>
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible">
            {mockMessages.map((m, i) => (
              <button
                key={m.patientId}
                onClick={() => setSelectedMessagePatient(i)}
                className={`w-full min-w-[160px] md:min-w-0 text-left p-3 border-b border-border transition-colors ${i === selectedMessagePatient ? "bg-primary/5" : "hover:bg-muted/30"}`}
              >
                <p className="text-sm font-medium text-foreground">{m.patient}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{m.preview}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div className="flex-1 border border-border rounded-lg bg-card flex flex-col min-h-[300px] md:min-h-0">
          <div className="p-4 border-b border-border">
            <p className="font-semibold text-foreground">{convo.patient}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {convo.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "dietitian" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-xl px-4 py-2.5 text-sm ${msg.from === "dietitian" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === "dietitian" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" className="bg-primary text-primary-foreground">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSettings = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Settings</h2>
      <Card className="border-border">
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Notification Preferences</p>
            <p className="text-xs text-muted-foreground">Configure when and how you receive patient alerts.</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Default Nutrient Targets</p>
            <p className="text-xs text-muted-foreground">Set default targets applied to new patients by condition.</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Account</p>
            <p className="text-xs text-muted-foreground">Manage your profile, password and connected services.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPatientProfile = () => {
    if (!selectedPatient) return null;
    const p = selectedPatient;
    const deficient = p.nutrients.reduce((min, n) => (n.actual / n.target < min.actual / min.target ? n : min), p.nutrients[0]);
    const consistent = p.nutrients.reduce((max, n) => (n.actual / n.target > max.actual / max.target ? n : max), p.nutrients[0]);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Back */}
        <button onClick={() => setPage("dashboard")} className="flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{p.name.split(" ").map((n) => n[0]).join("")}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{p.name}</h2>
            <p className="text-sm text-muted-foreground">Age {p.age} · {p.condition} · Assigned: Dr. Williams</p>
          </div>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Most Deficient", value: deficient.name, sub: `${Math.round((deficient.actual / deficient.target) * 100)}% of target`, color: "text-rag-red" },
            { label: "Most Consistent", value: consistent.name, sub: `${Math.round((consistent.actual / consistent.target) * 100)}% of target`, color: "text-nomi-green" },
            { label: "Logging Streak", value: "5 days", sub: "Current streak", color: "text-primary" },
          ].map((c) => (
            <Card key={c.label} className="border-border">
              <CardContent className="p-4">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{c.label}</p>
                <p className={`text-lg font-bold mt-1 ${c.color}`}>{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: chart + nutrients */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ring chart */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  Today's Intake <span className="text-[10px] font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Read only</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-6">
                <DualRingChart nutrients={p.nutrients} size={200} />
              </CardContent>
            </Card>

            {/* Nutrient bars */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Nutrient Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {p.nutrients.map((n) => {
                  const pct = Math.min(n.actual / n.target, 1);
                  const ragColor = pct >= 0.8 ? "bg-nomi-green" : pct >= 0.5 ? "bg-nomi-amber" : "bg-rag-red";
                  return (
                    <div key={n.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">{n.name}</span>
                        <span className="text-muted-foreground">{n.actual}{n.unit} / {n.target}{n.unit}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className={`h-2 rounded-full ${ragColor} transition-all`} style={{ width: `${pct * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Weekly trend */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Weekly Compliance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="compliance" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> March 2026
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-medium text-muted-foreground">{d}</div>
                  ))}
                  {calendarDays.map((d) => (
                    <button
                      key={d.day}
                      onClick={() => setSelectedCalDay(selectedCalDay === d.day ? null : d.day)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all border ${selectedCalDay === d.day ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/40"}`}
                    >
                      <span className="text-foreground font-medium">{d.day}</span>
                      {d.logged && (
                        <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${d.compliance >= 80 ? "bg-nomi-green" : d.compliance >= 50 ? "bg-nomi-amber" : "bg-rag-red"}`} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Expanded day */}
                <AnimatePresence>
                  {selectedCalDay && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">March {selectedCalDay}, 2026</p>
                        <button onClick={() => setSelectedCalDay(null)}>
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>

                      {/* Mock meal entry */}
                      <div className="border border-border rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Lunch — 12:35 PM</span>
                        </div>
                        <div className="bg-muted/30 rounded-md p-2 h-20 flex items-center justify-center text-xs text-muted-foreground">
                          Photo placeholder
                        </div>
                        <p className="text-sm text-foreground">Grilled chicken salad with quinoa and mixed vegetables</p>
                        <div className="bg-ai-card rounded-lg p-3">
                          <p className="text-xs font-medium text-ai-card-foreground mb-1">AI Observation</p>
                          <p className="text-xs text-ai-card-foreground/80">Good protein source. Fibre intake from vegetables estimated at 6g. Consider adding more leafy greens.</p>
                        </div>
                        <div className="bg-nomi-yellow-soft rounded-lg p-2 border border-accent/20">
                          <p className="text-[11px] text-nomi-amber font-medium">⚠ Portion size appears smaller than patient described</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Right column: feedback */}
          <div className="space-y-4">
            <Card className="border-border sticky top-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Dietitian Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">Send feedback to {p.name} about their progress or a specific log entry.</p>
                <Textarea
                  placeholder="Type your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[120px] text-sm"
                />
                <Button className="w-full bg-primary text-primary-foreground" disabled={!feedback.trim()}>
                  <Send className="w-4 h-4 mr-2" /> Send Feedback
                </Button>

                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Previous feedback</p>
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-foreground">Great improvement on protein this week — keep it up! Try adding more fibre through seeds and legumes.</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Sent 11 Mar 2026</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    );
  };

  const pageContent: Record<Page, () => React.ReactNode> = {
    dashboard: renderDashboard,
    patients: renderPatients,
    alerts: renderAlerts,
    messages: renderMessages,
    settings: renderSettings,
    profile: renderPatientProfile,
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 md:z-auto top-0 left-0 h-full w-60 shrink-0 bg-card border-r border-border flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary tracking-tight">NOMI</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Clinical Portal</p>
          </div>
          <button className="md:hidden p-1 hover:bg-muted/50 rounded-lg" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.id || (item.id === "dashboard" && page === "profile");
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
                {item.id === "alerts" && activeAlerts.length > 0 && (
                  <span className="ml-auto text-[10px] bg-rag-red text-primary-foreground px-1.5 py-0.5 rounded-full font-semibold">
                    {activeAlerts.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-3">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Home className="w-4.5 h-4.5" />
            <span>Back to Demo</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 hover:bg-muted/50 rounded-lg transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-sm font-semibold text-foreground capitalize">
              {page === "profile" ? selectedPatient?.name ?? "Patient" : page}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative hover:bg-muted/50 rounded-lg p-1.5 transition-colors" onClick={() => setPage("alerts")}>
              <Bell className="w-5 h-5 text-muted-foreground" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rag-red text-[9px] text-white flex items-center justify-center font-bold">
                  {activeAlerts.length}
                </span>
              )}
            </button>
            <button className="flex items-center gap-2 hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors" onClick={() => setPage("settings")}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">DW</span>
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">Dr. Williams</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {pageContent[page]()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DietitianDashboard;
