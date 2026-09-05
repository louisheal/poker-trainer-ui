export type PokerAction = "Raise" | "Fold";

export type PokerPosition =
  | "Lojack"
  | "Hijack"
  | "Cutoff"
  | "Button"
  | "Small Blind"
  | "Big Blind";

export interface RangeCell {
  HandKey: string;
  Action: PokerAction;
}

export interface SequenceAction {
  Position: PokerPosition;
  Action: PokerAction;
}

export interface RangeSpot {
  Sequence: SequenceAction[];
  Range: RangeCell[][];
}

export type PokerRange = RangeCell[][];
