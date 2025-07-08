import type { CellData } from "../types";

interface BoxProps {
    data: CellData;
}

function Box({ data }: BoxProps) {
    let green = 255 * 2 * (data.correct / data.total);
    let red = 255 * 2 * (1 - data.correct / data.total);

    let b = 255 - (green * red) / 2;

    if (data.total == 0) {
        green = 0;
        red = 0;
    }

    return (
        <div
            style={{
                height: "36px",
                width: "36px",
                backgroundColor: `rgb(${red}, ${green}, 0)`,
                color: `rgb(${b}, ${b}, ${b})`,
                alignItems: "center",
                justifyItems: "center",
            }}
        >
            <p>{data.label}</p>
        </div>
    );
}

export default Box;
