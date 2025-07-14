interface ActionProps {
    fold: () => Promise<void>;
    raise: () => Promise<void>;
    reset: () => Promise<void>;
}

function Actions({ fold, raise, reset }: ActionProps) {
    return (
        <>
            <div>
                <button onClick={async () => await fold()}>Fold</button>
                <button onClick={async () => await raise()}>Raise</button>
            </div>
            <button onClick={async () => await reset()}>Reset</button>
        </>
    );
}

export default Actions;
