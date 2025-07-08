import { useEffect, useState } from "react";
import "./App.css";
import type { CardInfo, CellData, RangeInfo } from "./types";
import { fetchBoard, fetchHand, fetchRanges, postAction } from "./api";
import Card from "./components/Card";
import Actions from "./components/Actions";
import Board from "./components/Board";
import RangeSelector from "./components/Ranges";

function App() {
    const [handId, setHandId] = useState<string>();
    const [firstCard, setFirstCard] = useState<CardInfo>();
    const [secondCard, setSecondCard] = useState<CardInfo>();

    const [board, setBoard] = useState<Array<Array<CellData>>>([]);
    const [, setResult] = useState<boolean>();

    const [ranges, setRanges] = useState<Array<RangeInfo>>([]);
    const [rangeId, setRangeId] = useState<number>(0);

    const loadHand = async (rangeId: number) => {
        const [id, first, second] = await fetchHand(rangeId);

        setHandId(id);
        setFirstCard(first);
        setSecondCard(second);
    };

    const loadBoard = async (rangeId: number) => {
        const board = await fetchBoard(rangeId);
        setBoard(board);
    };

    useEffect(() => {
        const loadRanges = async () => {
            const ranges = await fetchRanges();
            setRanges(ranges);
        };

        loadRanges();
        loadHand(rangeId);
        loadBoard(rangeId);
    }, [rangeId]);

    if (!handId || !firstCard || !secondCard) {
        // Loading wheel
        return <></>;
    }

    const doAction = async (action: number) => {
        const result = await postAction(handId, action);
        setResult(result);
        loadHand(rangeId);
        loadBoard(rangeId);
    };

    return (
        <div>
            <RangeSelector
                ranges={ranges}
                selected={rangeId}
                setSelected={setRangeId}
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <div>
                    <div>
                        <Card value={firstCard.value} suit={firstCard.suit} />
                        <Card value={secondCard.value} suit={secondCard.suit} />
                    </div>
                    <Actions
                        fold={() => doAction(0)}
                        raise={() => doAction(1)}
                    />
                </div>
                <Board board={board} />
            </div>
        </div>
    );
}

export default App;
