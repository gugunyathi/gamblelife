import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Gift, Sparkles, Timer, TrendingUp, Zap, Trophy } from "lucide-react";

/* ─────────── Live wins ticker (marquee) ─────────── */
const TICKER_SEEDS = [
  { u: "@degen.lex", a: "won", n: 12800, g: "Sneaky Link Slots", e: "🎰" },
  { u: "@bodycount.bae", a: "confessed", n: 4200, g: "Body Count", e: "🔥" },
  { u: "@vegas.ai", a: "cracked", n: 88000, g: "Net Worth Crash", e: "📉" },
  { u: "@tax.evader", a: "uploaded", n: 7500, g: "Tax records", e: "🧾" },
  { u: "@whisky.wizard", a: "spun", n: 15400, g: "Roulette", e: "🎡" },
  { u: "@0xghost", a: "flipped", n: 3200, g: "Coinflip", e: "🪙" },
  { u: "@miamiheat", a: "hit x50", n: 250000, g: "Crash", e: "💥" },
  { u: "@nocap.nina", a: "leaked", n: 9600, g: "DMs", e: "💬" },
];

export function LiveTicker() {
  const items = useMemo(() => [...TICKER_SEEDS, ...TICKER_SEEDS], []);
  return (
    <div className="relative overflow-hidden rounded-2xl glass py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/60 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/60 to-transparent z-10" />
      <div className="flex gap-6 whitespace-nowrap animate-[marquee_28s_linear_infinite] will-change-transform">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[11px] font-bold">
            <span className="text-base">{it.e}</span>
            <span className="text-gradient-jackpot">{it.u}</span>
            <span className="text-muted-foreground">{it.a}</span>
            <span className="font-black">+{it.n.toLocaleString()}</span>
            <span className="text-muted-foreground">· {it.g}</span>
            <span className="mx-2 text-muted-foreground">•</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

/* ─────────── Rolling jackpot with countdown ─────────── */
export function JackpotBanner() {
  const [pot, setPot] = useState(4_820_314);
  const [ms, setMs] = useState(() => 1000 * 60 * 47 + 12_000);
  useEffect(() => {
    const t = setInterval(() => setPot((p) => p + Math.floor(Math.random() * 240 + 40)), 700);
    const c = setInterval(() => setMs((m) => Math.max(0, m - 1000)), 1000);
    return () => { clearInterval(t); clearInterval(c); };
  }, []);
  const mm = String(Math.floor(ms / 60000)).padStart(2, "0");
  const ss = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="relative overflow-hidden rounded-3xl p-4 shadow-card-deep bg-[radial-gradient(circle_at_30%_20%,oklch(0.72_0.27_340/0.6),transparent_60%),radial-gradient(circle_at_80%_80%,oklch(0.88_0.2_95/0.5),transparent_55%),oklch(0.16_0.05_320)]">
      <div className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{ background: "conic-gradient(from 0deg, #ff3da8, #ffd24a, #4ad6ff, #b37dff, #ff3da8)" }} />
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
            <Trophy className="size-3.5" /> Mega Jackpot
          </div>
          <motion.div
            key={Math.floor(pot / 1000)}
            initial={{ scale: 0.98, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-black text-white drop-shadow-[0_0_18px_rgba(255,210,74,0.6)] tabular-nums"
          >
            {pot.toLocaleString()} <span className="text-sm text-white/70">chips</span>
          </motion.div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-white/80">
            <Timer className="size-3" /> DROPS IN
          </div>
          <div className="mt-1 flex gap-1">
            {[mm, ss].map((v, i) => (
              <span key={i} className="rounded-lg bg-black/50 backdrop-blur px-2 py-1 text-lg font-black tabular-nums text-white shadow-inner">
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button className="relative mt-3 w-full rounded-2xl bg-white/95 py-2.5 text-sm font-black text-black active:scale-[0.98] transition">
        🎟️ Buy a ticket · 500 chips
      </button>
    </div>
  );
}

/* ─────────── Daily free spin wheel ─────────── */
const WHEEL = [
  { label: "+500", v: 500, color: "oklch(0.72 0.27 340)" },
  { label: "x2", v: 0, color: "oklch(0.88 0.2 95)" },
  { label: "+1K", v: 1000, color: "oklch(0.82 0.18 200)" },
  { label: "💥", v: 0, color: "oklch(0.62 0.25 300)" },
  { label: "+250", v: 250, color: "oklch(0.82 0.25 145)" },
  { label: "JACKPOT", v: 10000, color: "oklch(0.85 0.2 45)" },
  { label: "+100", v: 100, color: "oklch(0.72 0.27 340)" },
  { label: "+3K", v: 3000, color: "oklch(0.82 0.18 200)" },
];

export function DailySpin({ onWin }: { onWin: (n: number) => void }) {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [used, setUsed] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);

  const spin = () => {
    if (spinning || used) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * WHEEL.length);
    const seg = 360 / WHEEL.length;
    const target = 360 * 6 + (360 - idx * seg - seg / 2);
    setAngle(target);
    setTimeout(() => {
      const prize = WHEEL[idx];
      if (prize.v > 0) onWin(prize.v);
      setPopup(prize.label);
      setSpinning(false);
      setUsed(true);
      setTimeout(() => setPopup(null), 2200);
    }, 3600);
  };

  const seg = 360 / WHEEL.length;
  const gradient = WHEEL.map((w, i) => `${w.color} ${i * seg}deg ${(i + 1) * seg}deg`).join(", ");

  return (
    <div className="relative rounded-3xl glass p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-1">
        <Gift className="size-4 text-[oklch(0.88_0.2_95)]" />
        <h3 className="text-sm font-black uppercase tracking-widest">Daily free spin</h3>
        <span className="ml-auto text-[10px] font-bold text-muted-foreground">
          {used ? "back in 24h" : "1 spin left"}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-32 w-32 shrink-0">
          <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-10 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[14px] border-l-transparent border-r-transparent border-t-[oklch(0.88_0.2_95)] drop-shadow-[0_0_6px_rgba(255,210,74,0.9)]" />
          <motion.div
            animate={{ rotate: angle }}
            transition={{ duration: 3.6, ease: [0.15, 0.9, 0.2, 1] }}
            className="h-32 w-32 rounded-full shadow-neon-gold ring-4 ring-white/10 relative"
            style={{ background: `conic-gradient(${gradient})` }}
          >
            {WHEEL.map((w, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 text-[10px] font-black text-black origin-left"
                style={{ transform: `rotate(${i * seg + seg / 2}deg) translateX(28px) rotate(90deg)` }}
              >
                {w.label}
              </span>
            ))}
            <div className="absolute inset-[38%] rounded-full bg-black grid place-items-center text-lg">🎲</div>
          </motion.div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-2">
            Land on JACKPOT for 10K chips. Comes back every 24h.
          </p>
          <button
            onClick={spin}
            disabled={spinning || used}
            className="w-full rounded-2xl bg-jackpot py-2.5 font-black text-black shadow-neon-gold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition"
          >
            {spinning ? "Spinning…" : used ? "Come back tomorrow" : "SPIN"}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 grid place-items-center bg-black/90 backdrop-blur-sm rounded-3xl"
          >
            <div className="text-center">
              <div className="text-5xl mb-1">🎉</div>
              <div className="text-2xl font-black text-gradient-jackpot">{popup}</div>
              <div className="text-xs text-white/70">landed in your bag</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── Mystery boxes row ─────────── */
const BOXES = [
  { tier: "Common", cost: 0, max: 500, color: "from-[oklch(0.72_0.27_340)] to-[oklch(0.62_0.25_300)]", emoji: "📦" },
  { tier: "Rare", cost: 500, max: 5000, color: "from-[oklch(0.82_0.18_200)] to-[oklch(0.62_0.25_300)]", emoji: "🎁" },
  { tier: "Elite", cost: 2500, max: 25000, color: "from-[oklch(0.88_0.2_95)] to-[oklch(0.72_0.27_340)]", emoji: "💎" },
];

export function MysteryBoxes({ onOpen }: { onOpen: (n: number) => void }) {
  const [opening, setOpening] = useState<number | null>(null);
  const [flash, setFlash] = useState<{ i: number; n: number } | null>(null);

  const open = (i: number) => {
    if (opening !== null) return;
    setOpening(i);
    const b = BOXES[i];
    setTimeout(() => {
      const win = Math.max(50, Math.floor(Math.random() * b.max));
      onOpen(win - b.cost);
      setFlash({ i, n: win });
      setOpening(null);
      setTimeout(() => setFlash(null), 1600);
    }, 900);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <Sparkles className="size-4 text-[oklch(0.82_0.18_200)]" />
        <h3 className="text-sm font-black uppercase tracking-widest">Mystery Boxes</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Tap to open</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {BOXES.map((b, i) => {
          const isOpen = opening === i;
          const hit = flash?.i === i;
          return (
            <motion.button
              key={b.tier}
              whileTap={{ scale: 0.94 }}
              onClick={() => open(i)}
              className={`relative rounded-2xl p-3 text-center overflow-hidden bg-gradient-to-br ${b.color} shadow-card-deep`}
            >
              <motion.div
                animate={isOpen ? { rotate: [0, -15, 15, -15, 15, 0], y: [0, -4, 0] } : {}}
                transition={{ duration: 0.9 }}
                className="text-3xl mb-1"
              >
                {b.emoji}
              </motion.div>
              <div className="text-[11px] font-black text-black">{b.tier}</div>
              <div className="text-[9px] font-bold text-black/70">
                {b.cost === 0 ? "FREE" : `${b.cost.toLocaleString()} chips`}
              </div>
              <AnimatePresence>
                {hit && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }} animate={{ y: -10, opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-x-0 top-1 text-[11px] font-black text-black bg-white/80 rounded-full mx-2 py-0.5"
                  >
                    +{flash!.n.toLocaleString()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── Streak / quest strip ─────────── */
export function StreakStrip({ streak }: { streak: number }) {
  const days = [1, 2, 3, 4, 5, 6, 7];
  const rewards = [100, 250, 500, 1000, 2000, 5000, 10000];
  return (
    <div className="rounded-2xl glass p-3">
      <div className="flex items-center gap-2 mb-2">
        <Flame className="size-4 text-[oklch(0.85_0.2_45)]" />
        <span className="text-xs font-black uppercase tracking-widest">Login streak</span>
        <span className="ml-auto text-[10px] font-bold text-muted-foreground">Day {Math.min(streak + 1, 7)} / 7</span>
      </div>
      <div className="flex gap-1.5">
        {days.map((d, i) => {
          const done = i < streak;
          const today = i === streak;
          return (
            <div key={d} className={`flex-1 rounded-lg p-1.5 text-center ${
              done ? "bg-jackpot text-black" : today ? "bg-white/20 ring-2 ring-[oklch(0.88_0.2_95)]" : "bg-white/5 text-muted-foreground"
            }`}>
              <div className="text-[9px] font-black">D{d}</div>
              <div className="text-[9px] font-bold">{rewards[i] >= 1000 ? `${rewards[i]/1000}K` : rewards[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── Trending confessions strip ─────────── */
const TRENDING = [
  { tag: "#BodyCount", vol: "48K", trend: "+312%" },
  { tag: "#NetWorthCrash", vol: "23K", trend: "+124%" },
  { tag: "#SneakyLink", vol: "91K", trend: "+58%" },
  { tag: "#TaxTea", vol: "12K", trend: "+220%" },
  { tag: "#DrunkDMs", vol: "67K", trend: "+41%" },
];

export function TrendingTags() {
  const wrap = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <TrendingUp className="size-4 text-[oklch(0.82_0.25_145)]" />
        <h3 className="text-sm font-black uppercase tracking-widest">Trending confessions</h3>
      </div>
      <div ref={wrap} className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
        {TRENDING.map((t) => (
          <motion.div
            key={t.tag}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 rounded-2xl glass px-3 py-2 min-w-[130px]"
          >
            <div className="text-xs font-black">{t.tag}</div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[9px] text-muted-foreground">{t.vol} spins</span>
              <span className="text-[9px] font-black text-[oklch(0.82_0.25_145)]">{t.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Floating action: quick spin CTA ─────────── */
export function QuickBet({ onBet }: { onBet: (delta: number) => void }) {
  const [busy, setBusy] = useState(false);
  const go = () => {
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      const win = Math.random() > 0.55;
      onBet(win ? 300 : -100);
      setBusy(false);
    }, 700);
  };
  return (
    <motion.button
      onClick={go}
      whileTap={{ scale: 0.94 }}
      className="w-full rounded-2xl bg-cyber py-3 font-black text-black shadow-card-deep flex items-center justify-center gap-2"
    >
      <Zap className="size-4" />
      {busy ? "Rolling…" : "⚡ Quick bet · 100 chips"}
    </motion.button>
  );
}
