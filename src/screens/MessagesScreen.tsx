import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendMessage, useConversations } from "@/lib/messagesStore";

const SARAH_ID = 1;

const MessagesScreen = () => {
  const convo = useConversations().find((c) => c.patientId === SARAH_ID);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo?.messages.length]);

  const submit = () => {
    sendMessage(SARAH_ID, "patient", text);
    setText("");
  };

  return (
    <div className="px-5 pt-6 pb-28 max-w-lg mx-auto flex flex-col min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Messages</h1>
        <div className="flex items-center gap-3 mt-3 bg-card border border-border rounded-lg p-3">
          <div className="w-10 h-10 rounded-full bg-nomi-blue-soft flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Faith Ahamefula</p>
            <p className="text-xs text-muted-foreground">Registered Dietitian · usually replies within 1 working day</p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 space-y-3 mb-4">
        {convo?.messages.map((msg, i) => {
          const mine = msg.from === "patient";
          return (
            <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.time}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="sticky bottom-24 flex gap-2 bg-background pt-2"
      >
        <Input placeholder="Message your dietitian..." value={text} onChange={(e) => setText(e.target.value)} className="flex-1" />
        <Button type="submit" size="sm" aria-label="Send" disabled={!text.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessagesScreen;
