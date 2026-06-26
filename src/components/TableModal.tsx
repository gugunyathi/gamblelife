import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown } from "lucide-react";

export type Game = {
  name: string;
  emoji: string;
  min: number;
  hot: boolean;
  kind: "roulette" | "blackjack" | "slots" | "crash" | "bingo" | "coinflip";
};

type Props = {
  game: Game | null;
  chips: number;
  onClose: () => void;
  onResult: (delta: number) => void;
};

export function TableModal({ game, chips, onClose, onResult }: Props) {
  const [bet, setBet] = useState(0);

  useEffect(() => {
    if (game) setBet(game.min);
  }, [game]);

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[460px] rounded-t-3xl sm:rounded-3xl glass p-5 shadow-card-deep max-h-[92dvh] overflow-y-auto"
          >
            <header className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-3xl">{game.emoji}</div>
                <div>
                  <h3 className="text-base font-black leading-tight">{game.name}</h3>
                  <p className="text-[10px] text-muted-foreground">Min bet {game.min} · Bag {chips.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                <X className="size-4" />
              </button>
            </header>

            <BetBar bet={bet} setBet={setBet} min={game.min} max={chips} />

            <div className="mt-4">
              {game.kind === "roulette" && <Roulette bet={bet} chips={chips} onResult={onResult} />}
              {game.kind === "blackjack" && <Blackjack bet={bet} chips={chips} onResult={onResult} />}
              {game.kind === "slots" && <MiniSlots bet={bet} chips={chips} onResult={onResult} />}
              {game.kind === "crash" && <Crash bet={bet} chips={chips} onResult={onResult} />}
              {game.kind === "bingo" && <Bingo bet={bet} chips={chips} onResult={onResult} />}
              {game.kind === "coinflip" && <Coinflip bet={bet} chips={chips} onResult={onResult} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BetBar({ bet, setBet, min, max }: { bet: number; setBet: (n: number) => void; min: number; max: number }) {
  const steps = [min, min * 2, min * 5, min * 10].filter((s) => s <= max);
  return (
    <div className="rounded-2xl bg-white/5 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your bet</span>
        <span className="text-lg font-black text-gradient-jackpot">{bet.toLocaleString()}</span>
      </div>
      <div className="flex gap-1.5">
        {steps.map((s) => (
          <button
            key={s}
            onClick={() => setBet(s)}
            className={`flex-1 rounded-xl py-1.5 text-[11px] font-black ${
              bet === s ? "bg-jackpot text-black" : "bg-white/10"
            }`}
          >
            {s >= 1000 ? `${s / 1000}k` : s}
          </button>
        ))}
        <button
          onClick={() => setBet(Math.min(max, Math.max(min, Math.floor(max / 2))))}
          className="flex-1 rounded-xl py-1.5 text-[11px] font-black bg-white/10"
        >
          50%
        </button>
      </div>
    </div>
  );
}

function ResultBanner({ result }: { result: { won: boolean; delta: number; msg: string } | null }) {
  if (!result) return null;
  return (
    <motion.div
      key={result.msg + result.delta}
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className={`mt-3 rounded-2xl p-3 text-center font-black ${
        result.won ? "bg-[oklch(0.82_0.25_145)]/20 text-[oklch(0.92_0.2_145)]" : "bg-[oklch(0.55_0.25_25)]/20 text-[oklch(0.85_0.2_25)]"
      }`}
    >
      <div className="text-sm">{result.msg}</div>
      <div className="text-2xl">{result.delta >= 0 ? "+" : ""}{result.delta.toLocaleString()}</div>
    </motion.div>
  );
}

/* ───── Roulette ───── */
function Roulette({ bet, chips, onResult }: { bet: number; chips: number; onResult: (d: number) => void }) {
  const [choice, setChoice] = useState<"red" | "black" | "green">("red");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ won: boolean; delta: number; msg: string } | null>(null);
  const [angle, setAngle] = useState(0);

  const spin = () => {
    if (spinning || bet > chips) return;
    setSpinning(true);
    const roll = Math.random();
    const land: "red" | "black" | "green" = roll < 0.02 ? "green" : roll < 0.51 ? "red" : "black";
    const slotIdx = land === "green" ? 0 : land === "red" ? 4 : 8;
    const target = 360 * 6 + (360 - slotIdx * (360 / 12));
    setAngle((a) => a + target);
    setTimeout(() => {
      const won = land === choice;
      const mult = land === "green" ? 14 : 2;
      const delta = won ? bet * (mult - 1) : -bet;
      setResult({ won, delta, msg: won ? `🎯 Landed ${land.toUpperCase()}` : `💀 Landed ${land.toUpperCase()}` });
      onResult(delta);
      setSpinning(false);
    }, 2600);
  };

  return (
    <div>
      <div className="relative mx-auto h-44 w-44">
        <motion.div
          animate={{ rotate: angle }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(oklch(0.6 0.25 145) 0deg 30deg, oklch(0.55 0.25 25) 30deg 60deg, oklch(0.2 0 0) 60deg 90deg, oklch(0.55 0.25 25) 90deg 120deg, oklch(0.2 0 0) 120deg 150deg, oklch(0.55 0.25 25) 150deg 180deg, oklch(0.2 0 0) 180deg 210deg, oklch(0.55 0.25 25) 210deg 240deg, oklch(0.2 0 0) 240deg 270deg, oklch(0.55 0.25 25) 270deg 300deg, oklch(0.2 0 0) 300deg 330deg, oklch(0.55 0.25 25) 330deg 360deg)",
            boxShadow: "0 0 60px oklch(0.7 0.2 320 / 0.5), inset 0 0 30px rgba(0,0,0,0.6)",
          }}
        />
        <div className="absolute inset-[28%] grid place-items-center rounded-full bg-black/80 text-2xl">🎡</div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1 text-2xl">▼</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(["red", "black", "green"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setChoice(c)}
            className={`rounded-xl py-2 text-xs font-black uppercase ${
              choice === c ? "ring-2 ring-white" : ""
            } ${c === "red" ? "bg-[oklch(0.55_0.25_25)]" : c === "black" ? "bg-black" : "bg-[oklch(0.6_0.25_145)] text-black"}`}
          >
            {c} {c === "green" && "·14x"}
          </button>
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning || bet > chips}
        className="mt-3 w-full rounded-2xl bg-jackpot py-3 font-black text-black shadow-neon-gold disabled:opacity-50"
      >
        {spinning ? "Spinning…" : `Spin · ${bet.toLocaleString()}`}
      </button>
      <ResultBanner result={result} />
    </div>
  );
}

