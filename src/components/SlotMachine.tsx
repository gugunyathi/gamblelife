import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const SYMBOLS = ["🍒", "💎", "7️⃣", "🍋", "⭐", "🔔", "🍀", "💰"];

function Reel({ spinning, finalIdx, delay }: { spinning: boolean; finalIdx: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (spinning) {
      // big spin
      let start = performance.now();
      let raf = 0;
      const dur = 1400 + delay;
      const tick = (now: number) => {
        const t = now - start;
        const p = Math.min(1, t / dur);
        const ease = 1 - Math.pow(1 - p, 4);
        const totalDist = 32 * SYMBOLS.length * 6 + finalIdx * 64;
        setOffset(-(ease * totalDist) % (SYMBOLS.length * 64));
        if (p < 1) raf = requestAnimationFrame(tick);
        else setOffset(-finalIdx * 64);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
  }, [spinning, finalIdx, delay]);

  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-black/60 ring-1 ring-white/10">
      <div
        ref={ref}
        className="absolute inset-x-0 flex flex-col items-center"
        style={{ transform: `translateY(${offset}px)` }}
      >
        {[...SYMBOLS, ...SYMBOLS, ...SYMBOLS].map((s, i) => (
          <div key={i} className="h-16 w-16 flex items-center justify-center text-3xl">
            {s}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />
    </div>
  );
}

export function SlotMachine({ onWin }: { onWin: (amt: number) => void }) {
  const [spinning, setSpinning] = useState(false);
  const [final, setFinal] = useState<[number, number, number]>([0, 1, 2]);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
    const next: [number, number, number] = [
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
    ];
    // 30% chance of forced match for delight
    if (Math.random() < 0.3) {
      const s = Math.floor(Math.random() * SYMBOLS.length);
      next[0] = next[1] = next[2] = s;
    }
    setFinal(next);
    setTimeout(() => {
      setSpinning(false);
      const win = next[0] === next[1] && next[1] === next[2];
      if (win) {
        const amt = 500 + Math.floor(Math.random() * 1500);
        setResult(`JACKPOT +${amt}`);
        onWin(amt);
      } else {
        setResult("Try again, almost!");
      }
    }, 1800);
  };

  return (
    <div className="rounded-3xl glass p-5 shadow-card-deep">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-gradient-jackpot">
          ⚡ Quickspin
        </h3>
        <span className="text-[10px] text-muted-foreground">Free every 5 min</span>
      </div>
      <div className="flex items-center justify-center gap-2 mb-4 p-3 rounded-2xl bg-black/40">
        <Reel spinning={spinning} finalIdx={final[0]} delay={0} />
        <Reel spinning={spinning} finalIdx={final[1]} delay={200} />
        <Reel spinning={spinning} finalIdx={final[2]} delay={400} />
      </div>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={spin}
        disabled={spinning}
        className="w-full rounded-2xl bg-jackpot py-3 text-black font-black uppercase tracking-wider text-sm shadow-neon-gold disabled:opacity-60"
      >
        {spinning ? "Spinning…" : "Pull the lever"}
      </motion.button>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center font-bold text-sm text-gradient-jackpot"
        >
          {result}
        </motion.div>
      )}
    </div>
  );
}
