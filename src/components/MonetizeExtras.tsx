import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, Rocket, Gift, Users, Palette, Shield, Zap, X, Check } from "lucide-react";

/* ─────────── Chip Store (real-money packs) ─────────── */
const PACKS = [
  { chips: 5_000, price: 4.99, bonus: 0, tag: "Starter", emoji: "🪙", color: "from-[oklch(0.72_0.27_340)] to-[oklch(0.62_0.25_300)]" },
  { chips: 25_000, price: 19.99, bonus: 15, tag: "Popular", emoji: "💰", color: "from-[oklch(0.82_0.18_200)] to-[oklch(0.62_0.25_300)]" },
  { chips: 75_000, price: 49.99, bonus: 35, tag: "Best Value", emoji: "💎", color: "from-[oklch(0.88_0.2_95)] to-[oklch(0.72_0.27_340)]" },
  { chips: 250_000, price: 149.99, bonus: 60, tag: "Whale", emoji: "🐋", color: "from-[oklch(0.85_0.2_45)] to-[oklch(0.72_0.27_340)]" },
];

export function ChipStore({ onBuy }: { onBuy: (chips: number) => void }) {
  const [buying, setBuying] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<number | null>(null);

  const purchase = (i: number) => {
    if (buying !== null) return;
    setBuying(i);
    setTimeout(() => {
      const p = PACKS[i];
      const total = p.chips + Math.floor(p.chips * p.bonus / 100);
      onBuy(total);
      setBuying(null);
      setConfetti(i);
      setTimeout(() => setConfetti(null), 1800);
    }, 900);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <Sparkles className="size-4 text-[oklch(0.88_0.2_95)]" />
        <h3 className="text-sm font-black uppercase tracking-widest">Chip Store</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Never runs out</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PACKS.map((p, i) => (
          <motion.button
            key={p.tag}
            whileTap={{ scale: 0.96 }}
            onClick={() => purchase(i)}
            className={`relative overflow-hidden rounded-2xl p-3 text-left bg-gradient-to-br ${p.color} shadow-card-deep`}
          >
            {p.bonus > 0 && (
              <span className="absolute top-1.5 right-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-black text-[oklch(0.88_0.2_95)]">
                +{p.bonus}%
              </span>
            )}
            <div className="text-2xl">{p.emoji}</div>
            <div className="mt-1 text-[10px] font-black uppercase text-black/70">{p.tag}</div>
            <div className="text-sm font-black text-black tabular-nums">
              {p.chips.toLocaleString()}
              {p.bonus > 0 && (
                <span className="text-[10px] text-black/60"> +{Math.floor(p.chips * p.bonus / 100).toLocaleString()}</span>
              )}
            </div>
            <div className="mt-1 inline-block rounded-lg bg-black/70 px-2 py-0.5 text-[11px] font-black text-white">
              {buying === i ? "…" : `$${p.price}`}
            </div>
            <AnimatePresence>
              {confetti === i && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 grid place-items-center bg-black/85 text-center"
                >
                  <div>
                    <div className="text-3xl">🎉</div>
                    <div className="text-[11px] font-black text-gradient-jackpot">Chips added</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─────────── VIP Subscription ─────────── */
const VIP_PERKS = [
  "2x chip earnings on every swipe",
  "Ad-free · no cooldowns",
  "Daily 5,000 chip stipend",
  "Exclusive gold profile ring",
  "Priority leaderboard slot",
  "Access to VIP-only high-stakes tables",
];

export function VipCard({ onSubscribe }: { onSubscribe: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="relative w-full overflow-hidden rounded-3xl p-4 text-left shadow-card-deep bg-[radial-gradient(circle_at_20%_10%,oklch(0.88_0.2_95/0.7),transparent_60%),radial-gradient(circle_at_90%_90%,oklch(0.72_0.27_340/0.6),transparent_55%),oklch(0.14_0.05_320)]"
      >
        <div className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{ background: "conic-gradient(from 90deg, #ffd24a, #ff3da8, #b37dff, #ffd24a)" }} />
        <div className="relative flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-jackpot shadow-neon-gold">
            <Crown className="size-6 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-[oklch(0.88_0.2_95)]">GambleLife VIP</div>
            <div className="text-lg font-black leading-tight text-white">
              Go Gold · <span className="text-gradient-jackpot">$9.99/mo</span>
            </div>
            <div className="text-[11px] text-white/70">2x earnings · daily 5K · VIP tables</div>
          </div>
          <div className="rounded-xl bg-white/95 px-3 py-1.5 text-xs font-black text-black">JOIN</div>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/80 backdrop-blur-sm p-3"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-[oklch(0.14_0.04_290)] p-5 shadow-card-deep ring-1 ring-white/10"
            >
              <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5">
                <X className="size-4" />
              </button>
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-jackpot shadow-neon-gold">
                  <Crown className="size-7 text-black" />
                </div>
                <h3 className="mt-2 text-2xl font-black text-gradient-jackpot">VIP Gold</h3>
                <p className="text-xs text-white/70">Everything unlocked. Forever winning.</p>
              </div>
              <ul className="mt-4 space-y-2">
                {VIP_PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                    <Check className="size-4 text-[oklch(0.82_0.25_145)] shrink-0" /> {p}
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="rounded-2xl bg-white/10 py-3 text-sm font-black" onClick={() => setOpen(false)}>
                  Maybe later
                </button>
                <button
                  onClick={() => { onSubscribe(); setOpen(false); }}
                  className="rounded-2xl bg-jackpot py-3 text-sm font-black text-black shadow-neon-gold"
                >
                  $9.99 / month
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-white/50">Cancel anytime · 3 day free trial</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────── Battle Pass ─────────── */
export function BattlePass({ xp = 12480 }: { xp?: number }) {
  const cap = 50_000;
  const pct = Math.min(1, xp / cap);
  const tiers = [
    { at: 5000, r: "500 chips", e: "🪙" },
    { at: 15000, r: "Skin: Neon", e: "🎨" },
    { at: 25000, r: "Mystery Box", e: "🎁" },
    { at: 40000, r: "10K chips", e: "💰" },
    { at: 50000, r: "VIP week", e: "👑" },
  ];
  return (
    <div className="rounded-3xl glass p-4">
      <div className="flex items-center gap-2 mb-2">
        <Rocket className="size-4 text-[oklch(0.82_0.18_200)]" />
        <h3 className="text-sm font-black uppercase tracking-widest">Season Pass · S1</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Ends in 14d</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1 }}
          className="h-full bg-jackpot shadow-neon-gold"
        />
      </div>
      <div className="mt-3 flex justify-between">
        {tiers.map((t) => {
          const done = xp >= t.at;
          return (
            <div key={t.at} className="text-center">
              <div className={`grid h-9 w-9 place-items-center rounded-xl text-lg ${done ? "bg-jackpot shadow-neon-gold" : "bg-white/5 grayscale opacity-70"}`}>
                {t.e}
              </div>
              <div className="mt-1 text-[8px] font-bold text-muted-foreground">{t.at >= 1000 ? `${t.at/1000}K` : t.at}</div>
            </div>
          );
        })}
      </div>
      <button className="mt-3 w-full rounded-2xl bg-cyber py-2.5 text-sm font-black text-black">
        Unlock Premium Track · $14.99
      </button>
    </div>
  );
}

/* ─────────── 2x Booster ─────────── */
export function EarningsBooster({ onActivate }: { onActivate: () => void }) {
  const [active, setActive] = useState(false);
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setLeft((s) => (s <= 1 ? (setActive(false), 0) : s - 1)), 1000);
    return () => clearInterval(t);
  }, [active]);
  const activate = () => { setActive(true); setLeft(15 * 60); onActivate(); };
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <button
      onClick={active ? undefined : activate}
      className="relative w-full overflow-hidden rounded-2xl p-3 text-left glass ring-1 ring-[oklch(0.85_0.2_45)]/40"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.85_0.2_45)] text-black">
          <Zap className="size-5" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-[oklch(0.85_0.2_45)]">2x Earnings Boost</div>
          <div className="text-sm font-black">{active ? `Active · ${mm}:${ss}` : "15 min · $1.99 or watch ad"}</div>
        </div>
        <span className="rounded-lg bg-white/10 px-2 py-1 text-[11px] font-black">{active ? "🔥" : "GO"}</span>
      </div>
    </button>
  );
}

