import type { RangeInfo } from "../types";

interface RangeProps {
    ranges: Array<RangeInfo>;
    selected: number;
    setSelected: (rangeId: number) => void;
}

function RangeSelector({ ranges, setSelected }: RangeProps) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
            }}
        >
            {ranges.map((range) => (
                <button
                    // aria-selected={range.rangeId == selected}
                    // color={range.rangeId == selected ? "black" : "white"}
                    onClick={() => setSelected(range.rangeId)}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
}

export default RangeSelector;
