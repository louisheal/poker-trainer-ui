import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPositionShortLabel } from "@/drawRanges/actionSequence/spotSequence";
import type { PokerAction, PokerPosition } from "@/drawRanges/model";

interface Action {
  Position: string;
  Action: string;
}

interface Props {
  sequenceAction: Action;
  onUpdate: (action: PokerAction) => void;
}

// TODO : store this somewhere easy to find and edit
const Actions: PokerAction[] = ["Raise", "Fold"];
export const ActionPanel = (props: Props) => {
  return (
    <Card className="w-20 shrink-0 gap-0 rounded-lg bg-input/30 py-0 text-foreground ring-1 ring-secondary">
      <CardHeader className="h-6 items-center gap-0 px-2 pt-2 pb-0">
        <CardTitle className="w-full whitespace-normal break-words text-center text-sm leading-none text-white">
          {getPositionShortLabel(
            props.sequenceAction.Position as PokerPosition,
          )}
        </CardTitle>
      </CardHeader>
      {Actions.map((action) => {
        const selected = props.sequenceAction.Action === action;
        const actionBackground = selected
          ? "bg-secondary hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]"
          : "hover:bg-input/50";

        return (
          <CardContent className="p-0" key={action}>
            <Button
              variant={selected ? "secondary" : "ghost"}
              onClick={() => props.onUpdate(action)}
              className={`h-7 w-full justify-start rounded-none border-0 px-2 text-sm text-white ${actionBackground}`}
            >
              {action}
            </Button>
          </CardContent>
        );
      })}
    </Card>
  );
};
