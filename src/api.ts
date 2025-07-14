import type { CardInfo, RangeInfo } from "./types";

interface HandResponse {
    id: string,
    hand: {
        firstCard: CardInfo
        secondCard: CardInfo
    }
}

const url = "http://localhost:5272"

export const fetchHand: (rangeId: number) => Promise<[string, CardInfo, CardInfo]> = async (rangeId: number) => {
    const response = await fetch(url + "/api/Poker/hand?rangeId=" + rangeId, {
        method: "GET",
    });
    const hand: HandResponse = await response.json();
    return [ hand.id, hand.hand.firstCard, hand.hand.secondCard ];
}

export const postAction = async (id: string, action: number) => {
    const response = await fetch(url + "/api/Poker/action", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            action: action,
        }),
    });
    const { correct: result } = await response.json();
    return result;
}

export const postReset = async (rangeId: number) => {
    await fetch(url + "/api/Poker/reset?rangeId=" + rangeId, {
        method: "POST",
    });
}

export const fetchBoard = async (rangeId: number) => {
    const response = await fetch(url + "/api/Poker/board?rangeId=" + rangeId, {
        method: 'GET',
    });
    const { data: board } = await response.json();
    return board;
}

export const fetchRanges = async () => {
    const response = await fetch(url + "/api/Poker/ranges", {
        method: 'GET',
    });
    const { data: ranges } : { data : Array<RangeInfo> } = await response.json();
    return ranges;
}