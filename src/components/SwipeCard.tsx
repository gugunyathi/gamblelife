import { useMemo, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { pollImage, type Poll } from "@/lib/polls";
import { Flame, Sparkles, TrendingUp, Heart, X, ArrowLeftRight } from "lucide-react";

const accentBar: Record<Poll["accent"], string> = {
  pink: "from-[oklch(0.72_0.27_340)] to-[oklch(0.62_0.25_300)]",
  gold: "from-[oklch(0.88_0.2_95)] to-[oklch(0.72_0.27_340)]",
  cyan: "from-[oklch(0.82_0.18_200)] to-[oklch(0.62_0.25_300)]",
  purple: "from-[oklch(0.62_0.25_300)] to-[oklch(0.72_0.27_340)]",
  green: "from-[oklch(0.82_0.25_145)] to-[oklch(0.82_0.18_200)]",
};

export function SwipeCard({
  poll,
  onVote,
  onSwipeAway,
  depth = 0,
  isTop,
}: {
  poll: Poll;
  onVote: (optionIndex: number, reward: number) => void;
  onSwipeAway: (dir: "left" | "right" | "up") => void;
  depth?: number;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -40], [1, 0]);
  const superOpacity = useTransform(y, [-140, -40], [1, 0]);

  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const total = useMemo(() => poll.options.reduce((s, o) => s + o.pct, 0), [poll]);
  const left = poll.options[0];
  const right = poll.options[1];
  const extras = poll.options.slice(2);

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setRevealed(true);
    onVote(i, poll.reward);
    // give a beat to reveal, then fly away
    setTimeout(() => onSwipeAway(i === 0 ? "left" : i === 1 ? "right" : "up"), 900);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (picked !== null) return;
    const { offset, velocity } = info;
    const swipePower = Math.abs(offset.x) * velocity.x;
    if (offset.x > 120 || swipePower > 8000) return handlePick(1);
    if (offset.x < -120 || swipePower < -8000) return handlePick(0);
    if (offset.y < -140 && extras.length > 0) return handlePick(2);
  };

  // Only the top card is draggable / interactive
  const scale = 1 - depth * 0.05;
  const yOffset = depth * 14;

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : yOffset,
        rotate: isTop ? rotate : 0,
        scale,
        zIndex: 10 - depth,
      }}
      drag={isTop && picked === null}
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={
        picked === null
          ? { y: yOffset, scale }
          : picked === 0
            ? { x: -600, rotate: -30, opacity: 0 }
            : picked === 1
              ? { x: 600, rotate: 30, opacity: 0 }
              : { y: -800, opacity: 0 }
      }
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[32px] glass shadow-card-deep ring-1 ring-white/10">
        {/* Split hero images (This vs That) */}
        <div className="relative h-[62%] w-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="relative w-1/2 overflow-hidden">
              <img
                src={pollImage(left.img, poll.id + "-L")}
                alt={left.label}
                loading="lazy"
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
            </div>
            <div className="relative w-1/2 overflow-hidden">
              <img
                src={pollImage(right.img, poll.id + "-R")}
                alt={right.label}
                loading="lazy"
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40" />
            </div>
          </div>

          {/* VS badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, -6, 6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${accentBar[poll.accent]} shadow-neon-pink text-black font-black text-lg`}
            >
              VS
            </motion.div>
          </div>

          {/* Meta pill */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-black/60 backdrop-blur px-3 py-1.5 text-[11px] font-black uppercase tracking-widest">
              {poll.emoji} {poll.category}
            </span>
          </div>
          <div className="absolute right-4 top-4">
            <span className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[11px] font-bold">
              <Flame className="size-3 text-[oklch(0.85_0.2_45)]" />
              {poll.hype}
            </span>
          </div>

          {/* LIKE / NOPE stamps */}
          {isTop && (
            <>
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute right-6 top-20 rotate-12 rounded-2xl border-4 border-[oklch(0.82_0.25_145)] px-4 py-1.5 text-2xl font-black text-[oklch(0.82_0.25_145)] bg-black/40"
              >
                {right.emoji} PICK
              </motion.div>
              <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute left-6 top-20 -rotate-12 rounded-2xl border-4 border-[oklch(0.72_0.27_340)] px-4 py-1.5 text-2xl font-black text-[oklch(0.72_0.27_340)] bg-black/40"
              >
                {left.emoji} PICK
              </motion.div>
              {extras.length > 0 && (
                <motion.div
                  style={{ opacity: superOpacity }}
                  className="absolute left-1/2 top-6 -translate-x-1/2 rounded-2xl border-4 border-[oklch(0.88_0.2_95)] px-4 py-1.5 text-lg font-black text-[oklch(0.88_0.2_95)] bg-black/40"
                >
                  ⬆ OTHER
                </motion.div>
              )}
            </>
          )}

          {/* Option labels bottom of hero */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-3 text-white">
            <div className="flex-1 pr-2 text-left">
              <div className="text-xl">{left.emoji}</div>
              <div className="text-sm font-black leading-tight drop-shadow">{left.label}</div>
              {revealed && (
                <div className="mt-1 text-[11px] font-black text-[oklch(0.72_0.27_340)]">
                  {Math.round((left.pct / total) * 100)}%
                </div>
              )}
            </div>
            <div className="flex-1 pl-2 text-right">
              <div className="text-xl">{right.emoji}</div>
              <div className="text-sm font-black leading-tight drop-shadow">{right.label}</div>
              {revealed && (
                <div className="mt-1 text-[11px] font-black text-[oklch(0.82_0.25_145)]">
                  {Math.round((right.pct / total) * 100)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question + actions */}
        <div className="relative h-[38%] w-full px-5 pt-4 pb-5 flex flex-col">
          <h2 className="text-xl font-black leading-tight text-foreground">
            {poll.question}
          </h2>
          <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-[oklch(0.88_0.2_95)]" />
            Swipe to earn{" "}
            <span className="font-black text-gradient-jackpot">+{poll.reward} chips</span>
          </p>

          {extras.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {extras.map((o, i) => (
                <button
                  key={o.label}
                  onClick={() => handlePick(i + 2)}
                  className="rounded-full bg-white/8 hover:bg-white/15 border border-white/10 px-2.5 py-1 text-[11px] font-bold"
                >
                  {o.emoji} {o.label} {revealed && `· ${Math.round((o.pct / total) * 100)}%`}
                </button>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePick(0)}
              disabled={picked !== null}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-[oklch(0.72_0.27_340)]/20 border border-[oklch(0.72_0.27_340)]/50 text-[oklch(0.72_0.27_340)] shadow-neon-pink"
              aria-label="Pick left"
            >
              <X className="size-6" strokeWidth={3} />
            </motion.button>
            <div className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-1">
              <ArrowLeftRight className="size-3" /> Swipe or tap
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePick(1)}
              disabled={picked !== null}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-[oklch(0.82_0.25_145)]/20 border border-[oklch(0.82_0.25_145)]/50 text-[oklch(0.82_0.25_145)] shadow-neon-gold"
              aria-label="Pick right"
            >
              <Heart className="size-6" strokeWidth={3} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* --------- Confetti burst for reward feedback --------- */
export function ChipBurst({ show, amount }: { show: boolean; amount: number }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.4, y: 30, opacity: 0 }}
            animate={{ scale: [0.4, 1.2, 1], y: [30, -40, -80], opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="text-4xl font-black text-gradient-jackpot drop-shadow-[0_0_20px_oklch(0.88_0.2_95_/_0.9)]"
          >
            +{amount} 🪙
          </motion.div>
          {[...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{
                x: (Math.random() - 0.5) * 320,
                y: (Math.random() - 0.5) * 320,
                opacity: 0,
                scale: 1.4,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute text-2xl"
            >
              {["🪙", "💎", "✨", "🎰", "🔥"][i % 5]}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------- Swipe deck --------- */
export function SwipeDeck({
  polls,
  onVote,
  onFinish,
}: {
  polls: Poll[];
  onVote: (pollId: string, optionIndex: number, reward: number) => void;
  onFinish?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [burst, setBurst] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });

  const visible = polls.slice(index, index + 3);

  const handleAway = () => {
    setIndex((i) => {
      const next = i + 1;
      if (next >= polls.length && onFinish) onFinish();
      return next;
    });
  };

  const handleVote = (poll: Poll, optIdx: number, reward: number) => {
    onVote(poll.id, optIdx, reward);
    setBurst({ show: true, amount: reward });
    setTimeout(() => setBurst({ show: false, amount: 0 }), 1200);
  };

  return (
    <div className="relative mx-auto h-[calc(100dvh-220px)] max-h-[680px] w-full max-w-md">
      <ChipBurst show={burst.show} amount={burst.amount} />
      <AnimatePresence>
        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 grid place-items-center text-center p-8 rounded-3xl glass"
          >
            <div>
              <div className="text-6xl mb-3">🏁</div>
              <h3 className="text-2xl font-black mb-2">Deck cleared</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You cooked every poll. Head to Play to spin your chips.
              </p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                <TrendingUp className="size-3.5" /> New drops every hour
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {visible
        .slice()
        .reverse()
        .map((poll, ri) => {
          const depth = visible.length - 1 - ri;
          const isTop = depth === 0;
          return (
            <SwipeCard
              key={poll.id}
              poll={poll}
              depth={depth}
              isTop={isTop}
              onVote={(optIdx, reward) => handleVote(poll, optIdx, reward)}
              onSwipeAway={handleAway}
            />
          );
        })}
    </div>
  );
}
