export type Action = "Raise" | "Fold";

export type Position =
  | "Lojack"
  | "Hijack"
  | "Cutoff"
  | "Button"
  | "Small Blind"
  | "Big Blind";

export interface RangeCell {
  HandKey: string;
  Action: Action;
}

export interface SequenceAction {
  Position: Position;
  Action: Action;
}

export interface RangeSpot {
  Sequence: SequenceAction[];
  Range: RangeCell[][];
}
