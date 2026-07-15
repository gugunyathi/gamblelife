import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Trophy, Bot, Home, Flame, Zap, ShieldCheck, ChevronRight, Layers } from "lucide-react";
import { POLLS } from "@/lib/polls";
import { SwipeDeck } from "@/components/SwipeCard";
import { ChipBalance } from "@/components/ChipBalance";
import { CoinScene } from "@/components/CoinScene";
import { SlotMachine } from "@/components/SlotMachine";
import { TableModal, type Game } from "@/components/TableModal";
import {
  LiveTicker, JackpotBanner, DailySpin, MysteryBoxes,
  StreakStrip, TrendingTags, QuickBet,
} from "@/components/HomeExtras";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GambleLife — Upload, Confess & Play" },
      { name: "description", content: "Your life is the stake. Upload personal data, answer viral slang polls, earn chips, and gamble on Base." },
      { property: "og:title", content: "GambleLife — Upload, Confess & Play" },
      { property: "og:description", content: "TikTok-meets-Vegas. Your data becomes your casino chips." },
    ],
  }),
  component: Index,
});

const UPLOADS = [
  { label: "Government ID", reward: 2500, icon: "🪪", risk: "Low" },
  { label: "Passport", reward: 4000, icon: "🛂", risk: "Low" },
  { label: "Tax records", reward: 7500, icon: "🧾", risk: "Med" },
  { label: "Bank statement", reward: 9000, icon: "🏦", risk: "Med" },
  { label: "Health record", reward: 6500, icon: "🩺", risk: "High" },
  { label: "Salary slip", reward: 3500, icon: "💵", risk: "Low" },
  { label: "Purchase history", reward: 2800, icon: "🛒", risk: "Low" },
  { label: "DMs / chat logs", reward: 12000, icon: "💬", risk: "🔥" },
];

const LEADERS = [
  { name: "@degen.lex", chips: 482300, emoji: "👑" },
  { name: "@bodycount.bae", chips: 318100, emoji: "🔥" },
  { name: "@tax.evader", chips: 271040, emoji: "🧾" },
  { name: "@vegas.ai", chips: 199820, emoji: "🤖" },
  { name: "@whisky.wizard", chips: 184500, emoji: "🥃" },
];

type Tab = "feed" | "swipe" | "upload" | "play" | "ranks";

