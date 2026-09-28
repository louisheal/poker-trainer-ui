import type { ActionDto, PokerRangeDto } from "@/drawRanges/dto";
import type { PokerAction, PokerRange, RangeCell } from "@/drawRanges/model";
import { getHandKeysByRow } from "@/drawRanges/rangeGrid/handGrid";

const URL = import.meta.env.VITE_API_URL ?? "";

export class RangeNotFoundError extends Error {}

export const getRange = async (spotKey: string): Promise<PokerRange> => {
  const response = await fetch(
    `${URL}/api/DrawRanges/range?spotKey=${spotKey}`,
  );

  if (response.status === 404) {
    throw new RangeNotFoundError(`No range found for spot: ${spotKey}`);
  }

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
  return getHandKeysByRow().map((row) =>
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
