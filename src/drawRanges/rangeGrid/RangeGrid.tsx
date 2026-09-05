import { Card } from "@/components/ui/card";
import type { PokerAction, PokerRange } from "@/drawRanges/model";
import { useRef } from "react";

interface Props {
  grid: PokerRange;
  setGrid: (prev: PokerRange | ((prev: PokerRange) => PokerRange)) => void;
  size?: "default" | "small";
}

export const RangeGrid = (props: Props) => {
  const pointerDownRef = useRef(false);
  const targetActionRef = useRef<PokerAction>("Raise");

  const onPointerDown = (current: PokerAction, row: number, col: number) => {
    const targetAction = current === "Fold" ? "Raise" : "Fold";
    targetActionRef.current = targetAction;
    pointerDownRef.current = true;
    toggleCell(row, col);
  };

  window.addEventListener("pointerup", () => (pointerDownRef.current = false));

  const onEnterCell = (row: number, col: number) => {
    if (pointerDownRef.current === false) {
      return;
    }
    toggleCell(row, col);
  };

  const toggleCell = (row: number, col: number) => {
    props.setGrid((prev) => {
      const next = [...prev];
      next[row] = [...next[row]];
      next[row][col] = { ...next[row][col], Action: targetActionRef.current };
      return next;
    });
  };

  return (
    <div className="rounded-2xl">
      {props.grid.map((row, i) => (
        <div className="flex">
          {row.map((rangeCell, j) => (
            <GridCell
              action={rangeCell.Action}
              handKey={rangeCell.HandKey}
              row={i}
              col={j}
              onPointerEnter={onEnterCell}
              onPointerDown={onPointerDown}
              size={props.size}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const getRounding = (row: number, col: number) => {
  const size = "2xl";
  if (row == 0 && col == 0) {
    return `rounded-tl-${size}`;
  }
  if (row == 0 && col == 12) {
    return `rounded-tr-${size}`;
  }
  if (row == 12 && col == 0) {
    return `rounded-bl-${size}`;
  }
  if (row == 12 && col == 12) {
    return `rounded-br-${size}`;
  }
};

interface GridCellProps {
  action: PokerAction;
  handKey: string;
  row: number;
  col: number;
  size?: "default" | "small";
  onPointerEnter: (row: number, col: number) => void;
  onPointerDown: (current: PokerAction, row: number, col: number) => void;
}

const GridCell = (props: GridCellProps) => {
  const colour = props.action === "Fold" ? "bg-blue-400" : "bg-red-500";
  const hoverColour =
    props.action === "Fold" ? "hover:bg-blue-300" : "hover:bg-red-400";
  const rounding = getRounding(props.row, props.col);

  const width = props.size === "small" ? "w-9" : "w-13";
  const height = props.size === "small" ? "h-9" : "h-13";

  return (
    <Card
      className={`${colour} rounded-none ${rounding} ${width} ${height} ${hoverColour} select-none`}
      onPointerEnter={() => props.onPointerEnter(props.row, props.col)}
      onPointerDown={() =>
        props.onPointerDown(props.action, props.row, props.col)
      }
      onDragStart={(e) => e.preventDefault()}
    >
      {props.handKey}
    </Card>
  );
};