/* ─────────── Tip / Gift Creator ─────────── */
const GIFTS = [
  { emoji: "🌹", name: "Rose", cost: 100 },
  { emoji: "🍾", name: "Champ", cost: 500 },
  { emoji: "💎", name: "Diamond", cost: 2500 },
  { emoji: "🚀", name: "Rocket", cost: 5000 },
  { emoji: "🦁", name: "Lion", cost: 12000 },
];
export function TipDrawer({ onTip }: { onTip: (n: number) => void }) {
  return (
    <div className="rounded-2xl glass p-3">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="size-4 text-[oklch(0.72_0.27_340)]" />
        <h3 className="text-sm font-black uppercase tracking-widest">Tip creators</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Creators keep 70%</span>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {GIFTS.map((g) => (
          <motion.button
            key={g.name}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTip(-g.cost)}
            className="shrink-0 rounded-2xl bg-white/5 p-2 text-center min-w-[64px]"
          >
            <div className="text-2xl">{g.emoji}</div>
            <div className="text-[9px] font-black">{g.name}</div>
            <div className="text-[9px] font-bold text-[oklch(0.88_0.2_95)]">{g.cost >= 1000 ? `${g.cost/1000}K` : g.cost}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Refer & Earn ─────────── */
export function ReferCard({ onClaim }: { onClaim: (n: number) => void }) {
  const [copied, setCopied] = useState(false);
  const code = "DEGEN-4820";
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    onClaim(500);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="rounded-2xl glass p-3 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.82_0.25_145)] text-black">
        <Users className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-black">Refer a friend · earn 2,500 chips</div>
        <div className="text-[10px] text-muted-foreground truncate">You both get chips + they get 3 free spins</div>
      </div>
      <button onClick={copy} className="rounded-xl bg-jackpot px-3 py-2 text-xs font-black text-black shadow-neon-gold">
        {copied ? "COPIED" : code}
      </button>
    </div>
  );
}

/* ─────────── Cosmetic Skins Shop ─────────── */
const SKINS = [
  { name: "Neon Wave", price: 1500, grad: "from-[oklch(0.72_0.27_340)] to-[oklch(0.62_0.25_300)]", emoji: "🌊" },
  { name: "Solid Gold", price: 4000, grad: "from-[oklch(0.88_0.2_95)] to-[oklch(0.85_0.2_45)]", emoji: "🏆" },
  { name: "Ice Cold", price: 2500, grad: "from-[oklch(0.82_0.18_200)] to-[oklch(0.72_0.15_260)]", emoji: "🧊" },
  { name: "Bloody Red", price: 3200, grad: "from-[oklch(0.65_0.28_25)] to-[oklch(0.55_0.25_10)]", emoji: "🩸" },
];
export function SkinShop({ onBuy }: { onBuy: (n: number) => void }) {
  const [owned, setOwned] = useState<Set<string>>(new Set());
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <Palette className="size-4 text-[oklch(0.72_0.27_340)]" />
        <h3 className="text-sm font-black uppercase tracking-widest">Card skins</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Flex on the feed</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SKINS.map((s) => {
          const has = owned.has(s.name);
          return (
            <motion.button
              key={s.name}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (has) return;
                setOwned((o) => new Set(o).add(s.name));
                onBuy(-s.price);
              }}
              className={`relative overflow-hidden rounded-2xl p-3 text-left bg-gradient-to-br ${s.grad} shadow-card-deep`}
            >
              <div className="text-2xl">{s.emoji}</div>
              <div className="mt-1 text-xs font-black text-black">{s.name}</div>
              <div className="mt-1 inline-block rounded-lg bg-black/70 px-2 py-0.5 text-[11px] font-black text-white">
                {has ? "OWNED" : `${s.price.toLocaleString()} chips`}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── Insurance / Loss Shield ─────────── */
export function LossShield({ onBuy }: { onBuy: () => void }) {
  return (
    <button
      onClick={onBuy}
      className="w-full rounded-2xl glass p-3 flex items-center gap-3 text-left"
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.82_0.18_200)] text-black">
        <Shield className="size-5" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-black">Loss Shield · refund next big L</div>
        <div className="text-[10px] text-muted-foreground">One-time · protects up to 10K chips · $2.99</div>
      </div>
      <span className="rounded-lg bg-jackpot px-2 py-1 text-[11px] font-black text-black">BUY</span>
    </button>
  );
}
