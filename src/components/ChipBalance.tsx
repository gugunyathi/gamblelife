import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

export function ChipBalance({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 700;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + diff * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <motion.div
      key={value}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 0.45 }}
      className="flex items-center gap-2 rounded-full bg-jackpot px-3.5 py-1.5 shadow-neon-gold"
    >
      <Coins className="size-4 text-black" />
      <span className="font-black text-black tabular-nums text-sm">
        {display.toLocaleString()}
      </span>
    </motion.div>
  );
}
