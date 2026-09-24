import { Card } from "@/components/ui/card";
import type { PokerAction, PokerRange } from "@/drawRanges/model";
import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";

interface Props {
  grid: PokerRange;
  setGrid: (prev: PokerRange | ((prev: PokerRange) => PokerRange)) => void;
  size?: "default" | "small";
}

export const RangeGrid = (props: Props) => {
  const pointerDownRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const targetActionRef = useRef<PokerAction>("Raise");

  const clearPointerState = () => {
    pointerDownRef.current = false;
    activePointerIdRef.current = null;
  };

  useEffect(() => {
    window.addEventListener("pointerup", clearPointerState);
    window.addEventListener("pointercancel", clearPointerState);
    return () => {
      window.removeEventListener("pointerup", clearPointerState);
      window.removeEventListener("pointercancel", clearPointerState);
    };
  }, []);

  const onPointerDown = (
    event: PointerEvent<HTMLDivElement>,
    current: PokerAction,
    row: number,
    col: number,
  ) => {
    const targetAction = current === "Fold" ? "Raise" : "Fold";
    targetActionRef.current = targetAction;
    pointerDownRef.current = true;
    activePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    toggleCell(row, col);
  };

  const onEnterCell = (row: number, col: number) => {
    if (pointerDownRef.current === false) {
      return;
    }
    toggleCell(row, col);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (
      pointerDownRef.current === false ||
      activePointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const hoveredCell = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-grid-cell='true']");

    if (!hoveredCell) {
      return;
    }

    const row = Number(hoveredCell.dataset.row);
    const col = Number(hoveredCell.dataset.col);
    if (Number.isNaN(row) || Number.isNaN(col)) {
      return;
    }

    toggleCell(row, col);
    event.preventDefault();
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current === event.pointerId) {
      clearPointerState();
    }
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
    <div className="w-full max-w-full overflow-x-auto pb-1">
      <div
        className="inline-flex touch-none select-none flex-col rounded-2xl"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
      {props.grid.map((row, i) => (
        <div className="flex" key={`row-${i}`}>
          {row.map((rangeCell, j) => (
            <GridCell
              key={rangeCell.HandKey}
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
  onPointerDown: (
    event: PointerEvent<HTMLDivElement>,
    current: PokerAction,
    row: number,
    col: number,
  ) => void;
}

const GridCell = (props: GridCellProps) => {
  const colour = props.action === "Fold" ? "bg-blue-400" : "bg-red-500";
  const hoverColour =
    props.action === "Fold" ? "hover:bg-blue-300" : "hover:bg-red-400";
  const rounding = getRounding(props.row, props.col);

  const dimensions =
    props.size === "small"
      ? "h-6 w-6 text-[9px] sm:h-7 sm:w-7 sm:text-[10px] md:h-9 md:w-9 md:text-xs"
      : "h-8 w-8 text-[10px] sm:h-10 sm:w-10 sm:text-xs md:h-13 md:w-13 md:text-sm";

  return (
    <Card
      data-grid-cell="true"
      data-row={props.row}
      data-col={props.col}
      className={`${colour} rounded-none ${rounding} ${dimensions} ${hoverColour} touch-none select-none items-center justify-center p-0 text-center leading-none`}
      onPointerEnter={() => props.onPointerEnter(props.row, props.col)}
      onPointerDown={(event) =>
        props.onPointerDown(event, props.action, props.row, props.col)
      }
      onDragStart={(e) => e.preventDefault()}
    >
      {props.handKey}
    </Card>
  );
};
