export type ActionDto = "raise" | "fold";

export type PositionDto = "lj" | "hj" | "co" | "btn" | "sb" | "bb";

export interface ActionSpotDto {
  position: PositionDto;
  action: ActionDto;
}

export interface RangeSpotDto {
  sequence: ActionSpotDto[];
  range: Record<string, ActionDto>;
}
