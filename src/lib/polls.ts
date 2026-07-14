export type PollOption = {
  label: string;
  emoji?: string;
  pct: number;
  img: string; // image search tag(s) — used with loremflickr
  tint?: string; // tailwind gradient overlay
};

export type Poll = {
  id: string;
  category: string;
  emoji: string;
  question: string;
  options: PollOption[];
  reward: number;
  hype: string;
  accent: "pink" | "gold" | "cyan" | "purple" | "green";
};

// Rich image helper — loremflickr returns real photos matching the tags.
export const pollImage = (tag: string, seed: string | number) =>
  `https://loremflickr.com/600/800/${encodeURIComponent(tag)}?lock=${seed}`;

export const POLLS: Poll[] = [
  {
    id: "1", category: "Body Count", emoji: "🔥", reward: 240, hype: "23.4k spilled tea",
    question: "What's your body count, fr fr?",
    options: [
      { label: "0–3, still innocent", emoji: "😇", pct: 18, img: "halo,angel,white" },
      { label: "4–10, getting numbers", emoji: "😏", pct: 34, img: "neon,club,night" },
      { label: "11–25, certified menace", emoji: "🥵", pct: 28, img: "fire,flame,red" },
      { label: "Lost count, don't @ me", emoji: "💀", pct: 20, img: "skull,dark,smoke" },
    ], accent: "pink",
  },
  {
    id: "2", category: "Confession", emoji: "🥃", reward: 180, hype: "14.1k confessions",
    question: "Ever blacked out from drinking?",
    options: [
      { label: "Never, I'm the DD", emoji: "🚗", pct: 22, img: "car,keys,driving" },
      { label: "Once and never again", emoji: "🤢", pct: 31, img: "toilet,bathroom,tiles" },
      { label: "It's a lifestyle bestie", emoji: "🍻", pct: 47, img: "beer,cheers,bar" },
    ], accent: "gold",
  },
  {
    id: "3", category: "Brand Loyalty", emoji: "👟", reward: 120, hype: "9.2k voted",
    question: "Nike or Adidas? Pick a side.",
    options: [
      { label: "Nike forever", emoji: "✔️", pct: 58, img: "nike,sneaker,shoe" },
      { label: "Three stripes gang", emoji: "🏃", pct: 32, img: "adidas,sneaker" },
      { label: "New Balance dad-core", emoji: "👴", pct: 10, img: "newbalance,sneaker" },
    ], accent: "cyan",
  },
  {
    id: "4", category: "Drink Type", emoji: "🥂", reward: 160, hype: "12.7k sipping",
    question: "Whisky or Cognac, what hits?",
    options: [
      { label: "Whisky neat", emoji: "🥃", pct: 44, img: "whisky,glass,amber" },
      { label: "Cognac on rocks", emoji: "🧊", pct: 29, img: "cognac,brandy,glass" },
      { label: "Tequila or die", emoji: "🌵", pct: 27, img: "tequila,shot,lime" },
    ], accent: "gold",
  },
  {
    id: "5", category: "Money Moves", emoji: "📈", reward: 320, hype: "31k degens",
    question: "Crypto degen or stock trader?",
    options: [
      { label: "100x or homeless", emoji: "🚀", pct: 41, img: "bitcoin,crypto,neon" },
      { label: "Index funds, boring W", emoji: "📊", pct: 27, img: "stockmarket,chart,screen" },
      { label: "Both, diversified menace", emoji: "🧠", pct: 32, img: "trading,bloomberg,screens" },
    ], accent: "green",
  },
  {
    id: "6", category: "Dating", emoji: "💔", reward: 200, hype: "18k single",
    question: "Last time you got ghosted?",
    options: [
      { label: "This week, I'm cooked", emoji: "👻", pct: 38, img: "ghost,phone,dark" },
      { label: "Last month, healed", emoji: "💅", pct: 24, img: "spa,selfcare,pink" },
      { label: "I'm the ghoster", emoji: "😈", pct: 38, img: "devil,red,neon" },
    ], accent: "purple",
  },
  {
    id: "7", category: "Vice", emoji: "🚬", reward: 140, hype: "8.9k inhaling",
    question: "Pick your poison after midnight?",
    options: [
      { label: "Zaza", emoji: "🌿", pct: 36, img: "cannabis,green,leaf" },
      { label: "Nic vape", emoji: "💨", pct: 28, img: "vape,smoke,neon" },
      { label: "Espresso martini", emoji: "🍸", pct: 22, img: "espressomartini,cocktail" },
      { label: "Touch grass", emoji: "🌱", pct: 14, img: "grass,field,sunset" },
    ], accent: "green",
  },
  {
    id: "8", category: "Flex Check", emoji: "💸", reward: 280, hype: "21k flexing",
    question: "Monthly rent vs paycheck ratio?",
    options: [
      { label: "Under 25%, sigma", emoji: "🗿", pct: 19, img: "penthouse,city,luxury" },
      { label: "30%, normal", emoji: "🙂", pct: 34, img: "apartment,cozy" },
      { label: "50%, struggling", emoji: "😩", pct: 31, img: "smallroom,studio" },
      { label: "Mom's basement", emoji: "🛏️", pct: 16, img: "basement,gamer,rgb" },
    ], accent: "pink",
  },
  {
    id: "9", category: "Phone Type", emoji: "📱", reward: 90, hype: "42k tapped",
    question: "iPhone or Android allegiance?",
    options: [
      { label: "Apple ecosystem prisoner", emoji: "🍎", pct: 61, img: "iphone,apple,minimal" },
      { label: "Android, real tech", emoji: "🤖", pct: 33, img: "samsung,android,phone" },
      { label: "Flip phone hipster", emoji: "📞", pct: 6, img: "flipphone,retro" },
    ], accent: "cyan",
  },
  {
    id: "10", category: "Hot Take", emoji: "🌶️", reward: 220, hype: "11k spicy",
    question: "Hottest take you actually believe?",
    options: [
      { label: "Pineapple on pizza slaps", emoji: "🍍", pct: 28, img: "pineapplepizza" },
      { label: "Marriage is a scam", emoji: "💍", pct: 34, img: "wedding,rings,dark" },
      { label: "Cardio is cope", emoji: "🏋️", pct: 38, img: "barbell,gym,heavy" },
    ], accent: "pink",
  },
  {
    id: "11", category: "Gym Cult", emoji: "💪", reward: 130, hype: "16k lifting",
    question: "Gym frequency, real numbers?",
    options: [
      { label: "5+ days, gymcel", emoji: "🔱", pct: 29, img: "bodybuilder,muscle" },
      { label: "3 days, balanced", emoji: "🧘", pct: 36, img: "yoga,sunset" },
      { label: "Planet Fitness vibes", emoji: "🍕", pct: 21, img: "pizza,couch" },
      { label: "Couch is my home gym", emoji: "🛋️", pct: 14, img: "couch,netflix,chips" },
    ], accent: "green",
  },
  {
    id: "12", category: "Streaming", emoji: "🎬", reward: 80, hype: "27k binging",
    question: "Which streamer owns your soul?",
    options: [
      { label: "Netflix", emoji: "🎞️", pct: 32, img: "netflix,tv,red" },
      { label: "HBO / Max", emoji: "🐉", pct: 24, img: "dragon,fantasy,cinema" },
      { label: "Disney+", emoji: "🐭", pct: 16, img: "castle,disney,magic" },
      { label: "Pirate bay loyalist", emoji: "🏴‍☠️", pct: 28, img: "pirate,skull,ship" },
    ], accent: "purple",
  },
  {
    id: "13", category: "Travel", emoji: "✈️", reward: 250, hype: "13k jetset",
    question: "Last vacay was a flex or a fumble?",
    options: [
      { label: "Bali, certified flex", emoji: "🌴", pct: 22, img: "bali,beach,palm" },
      { label: "Vegas, money gone", emoji: "🎰", pct: 28, img: "vegas,neon,casino" },
      { label: "Roadtrip, mid", emoji: "🚙", pct: 26, img: "roadtrip,desert,car" },
      { label: "Staycation, cooked", emoji: "🏠", pct: 24, img: "bedroom,laptop" },
    ], accent: "gold",
  },
  {
    id: "14", category: "Sneaky Link", emoji: "🌙", reward: 300, hype: "9.4k whispers",
    question: "Latest sneaky link was a…",
    options: [
      { label: "W, top tier", emoji: "🏆", pct: 41, img: "trophy,gold,neon" },
      { label: "Mid, won't repeat", emoji: "😐", pct: 35, img: "boring,gray,room" },
      { label: "L, blocked them", emoji: "🚫", pct: 24, img: "blocked,phone,red" },
    ], accent: "pink",
  },
  {
    id: "15", category: "AI Era", emoji: "🤖", reward: 170, hype: "19k automated",
    question: "Would you let an AI agent gamble for you?",
    options: [
      { label: "Already do, autopilot W", emoji: "🛸", pct: 38, img: "robot,cyberpunk,ai" },
      { label: "Trust issues fr", emoji: "🥶", pct: 32, img: "hacker,dark,code" },
      { label: "Only with house money", emoji: "🃏", pct: 30, img: "poker,cards,chips" },
    ], accent: "cyan",
  },
  {
    id: "16", category: "Doom Scroll", emoji: "📲", reward: 110, hype: "44k scrolling",
    question: "Daily screen time, no lies?",
    options: [
      { label: "Under 3h, monk", emoji: "🧘", pct: 12, img: "monk,meditation,zen" },
      { label: "4–6h, normal", emoji: "🙃", pct: 34, img: "phone,scrolling" },
      { label: "7–10h, cooked", emoji: "🍳", pct: 38, img: "phone,addiction,bed" },
      { label: "12h+, terminal", emoji: "🪦", pct: 16, img: "phone,dark,night" },
    ], accent: "purple",
  },
  {
    id: "17", category: "Car Energy", emoji: "🏎️", reward: 230, hype: "10k revving",
    question: "Dream whip if money was fake?",
    options: [
      { label: "G-Wagon brick", emoji: "🧱", pct: 28, img: "gwagon,mercedes,black" },
      { label: "Lambo Urus dad", emoji: "🐂", pct: 22, img: "lamborghini,urus" },
      { label: "R34 GTR purist", emoji: "🏁", pct: 31, img: "nissan,gtr,r34" },
      { label: "Cybertruck cope", emoji: "🔺", pct: 19, img: "cybertruck,tesla" },
    ], accent: "gold",
  },
  {
    id: "18", category: "Energy Drink", emoji: "⚡", reward: 70, hype: "33k caffeinated",
    question: "Pre-gaming session of choice?",
    options: [
      { label: "Celsius stack", emoji: "🥶", pct: 31, img: "celsius,energy,can" },
      { label: "Red Bull purist", emoji: "🐂", pct: 28, img: "redbull,can,neon" },
      { label: "Monster gang", emoji: "💚", pct: 22, img: "monster,energy,green" },
      { label: "Just water, sigma", emoji: "💧", pct: 19, img: "water,bottle,minimal" },
    ], accent: "green",
  },
  {
    id: "19", category: "Net Worth", emoji: "🏦", reward: 400, hype: "5.1k flexed",
    question: "Liquid net worth check (real)?",
    options: [
      { label: "Under $1k, locked in", emoji: "🔓", pct: 34, img: "wallet,empty" },
      { label: "$1k–$10k, climbing", emoji: "🪜", pct: 36, img: "cash,dollar,stack" },
      { label: "$10k–$100k, comfy", emoji: "🛏️", pct: 22, img: "luxury,bedroom" },
      { label: "$100k+, why u here", emoji: "👑", pct: 8, img: "crown,gold,diamond" },
    ], accent: "gold",
  },
  {
    id: "20", category: "Final Boss", emoji: "💀", reward: 500, hype: "JACKPOT POLL",
    question: "Would you upload your bank statement for 10x chips?",
    options: [
      { label: "Bet, send the link", emoji: "💎", pct: 47, img: "diamond,neon,pink" },
      { label: "Maybe for 100x", emoji: "🤔", pct: 31, img: "moneybag,gold" },
      { label: "Never, paranoid", emoji: "🕶️", pct: 22, img: "hacker,mask,dark" },
    ], accent: "pink",
  },
];