function Index() {
  const [chips, setChips] = useState(12_480);
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Tab>("feed");

  const handleAnswer = (id: string, reward: number) => {
    if (answered.has(id)) return;
    setAnswered((prev) => new Set(prev).add(id));
    setChips((c) => c + reward);
  };

  const streak = useMemo(() => Math.min(answered.size, POLLS.length), [answered]);

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col overflow-hidden">
      {/* Animated 3D backdrop */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <CoinScene className="absolute inset-0 h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.25_0.12_320_/_0.6),transparent_60%)]" />
      </div>

      {/* TOP BAR */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 pt-4 pb-3 glass">
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-jackpot shadow-neon-gold spin-slow">
            <span className="text-lg">🎲</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-black leading-none truncate">
              Gamble<span className="text-gradient-jackpot">Life</span>
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-1">Base · live</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden xs:flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold">
            <Flame className="size-3 text-[oklch(0.85_0.2_45)]" /> {streak}🔥
          </span>
          <ChipBalance value={chips} />
        </div>
      </header>

      {/* CONTENT */}
      <section className="flex-1 pb-28">
        {tab === "feed" && <FeedTab onChips={(d) => setChips((c) => Math.max(0, c + d))} streak={streak} onOpenSwipe={() => setTab("swipe")} />}
        {tab === "swipe" && <SwipeTab onAnswer={handleAnswer} answered={answered} />}
        {tab === "upload" && <UploadTab onUpload={(r) => setChips((c) => c + r)} />}
        {tab === "play" && <PlayTab onWin={(r) => setChips((c) => c + r)} chips={chips} />}
        {tab === "ranks" && <RanksTab chips={chips} />}
      </section>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 px-3 pb-3">
        <div className="glass rounded-3xl px-2 py-2 flex items-center justify-around shadow-card-deep">
          {([
            { id: "feed", icon: Home, label: "Feed" },
            { id: "swipe", icon: Layers, label: "Swipe" },
            { id: "upload", icon: Upload, label: "Upload" },
            { id: "play", icon: Zap, label: "Play" },
            { id: "ranks", icon: Trophy, label: "Ranks" },
          ] as { id: Tab; icon: typeof Home; label: string }[]).map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 transition ${
                  active ? "bg-jackpot text-black shadow-neon-gold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-5" strokeWidth={2.4} />
                <span className="text-[10px] font-bold">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

/* ───────────────────── FEED TAB (Tinder-style swipe deck) ─────────────────── */
function FeedTab({
  onAnswer, answered, onChips, streak,
}: {
  onAnswer: (id: string, reward: number) => void;
  answered: Set<string>;
  onChips: (delta: number) => void;
  streak: number;
}) {
  const remaining = POLLS.filter((p) => !answered.has(p.id));
  return (
    <div className="px-3 pt-3 space-y-4">
      <LiveTicker />
      <JackpotBanner />

      <div className="grid grid-cols-1 gap-3">
        <DailySpin onWin={(n) => onChips(n)} />
      </div>

      <MysteryBoxes onOpen={(n) => onChips(n)} />

      <StreakStrip streak={Math.max(1, Math.min(streak, 7))} />

      <TrendingTags />

      <QuickBet onBet={(n) => onChips(n)} />

      <div className="mb-2 flex items-center justify-between px-1 pt-2">
        <div>
          <h2 className="text-xl font-black leading-tight">
            <span className="text-gradient-jackpot">Confess.</span> Swipe. Cash in.
          </h2>
          <p className="text-[11px] text-muted-foreground">
            {remaining.length} hot polls · swipe ← / → to vote
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black">
          {answered.size}/{POLLS.length} 🔥
        </span>
      </div>
      <SwipeDeck
        polls={POLLS}
        onVote={(id, _optIdx, reward) => onAnswer(id, reward)}
      />
    </div>
  );
}


function Welcome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md text-center"
    >
      <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-jackpot shadow-neon-gold spin-slow">
        <span className="text-4xl">🎰</span>
      </div>
      <h2 className="text-4xl font-black leading-[1.05] mb-3">
        Your life is the <span className="text-gradient-jackpot">stake</span>.
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        Confess. Upload. Spin. Every answer mints chips on Base. Swipe up to start cooking.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold">
        <span className="rounded-full bg-white/10 px-3 py-1.5">🔥 23M chips minted today</span>
        <span className="rounded-full bg-white/10 px-3 py-1.5">⚡ 1.2M live players</span>
      </div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="mt-10 text-xs text-muted-foreground"
      >
        ↑ Swipe up
      </motion.div>
    </motion.div>
  );
}

function EndCard({ total }: { total: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md text-center rounded-3xl glass p-8 shadow-card-deep"
    >
      <div className="text-5xl mb-3">🏁</div>
      <h3 className="text-2xl font-black mb-2">You cooked {total} polls</h3>
      <p className="text-sm text-muted-foreground mb-5">
        Hop into Play to spin your chips, or upload docs for 10x payouts.
      </p>
      <div className="flex gap-2">
        <a href="#" className="flex-1 rounded-2xl bg-jackpot py-3 font-black text-black shadow-neon-gold">Spin now</a>
        <a href="#" className="flex-1 rounded-2xl bg-white/10 py-3 font-black">Upload</a>
      </div>
    </motion.div>
  );
}

/* ───────────────────── UPLOAD TAB ─────────────────── */
function UploadTab({ onUpload }: { onUpload: (r: number) => void }) {
  const [done, setDone] = useState<Set<string>>(new Set());

  return (
    <div className="px-4 pt-4 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-jackpot p-5 text-black shadow-neon-gold"
      >
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-80">
          <ShieldCheck className="size-4" /> Encrypted on Base
        </div>
        <h2 className="mt-1 text-2xl font-black leading-tight">
          Turn your data into chips.
        </h2>
        <p className="text-sm font-medium opacity-80 mt-1">
          The more you reveal, the bigger your bag. Verified docs unlock VIP tables.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {UPLOADS.map((u, i) => {
          const claimed = done.has(u.label);
          return (
            <motion.button
              key={u.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (claimed) return;
                setDone((p) => new Set(p).add(u.label));
                onUpload(u.reward);
              }}
              className={`relative rounded-2xl glass p-4 text-left overflow-hidden ${
                claimed ? "ring-1 ring-[oklch(0.82_0.25_145)]/60" : ""
              }`}
            >
              <div className="text-2xl mb-2">{u.icon}</div>
              <div className="text-sm font-black leading-tight">{u.label}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Risk · {u.risk}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-black text-gradient-jackpot">+{u.reward.toLocaleString()}</span>
                <span className="text-[10px] font-bold">{claimed ? "✓ Locked" : "Upload"}</span>
              </div>
              {!claimed && <div className="absolute inset-0 pointer-events-none shimmer" />}
            </motion.button>
          );
        })}
      </div>

      <div className="rounded-3xl glass p-5">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="size-4 text-[oklch(0.82_0.18_200)]" />
          <h3 className="text-sm font-black uppercase tracking-widest">Assign an AI agent</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Let your agent auto-answer polls and gamble while you sleep. Cuts 5% of winnings.
        </p>
        <button className="w-full rounded-2xl bg-cyber py-3 font-black text-black">
          Hire Agent · 1,000 chips
        </button>
      </div>
    </div>
  );
}

/* ───────────────────── PLAY TAB ─────────────────── */
function PlayTab({ onWin, chips }: { onWin: (r: number) => void; chips: number }) {
  const games: Game[] = [
    { name: "Confession Roulette", emoji: "🎡", min: 50, hot: true, kind: "roulette" },
    { name: "Body Count Blackjack", emoji: "🃏", min: 100, hot: false, kind: "blackjack" },
    { name: "Sneaky Link Slots", emoji: "🎰", min: 25, hot: true, kind: "slots" },
    { name: "Net Worth Crash", emoji: "📉", min: 200, hot: false, kind: "crash" },
    { name: "Tax Bracket Bingo", emoji: "🧾", min: 75, hot: false, kind: "bingo" },
    { name: "Drunk-or-Sober Coinflip", emoji: "🪙", min: 10, hot: true, kind: "coinflip" },
  ];
  const [active, setActive] = useState<Game | null>(null);

  // Simulated live players per table — re-rolled on mount and ticking
  const [live, setLive] = useState<number[]>(() => games.map(() => 200 + Math.floor(Math.random() * 1800)));
  useEffect(() => {
    const iv = setInterval(() => {
      setLive((arr) => arr.map((n) => Math.max(80, n + Math.floor((Math.random() - 0.45) * 60))));
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="px-4 pt-4 space-y-4">
      <SlotMachine onWin={onWin} />

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black uppercase tracking-widest">🎮 Live tables</h3>
          <span className="text-[10px] text-muted-foreground">{chips.toLocaleString()} chips ready</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {games.map((g, i) => (
            <motion.button
              key={g.name}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(g)}
              className="relative rounded-2xl glass p-4 overflow-hidden text-left"
            >
              <div className="flex items-center justify-between">
                <div className="text-3xl">{g.emoji}</div>
                {g.hot && (
                  <span className="rounded-full bg-jackpot px-2 py-0.5 text-[9px] font-black text-black">🔥 HOT</span>
                )}
              </div>
              <div className="mt-3 text-sm font-black leading-tight">{g.name}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">Min bet {g.min}</div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.82_0.25_145)] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.25_145)]" />
                </span>
                <span className="font-bold">{live[i].toLocaleString()} live</span>
              </div>
              <div className="mt-3 w-full rounded-xl bg-white/10 py-2 text-xs font-bold flex items-center justify-center gap-1">
                Enter <ChevronRight className="size-3.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <TableModal
        game={active}
        chips={chips}
        onClose={() => setActive(null)}
        onResult={(delta) => onWin(delta)}
      />
    </div>
  );
}

/* ───────────────────── RANKS TAB ─────────────────── */
function RanksTab({ chips }: { chips: number }) {
  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="rounded-3xl glass p-5 shadow-card-deep">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Your rank</p>
        <div className="mt-1 flex items-end justify-between">
          <h2 className="text-4xl font-black text-gradient-jackpot">#1,284</h2>
          <span className="text-xs font-bold">↑ 42 today</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }} animate={{ width: "62%" }}
            className="h-full bg-jackpot"
          />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {chips.toLocaleString()} chips · {(20_000 - chips).toLocaleString()} to next tier
        </p>
      </div>

      <div className="rounded-3xl glass p-4">
        <h3 className="text-sm font-black uppercase tracking-widest mb-3">👑 Top degens this week</h3>
        <div className="space-y-2">
          {LEADERS.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-2xl bg-white/5 p-3"
            >
              <span className={`grid h-9 w-9 place-items-center rounded-xl font-black ${
                i === 0 ? "bg-jackpot text-black shadow-neon-gold" : "bg-white/10"
              }`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm truncate">{l.emoji} {l.name}</div>
                <div className="text-[10px] text-muted-foreground">{l.chips.toLocaleString()} chips</div>
              </div>
              <Flame className="size-4 text-[oklch(0.85_0.2_45)]" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-cyber p-5 text-black">
        <h3 className="font-black text-lg">Weekly challenge · 🌶️ Spicy Confessions</h3>
        <p className="text-xs font-medium opacity-80 mt-1">
          Answer 20 hot-take polls this week. Top 100 split 1M chips.
        </p>
        <button className="mt-3 rounded-xl bg-black/80 text-white px-4 py-2 text-xs font-black">
          Join challenge
        </button>
      </div>
    </div>
  );
}