/* ───── Coinflip ───── */
function Coinflip({ bet, chips, onResult }: { bet: number; chips: number; onResult: (d: number) => void }) {
  const [side, setSide] = useState<"drunk" | "sober">("drunk");
  const [flipping, setFlipping] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState<{ won: boolean; delta: number; msg: string } | null>(null);

  const flip = () => {
    if (flipping || bet > chips) return;
    setFlipping(true);
    const land: "drunk" | "sober" = Math.random() < 0.5 ? "drunk" : "sober";
    setAngle((a) => a + 1800 + (land === "drunk" ? 0 : 180));
    setTimeout(() => {
      const won = land === side;
      const delta = won ? bet : -bet;
      setResult({ won, delta, msg: won ? `🍻 ${land.toUpperCase()}!` : `🥴 ${land.toUpperCase()}` });
      onResult(delta);
      setFlipping(false);
    }, 1800);
  };

  return (
    <div>
      <div className="grid place-items-center h-44" style={{ perspective: 800 }}>
        <motion.div
          animate={{ rotateY: angle }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-32 w-32"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 grid place-items-center rounded-full bg-jackpot text-4xl shadow-neon-gold" style={{ backfaceVisibility: "hidden" }}>🍺</div>
          <div className="absolute inset-0 grid place-items-center rounded-full bg-cyber text-4xl text-black" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>💧</div>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {(["drunk", "sober"] as const).map((s) => (
          <button key={s} onClick={() => setSide(s)} className={`rounded-xl py-2 text-xs font-black uppercase ${side === s ? "bg-jackpot text-black" : "bg-white/10"}`}>
            {s === "drunk" ? "🍺 Drunk" : "💧 Sober"}
          </button>
        ))}
      </div>
      <button onClick={flip} disabled={flipping || bet > chips} className="mt-3 w-full rounded-2xl bg-jackpot py-3 font-black text-black shadow-neon-gold disabled:opacity-50">
        {flipping ? "Flipping…" : `Flip · ${bet.toLocaleString()}`}
      </button>
      <ResultBanner result={result} />
    </div>
  );
}

/* ───── Mini Slots ───── */
const SYMBOLS = ["🍒", "🔥", "💎", "🎲", "👑", "💋"];
function MiniSlots({ bet, chips, onResult }: { bet: number; chips: number; onResult: (d: number) => void }) {
  const [reels, setReels] = useState(["🍒", "🔥", "💎"]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ won: boolean; delta: number; msg: string } | null>(null);

  const spin = () => {
    if (spinning || bet > chips) return;
    setSpinning(true);
    let t = 0;
    const iv = setInterval(() => {
      setReels([rand(), rand(), rand()]);
      t++;
      if (t > 18) {
        clearInterval(iv);
        const final = [rand(), rand(), rand()];
        setReels(final);
        const allSame = final[0] === final[1] && final[1] === final[2];
        const twoSame = final[0] === final[1] || final[1] === final[2] || final[0] === final[2];
        let mult = 0;
        if (allSame) mult = final[0] === "👑" ? 25 : 10;
        else if (twoSame) mult = 2;
        const delta = mult > 0 ? bet * (mult - 1) : -bet;
        setResult({ won: mult > 0, delta, msg: allSame ? "💎 JACKPOT" : twoSame ? "✨ Pair pays" : "💀 No match" });
        onResult(delta);
        setSpinning(false);
      }
    }, 70);
  };
  const rand = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  return (
    <div>
      <div className="rounded-2xl bg-black/60 p-4 grid grid-cols-3 gap-2 shadow-card-deep">
        {reels.map((s, i) => (
          <div key={i} className="aspect-square rounded-xl bg-white/5 grid place-items-center text-4xl">{s}</div>
        ))}
      </div>
      <button onClick={spin} disabled={spinning || bet > chips} className="mt-3 w-full rounded-2xl bg-jackpot py-3 font-black text-black shadow-neon-gold disabled:opacity-50">
        {spinning ? "Spinning…" : `Spin · ${bet.toLocaleString()}`}
      </button>
      <ResultBanner result={result} />
    </div>
  );
}

/* ───── Crash ───── */
function Crash({ bet, chips, onResult }: { bet: number; chips: number; onResult: (d: number) => void }) {
  const [mult, setMult] = useState(1.0);
  const [running, setRunning] = useState(false);
  const [cashed, setCashed] = useState(false);
  const [result, setResult] = useState<{ won: boolean; delta: number; msg: string } | null>(null);
  const crashAt = useRef(1);
  const raf = useRef<number | null>(null);

  const start = () => {
    if (running || bet > chips) return;
    crashAt.current = 1 + Math.pow(Math.random(), 1.6) * 8 + 0.05;
    setMult(1.0);
    setCashed(false);
    setResult(null);
    setRunning(true);
    const t0 = performance.now();
    const tick = (t: number) => {
      const dt = (t - t0) / 1000;
      const m = 1 + dt * 0.6 + dt * dt * 0.18;
      setMult(m);
      if (m >= crashAt.current) {
        setRunning(false);
        if (!cashed) {
          setResult({ won: false, delta: -bet, msg: `💥 Crashed @ ${crashAt.current.toFixed(2)}x` });
          onResult(-bet);
        }
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const cashout = () => {
    if (!running || cashed) return;
    setCashed(true);
    setRunning(false);
    if (raf.current) cancelAnimationFrame(raf.current);
    const win = Math.floor(bet * mult) - bet;
    setResult({ won: true, delta: win, msg: `💸 Cashed @ ${mult.toFixed(2)}x` });
    onResult(win);
  };

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  return (
    <div>
      <div className="relative h-44 rounded-2xl bg-black/60 overflow-hidden grid place-items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,oklch(0.7_0.25_320_/_0.35),transparent_60%)]" />
        <div className="relative text-center">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Multiplier</div>
          <div className={`text-6xl font-black ${running ? "text-gradient-jackpot" : cashed ? "text-[oklch(0.82_0.25_145)]" : "text-[oklch(0.85_0.2_25)]"}`}>
            {mult.toFixed(2)}x
          </div>
          <div className="text-[10px] mt-1 text-muted-foreground flex items-center justify-center gap-1">
            {running ? <><TrendingUp className="size-3" /> Rising</> : <><TrendingDown className="size-3" /> Idle</>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button onClick={start} disabled={running || bet > chips} className="rounded-2xl bg-cyber py-3 font-black text-black disabled:opacity-50">
          Launch
        </button>
        <button onClick={cashout} disabled={!running} className="rounded-2xl bg-jackpot py-3 font-black text-black shadow-neon-gold disabled:opacity-40">
          Cash out
        </button>
      </div>
      <ResultBanner result={result} />
    </div>
  );
}

/* ───── Blackjack (simplified) ───── */
const card = () => Math.min(10, Math.floor(Math.random() * 13) + 1);
function sum(cs: number[]) {
  let s = cs.reduce((a, b) => a + (b === 1 ? 11 : b), 0);
  let aces = cs.filter((c) => c === 1).length;
  while (s > 21 && aces > 0) { s -= 10; aces--; }
  return s;
}
function Blackjack({ bet, chips, onResult }: { bet: number; chips: number; onResult: (d: number) => void }) {
  const [player, setPlayer] = useState<number[]>([]);
  const [dealer, setDealer] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle" | "play" | "done">("idle");
  const [result, setResult] = useState<{ won: boolean; delta: number; msg: string } | null>(null);

  const deal = () => {
    if (phase === "play" || bet > chips) return;
    setPlayer([card(), card()]);
    setDealer([card()]);
    setResult(null);
    setPhase("play");
  };
  const hit = () => {
    const p = [...player, card()];
    setPlayer(p);
    if (sum(p) > 21) finish(p, dealer);
  };
  const stand = () => {
    const d = [...dealer];
    while (sum(d) < 17) d.push(card());
    setDealer(d);
    finish(player, d);
  };
  const finish = (p: number[], d: number[]) => {
    const ps = sum(p); const ds = sum(d);
    let delta = 0; let msg = "";
    if (ps > 21) { delta = -bet; msg = `💀 Bust ${ps}`; }
    else if (ds > 21 || ps > ds) { delta = bet; msg = `🃏 Win ${ps} vs ${ds}`; }
    else if (ps === ds) { delta = 0; msg = `🤝 Push ${ps}`; }
    else { delta = -bet; msg = `💀 Lose ${ps} vs ${ds}`; }
    setResult({ won: delta > 0, delta, msg });
    if (delta !== 0) onResult(delta);
    setPhase("done");
  };

  const Cards = ({ cs, hide }: { cs: number[]; hide?: boolean }) => (
    <div className="flex gap-1.5">
      {cs.map((c, i) => (
        <div key={i} className="h-16 w-11 rounded-lg bg-white text-black grid place-items-center font-black shadow-card-deep">
          {hide && i > 0 ? "🂠" : c === 1 ? "A" : c === 10 ? "10" : c}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="rounded-2xl bg-[oklch(0.25_0.1_145)]/40 p-4 space-y-3 border border-white/5">
        <div>
          <div className="text-[10px] uppercase text-muted-foreground mb-1">Dealer · {phase === "done" ? sum(dealer) : ""}</div>
          {dealer.length ? <Cards cs={dealer} hide={phase === "play"} /> : <div className="h-16 text-xs text-muted-foreground grid place-items-center">—</div>}
        </div>
        <div>
          <div className="text-[10px] uppercase text-muted-foreground mb-1">You · {player.length ? sum(player) : ""}</div>
          {player.length ? <Cards cs={player} /> : <div className="h-16 text-xs text-muted-foreground grid place-items-center">Deal to start</div>}
        </div>
      </div>
      {phase !== "play" ? (
        <button onClick={deal} disabled={bet > chips} className="mt-3 w-full rounded-2xl bg-jackpot py-3 font-black text-black shadow-neon-gold disabled:opacity-50">
          Deal · {bet.toLocaleString()}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={hit} className="rounded-2xl bg-cyber py-3 font-black text-black">Hit</button>
          <button onClick={stand} className="rounded-2xl bg-jackpot py-3 font-black text-black shadow-neon-gold">Stand</button>
        </div>
      )}
      <ResultBanner result={result} />
    </div>
  );
}

/* ───── Bingo (pick-3) ───── */
function Bingo({ bet, chips, onResult }: { bet: number; chips: number; onResult: (d: number) => void }) {
  const [picks, setPicks] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ won: boolean; delta: number; msg: string } | null>(null);

  const toggle = (n: number) => {
    if (running) return;
    setPicks((p) => p.includes(n) ? p.filter((x) => x !== n) : p.length < 3 ? [...p, n] : p);
  };

  const start = () => {
    if (picks.length !== 3 || running || bet > chips) return;
    setRunning(true);
    setDrawn([]);
    setResult(null);
    const pool = Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5).slice(0, 8);
    pool.forEach((n, i) => setTimeout(() => setDrawn((d) => [...d, n]), 220 * (i + 1)));
    setTimeout(() => {
      const hits = picks.filter((p) => pool.includes(p)).length;
      const mult = hits === 3 ? 12 : hits === 2 ? 3 : hits === 1 ? 1.2 : 0;
      const delta = mult > 0 ? Math.floor(bet * mult) - bet : -bet;
      setResult({ won: mult > 0, delta, msg: `${hits}/3 hits` });
      onResult(delta);
      setRunning(false);
    }, 220 * 9 + 200);
  };

  return (
    <div>
      <div className="text-[10px] uppercase text-muted-foreground mb-1">Pick 3 brackets · 1–25</div>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => {
          const isPick = picks.includes(n);
          const isHit = drawn.includes(n);
          return (
            <button
              key={n}
              onClick={() => toggle(n)}
              className={`aspect-square rounded-lg text-xs font-black grid place-items-center transition ${
                isHit && isPick ? "bg-jackpot text-black shadow-neon-gold"
                : isHit ? "bg-white/20"
                : isPick ? "bg-cyber text-black"
                : "bg-white/5"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <button
        onClick={start}
        disabled={picks.length !== 3 || running || bet > chips}
        className="mt-3 w-full rounded-2xl bg-jackpot py-3 font-black text-black shadow-neon-gold disabled:opacity-50"
      >
        {running ? "Drawing…" : `Draw · ${bet.toLocaleString()}`}
      </button>
      <ResultBanner result={result} />
    </div>
  );
}
