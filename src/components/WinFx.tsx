import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/* ─────────── Global chip rain on big wins ─────────── */
export function ChipRain({ trigger }: { trigger: number }) {
  const [bursts, setBursts] = useState<number[]>([]);
  useEffect(() => {
    if (!trigger) return;
    const id = Date.now();
    setBursts((b) => [...b, id]);
    // haptic
    if ("vibrate" in navigator) navigator.vibrate?.([12, 40, 20]);
    const t = setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 2400);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <AnimatePresence>
        {bursts.map((id) => (
          <Burst key={id} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Burst() {
  const chips = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        i,
        x: Math.random() * 100,
        delay: Math.random() * 0.25,
        rot: (Math.random() - 0.5) * 720,
        dur: 1.6 + Math.random() * 0.9,
        emoji: ["🪙", "💰", "💎", "🎰", "🎲"][Math.floor(Math.random() * 5)],
        size: 18 + Math.random() * 22,
      })),
    []
  );
  return (
    <>
      {chips.map((c) => (
        <motion.span
          key={c.i}
          initial={{ y: -60, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0.8], rotate: c.rot }}
          exit={{ opacity: 0 }}
          transition={{ duration: c.dur, delay: c.delay, ease: "easeIn" }}
          style={{ left: `${c.x}vw`, fontSize: c.size }}
          className="absolute top-0 drop-shadow-[0_0_10px_rgba(255,210,74,0.7)]"
        >
          {c.emoji}
        </motion.span>
      ))}
    </>
  );
}

/* ─────────── Achievement toast queue ─────────── */
export type Achievement = { id: number; title: string; sub: string; emoji: string };

export function AchievementToaster({ items }: { items: Achievement[] }) {
  return (
    <div className="pointer-events-none fixed top-16 left-1/2 z-[55] -translate-x-1/2 flex flex-col gap-2 w-[92%] max-w-[440px]">
      <AnimatePresence>
        {items.map((a) => (
          <motion.div
            key={a.id}
            initial={{ y: -30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl glass px-3 py-2.5 shadow-card-deep ring-1 ring-[oklch(0.88_0.2_95)]/40"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-jackpot shadow-neon-gold text-xl">
              {a.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-[oklch(0.88_0.2_95)]">
                Achievement unlocked
              </div>
              <div className="text-sm font-black leading-tight truncate">{a.title}</div>
              <div className="text-[10px] text-muted-foreground truncate">{a.sub}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── XP ring around avatar ─────────── */
export function XpRing({ level, progress }: { level: number; progress: number }) {
  const p = Math.max(0, Math.min(1, progress));
  const deg = Math.round(p * 360);
  return (
    <div
      className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full"
      style={{
        background: `conic-gradient(oklch(0.88 0.2 95) ${deg}deg, oklch(1 0 0 / 0.12) ${deg}deg)`,
      }}
    >
      <div className="grid h-[30px] w-[30px] place-items-center rounded-full bg-black text-[10px] font-black text-gradient-jackpot">
        L{level}
      </div>
    </div>
  );
}
