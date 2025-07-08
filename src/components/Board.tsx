import type { CellData } from "../types";
import Box from "./Box";

interface BoardProps {
    board: Array<Array<CellData>>;
}

function Board({ board }: BoardProps) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            {board.map((row) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            flex: "row",
                        }}
                    >
                        {row.map((data) => {
                            return <Box data={data}></Box>;
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default Board;
