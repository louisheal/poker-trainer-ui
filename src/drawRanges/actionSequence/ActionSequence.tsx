import { ActionPanel } from "@/drawRanges/actionSequence/ActionPanel";
import type { SequenceAction } from "@/drawRanges/model";
import { ChevronRight } from "lucide-react";

interface Props {
  sequence: SequenceAction[];
}

// TODO : add id to sequence actions
export const ActionSequence = (props: Props) => {
  return (
    <div className="flex gap-3 items-center">
      {props.sequence.map((action) => (
        <>
          <ActionPanel action={action} />
          <ChevronRight />
        </>
      ))}
      {/* TODO : work out what the next position to act is */}
      <ActionPanel action={{ Position: "You", Action: "?" }} />
    </div>
  );
};
