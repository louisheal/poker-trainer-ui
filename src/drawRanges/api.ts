import type {
  ActionDto,
  ActionSpotDto,
  PositionDto,
  RangeSpotDto,
} from "@/drawRanges/dto";
import type {
  Action,
  Position,
  RangeCell,
  RangeSpot,
  SequenceAction,
} from "@/drawRanges/model";

// TODO : remove before committing
// TODO : find a way to easily switch between local dev and
const URL = "http://localhost:5272";

export const getSpot = async (): Promise<RangeSpot> => {
  const response = await fetch(`${URL}/api/DrawRanges/rangeSpot`);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const rangeSpotDto = await response.json();
  return mapRangeSpot(rangeSpotDto);
};

const mapRangeSpot = (rangeSpotDto: RangeSpotDto): RangeSpot => ({
  Sequence: rangeSpotDto.sequence.map(mapSequenceAction),
  Range: mapRange(rangeSpotDto.range),
});

const mapSequenceAction = (actionDto: ActionSpotDto): SequenceAction => ({
  Position: mapPosition(actionDto.position),
  Action: mapAction(actionDto.action),
});

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

const mapRange = (rangeDto: Record<string, ActionDto>): RangeCell[][] => {
  const handKeys = generateHandKeys();
  return handKeys.map((row) =>
    row.map((key) => ({ HandKey: key, Action: mapAction(rangeDto[key]) })),
  );
};

const mapPosition = (positionDto: PositionDto): Position => {
  switch (positionDto) {
    case "lj":
      return "Lojack";
    case "hj":
      return "Hijack";
    case "co":
      return "Cutoff";
    case "btn":
      return "Button";
    case "sb":
      return "Small Blind";
    case "bb":
      return "Big Blind";
  }
};

const mapAction = (actionDto: ActionDto): Action => {
  switch (actionDto) {
    case "fold":
      return "Fold";
    case "raise":
      return "Raise";
  }
};
