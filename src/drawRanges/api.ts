import type { ActionDto, PokerRangeDto } from "@/drawRanges/dto";
import type { PokerAction, PokerRange, RangeCell } from "@/drawRanges/model";

const URL = import.meta.env.VITE_API_URL ?? "";

export const getRange = async (spotKey: string): Promise<PokerRange> => {
  const response = await fetch(
    `${URL}/api/DrawRanges/range?spotKey=${spotKey}`,
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const range: PokerRangeDto = await response.json();
  return mapRange(range);
};

export const updateRange = async (
  spotKey: string,
  update: PokerRange,
): Promise<PokerRange> => {
  const newRange: Record<string, string> = Object.fromEntries(
    update.flatMap((row) =>
      row.map((hand) => [hand.HandKey, hand.Action.toLowerCase()]),
    ),
  );

  const response = await fetch(
    `${URL}/api/DrawRanges/range?spotKey=${spotKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRange),
    },
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const range: PokerRangeDto = await response.json();
  return mapRange(range);
};

const mapRange = (rangeDto: Record<string, ActionDto>): RangeCell[][] => {
  const handKeys = generateHandKeys();
  return handKeys.map((row) =>
    row.map((key) => ({ HandKey: key, Action: mapAction(rangeDto[key]) })),
  );
};

const mapAction = (actionDto: ActionDto): PokerAction => {
  switch (actionDto) {
    case "fold":
      return "Fold";
    case "raise":
      return "Raise";
  }
};

const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

const getHandKey = (i: number, j: number) => {
  const cardA = cards[i];
  const cardB = cards[j];
  if (i < j) {
    return `${cardA}${cardB}s`;
  }
  if (i > j) {
    return `${cardB}${cardA}o`;
  }
  return `${cardA}${cardB}`;
};

const generateHandKeys = () => {
  const result = [];
  for (let i = 0; i < 13; i++) {
    const row = [];
    for (let j = 0; j < 13; j++) {
      row.push(getHandKey(i, j));
    }
    result.push(row);
  }
  return result;
};
