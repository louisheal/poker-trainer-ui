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
    <div className="w-full overflow-x-auto">
      <div className="flex w-fit min-w-full items-center gap-2 pb-1 sm:gap-3">
        {sequence.map((sequenceAction) => (
          <div
            className="flex items-center gap-2 sm:gap-3"
            key={sequenceAction.Position}
          >
            <ActionPanel
              sequenceAction={sequenceAction}
              onUpdate={(action: PokerAction) =>
                onUpdate(sequenceAction.Position, action)
              }
            />
            <ChevronRight className="shrink-0" />
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
