interface ActionProps {
    fold: () => Promise<void>;
    raise: () => Promise<void>;
}

function Actions({ fold, raise }: ActionProps) {
    return (
        <div>
            <button onClick={async () => await fold()}>Fold</button>
            <button onClick={async () => await raise()}>Raise</button>
        </div>
    );
}

export default Actions;
