import { ActionPanel } from "@/drawRanges/actionSequence/ActionPanel";
import type {
  PokerAction,
  PokerPosition,
  SequenceAction,
} from "@/drawRanges/model";
import { getNextPosition } from "@/drawRanges/actionSequence/spotSequence";
import { ChevronRight } from "lucide-react";

interface Props {
  sequence: SequenceAction[];
  onUpdate?: (position: PokerPosition, action: PokerAction) => void;
}

// TODO : add id to sequence actions
export const ActionSequence = ({ sequence, onUpdate = () => {} }: Props) => {
  const nextPosition = getNextPosition(sequence.length);

  return (
    <div className="mx-2 w-[calc(100%-1rem)] max-w-2xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:w-full">
      <div className="flex w-max min-w-full items-center justify-center gap-0.5 py-1 sm:gap-1">
        {sequence.map((sequenceAction) => (
          <div
            className="flex items-center gap-0.5 sm:gap-1"
            key={sequenceAction.Position}
          >
            <ActionPanel
              sequenceAction={sequenceAction}
              onUpdate={(action: PokerAction) =>
                onUpdate(sequenceAction.Position, action)
              }
            />
            <ChevronRight className="size-4 shrink-0" />
          </div>
        ))}
        {/* TODO : work out what the next position to act is */}
        <ActionPanel
          sequenceAction={{ Position: nextPosition, Action: "?" }}
          onUpdate={(action) => onUpdate(nextPosition, action)}
        />
      </div>
    </div>
  );
};
