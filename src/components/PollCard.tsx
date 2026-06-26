import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Poll } from "@/lib/polls";
import { Sparkles, Flame, TrendingUp } from "lucide-react";

const accentMap: Record<Poll["accent"], { ring: string; bar: string; chip: string; glow: string }> = {
  pink:   { ring: "ring-[oklch(0.72_0.27_340)]", bar: "bg-jackpot",     chip: "bg-[oklch(0.72_0.27_340)]/20 text-[oklch(0.92_0.15_340)]", glow: "shadow-neon-pink" },
  gold:   { ring: "ring-[oklch(0.88_0.2_95)]",   bar: "bg-[oklch(0.88_0.2_95)]", chip: "bg-[oklch(0.88_0.2_95)]/20 text-[oklch(0.95_0.15_95)]", glow: "shadow-neon-gold" },
  cyan:   { ring: "ring-[oklch(0.82_0.18_200)]", bar: "bg-cyber",       chip: "bg-[oklch(0.82_0.18_200)]/20 text-[oklch(0.95_0.12_200)]", glow: "shadow-neon-pink" },
  purple: { ring: "ring-[oklch(0.62_0.25_300)]", bar: "bg-[oklch(0.62_0.25_300)]", chip: "bg-[oklch(0.62_0.25_300)]/25 text-[oklch(0.92_0.15_300)]", glow: "shadow-neon-pink" },
  green:  { ring: "ring-[oklch(0.82_0.25_145)]", bar: "bg-[oklch(0.82_0.25_145)]", chip: "bg-[oklch(0.82_0.25_145)]/20 text-[oklch(0.95_0.18_145)]", glow: "shadow-neon-gold" },
};

export function PollCard({ poll, onAnswer }: { poll: Poll; onAnswer: (reward: number) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const a = accentMap[poll.accent];

  const total = useMemo(() => poll.options.reduce((s, o) => s + o.pct, 0), [poll]);

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer(poll.reward);
  };

  return (
    <div className="snap-center-y h-full w-full flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ amount: 0.6, once: false }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className={`relative w-full max-w-md rounded-3xl glass p-6 shadow-card-deep ring-1 ${a.ring}/40`}
      >
        {/* glow halo */}
        <div className={`pointer-events-none absolute -inset-1 rounded-[28px] opacity-40 blur-2xl ${a.bar}`} />

        <div className="relative">
          {/* meta row */}
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${a.chip}`}>
              {poll.emoji} {poll.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="size-3.5 text-[oklch(0.85_0.2_45)]" />
              {poll.hype}
            </span>
          </div>

          {/* question */}
          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-1 text-foreground">
            {poll.question}
          </h2>
          <p className="text-xs text-muted-foreground mb-5 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-[oklch(0.88_0.2_95)]" />
            Earn <span className="font-bold text-[oklch(0.95_0.15_95)]">+{poll.reward} chips</span> for answering
          </p>

          {/* options */}
          <div className="space-y-2.5">
            {poll.options.map((o, i) => {
              const isPicked = picked === i;
              const reveal = picked !== null;
              const pct = Math.round((o.pct / total) * 100);
              return (
                <motion.button
                  key={o.label}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePick(i)}
                  className={`relative w-full overflow-hidden rounded-2xl border text-left transition
                    ${isPicked ? `border-transparent ${a.glow}` : "border-white/10 hover:border-white/25"}
                    ${reveal ? "cursor-default" : "cursor-pointer"}`}
                >
                  {/* fill bar after reveal */}
                  {reveal && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className={`absolute inset-y-0 left-0 ${a.bar} opacity-25`}
                    />
                  )}
                  <div className="relative flex items-center justify-between px-4 py-3.5">
                    <span className="font-semibold text-[15px] flex items-center gap-2">
                      {o.emoji && <span className="text-lg">{o.emoji}</span>}
                      {o.label}
                    </span>
                    <span className="text-xs font-bold tabular-nums text-muted-foreground">
                      {reveal ? `${pct}%` : ""}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* reward burst */}
          <AnimatePresence>
            {picked !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex items-center justify-between rounded-2xl bg-jackpot/15 border border-[oklch(0.88_0.2_95)]/30 px-4 py-3"
              >
                <span className="text-sm font-semibold">Chips credited 🎉</span>
                <span className="text-lg font-black text-gradient-jackpot">+{poll.reward}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* footer */}
          <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Swipe up for next ↑</span>
            <span className="flex items-center gap-1"><TrendingUp className="size-3.5" /> Live results</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
