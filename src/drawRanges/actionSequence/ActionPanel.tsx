import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Action {
  Position: string;
  Action: string;
}

interface Props {
  action: Action;
  highlight?: boolean;
}

export const ActionPanel = (props: Props) => {
  return (
    <Card className="w-25">
      <CardHeader>
        <CardTitle>{props.action.Position}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{props.action.Action}</p>
      </CardContent>
    </Card>
  );
};
