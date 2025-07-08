export interface CardInfo {
    suit: number,
    value: number,
}

export interface RangeInfo {
    rangeId: number;
    label: string;
}

export interface CellData {
    label: string;
    correct: number;
    total: number;
}