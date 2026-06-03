export const KIDS = [
  "Amelie",
  "Chloë",
  "Daan",
  "Elyana",
  "Emma",
  "Jack",
  "Jari",
  "Jiri",
  "Josefien",
  "Katja",
  "Liv",
  "Luca",
  "Lukas",
  "Maksima",
  "Maren",
  "Matvii",
  "Meint",
  "Niels",
  "Niene",
  "Otis",
  "Philine",
  "Safira",
  "Sepp",
  "Storm",
  "Sverre",
  "Tijn",
  "Juf Anne",
  "Juf Anouk",
] as const;

export type Kid = (typeof KIDS)[number];

export const EMOJIS = [
  "🌴",
  "☀️",
  "🌊",
  "🍹",
  "🍉",
  "🍦",
  "🦩",
  "🐚",
  "⭐",
  "🎉",
  "🌺",
  "🏝️",
] as const;

export type Rsvp = {
  emoji: string;
  at: number;
};

export type RsvpMap = Record<string, Rsvp>;
