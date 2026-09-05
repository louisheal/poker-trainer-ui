import { ActionPanel } from "@/drawRanges/actionSequence/ActionPanel";
import type {
  PokerAction,
  PokerPosition,
  SequenceAction,
} from "@/drawRanges/model";
import { ChevronRight } from "lucide-react";

interface Props {
  sequence: SequenceAction[];
  onUpdate?: (position: PokerPosition, action: PokerAction) => void;
}

const PokerPositions: PokerPosition[] = [
  "Lojack",
  "Hijack",
  "Cutoff",
  "Button",
  "Small Blind",
  "Big Blind",
];

// TODO : add id to sequence actions
export const ActionSequence = ({ sequence, onUpdate = () => {} }: Props) => {
  const nextPosition = PokerPositions[sequence.length];

  return (
    <div className="flex gap-3 items-center">
      {sequence.map((sequenceAction) => (
        <>
          <ActionPanel
            sequenceAction={sequenceAction}
            onUpdate={(action: PokerAction) =>
              onUpdate(sequenceAction.Position, action)
            }
          />
          <ChevronRight />
        </>
      ))}
      {/* TODO : work out what the next position to act is */}
      <ActionPanel
        sequenceAction={{ Position: nextPosition, Action: "?" }}
        onUpdate={(action) => onUpdate(nextPosition, action)}
      />
    </div>
  );
};
