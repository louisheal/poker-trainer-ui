import type { PokerRange } from "@/drawRanges/model";

const CARD_RANKS = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

const getHandKey = (row: number, column: number) => {
  const firstRank = CARD_RANKS[row];
  const secondRank = CARD_RANKS[column];

  if (row < column) {
    return `${firstRank}${secondRank}s`;
  }
  if (row > column) {
    return `${secondRank}${firstRank}o`;
  }
  return `${firstRank}${secondRank}`;
};

export const getHandKeysByRow = () =>
  CARD_RANKS.map((_, row) =>
    CARD_RANKS.map((__, column) => getHandKey(row, column)),
  );

export const createFoldGrid = (): PokerRange =>
  getHandKeysByRow().map((row) =>
    row.map((HandKey) => ({ HandKey, Action: "Fold" })),
  );
