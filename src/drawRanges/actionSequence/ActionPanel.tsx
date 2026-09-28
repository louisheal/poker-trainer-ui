import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PokerAction } from "@/drawRanges/model";

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
    <Card className="w-20 sm:w-24 md:w-25">
      <CardHeader>
        <CardTitle className="text-xs sm:text-sm">{props.sequenceAction.Position}</CardTitle>
      </CardHeader>
      {Actions.map((action) => (
        <CardContent key={action}>
          <Button
            variant={
              props.sequenceAction.Action === action ? "outline" : "default"
            }
            onClick={() => props.onUpdate(action)}
            className="w-full text-xs sm:text-sm"
          >
            {action}
          </Button>
        </CardContent>
      ))}
    </Card>
  );
};
