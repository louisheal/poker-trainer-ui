interface CardProps {
    value: number;
    suit: number;
}

function getCardPath(value: number, suit: number) {
    const values = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
    ];
    const suits = ["C", "D", "H", "S"];

    return `/cards/${values[value]}${suits[suit]}.png`;
}

function Card({ value, suit }: CardProps) {
    const cardPath = getCardPath(value, suit);
    return <img src={cardPath} />;
}

export default Card;
