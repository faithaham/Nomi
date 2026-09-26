import { useSyncExternalStore } from "react";

export type ChatMessage = { from: "patient" | "dietitian"; text: string; time: string };
export type Conversation = { patientId: number; patient: string; messages: ChatMessage[] };

const KEY = "nomi-messages-v1";

const seed: Conversation[] = [
  {
    patientId: 1,
    patient: "Sarah Johnson",
    messages: [
      { from: "patient", text: "Hi, I logged my lunch but forgot to take my Creon again. Sorry!", time: "12:50" },
      { from: "dietitian", text: "Hi Sarah — I noticed you've had a few meals this week without logging your Creon. Remember to take it with every meal and snack that contains fat or protein. It really helps with absorption. Let me know if you're having trouble remembering! 💊", time: "13:15" },
      { from: "patient", text: "Thank you — I'll set a reminder on my phone. It's just easy to forget when I'm at work.", time: "13:22" },
      { from: "dietitian", text: "That's a great idea. You could also keep a small pack in your bag so it's always to hand. We'll review at your next appointment.", time: "13:30" },
    ],
  },
  {
    patientId: 2,
    patient: "James Carter",
    messages: [
      { from: "patient", text: "My blood sugar was a bit high yesterday, should I adjust my carbohydrates?", time: "14:20" },
      { from: "dietitian", text: "Let's look at your log — it seems like the evening snack may have been high GI. Try swapping for nuts or yoghurt.", time: "15:00" },
    ],
  },
  {
    patientId: 3,
    patient: "Amara Osei",
    messages: [
      { from: "patient", text: "I've been finding it hard to eat enough protein without gluten. Any recommendations?", time: "08:00" },
    ],
  },
];

const load = (): Conversation[] => {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
};

let state = load();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      state = load();
      emit();
    }
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useConversations = () => useSyncExternalStore(subscribe, () => state, () => state);

export const sendMessage = (patientId: number, from: ChatMessage["from"], text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return;
  const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  state = state.map((c) =>
    c.patientId === patientId ? { ...c, messages: [...c.messages, { from, text: trimmed, time }] } : c,
  );
  localStorage.setItem(KEY, JSON.stringify(state));
  emit();
};
