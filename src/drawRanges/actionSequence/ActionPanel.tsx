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
    <Card className="w-25">
      <CardHeader>
        <CardTitle>{props.sequenceAction.Position}</CardTitle>
      </CardHeader>
      {Actions.map((action) => (
        <CardContent>
          <Button
            variant={
              props.sequenceAction.Action === action ? "outline" : "default"
            }
            onClick={() => props.onUpdate(action)}
          >
            {action}
          </Button>
        </CardContent>
      ))}
    </Card>
  );
};
