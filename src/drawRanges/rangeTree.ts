import {
  createThreeBetSequence,
  createRfiSequence,
  getPositionShortLabel,
  POKER_POSITIONS,
  RFI_POSITIONS,
  THREE_BET_RESPONSE_POSITIONS,
} from "@/drawRanges/actionSequence/spotSequence";
import type { PokerPosition, SequenceAction } from "@/drawRanges/model";

export interface RangeTreeNode {
  id: string;
  label: string;
  children?: readonly RangeTreeNode[];
  sequence?: readonly SequenceAction[];
}

const positionId = (position: PokerPosition) =>
  getPositionShortLabel(position).toLowerCase();

export const RANGE_TREE_ROOT: RangeTreeNode = {
  id: "draw-ranges",
  label: "Draw Ranges",
  children: [
    {
      id: "raise-first-in",
      label: "Raise First In",
      children: RFI_POSITIONS.map((position) => ({
        id: `rfi-${positionId(position)}`,
        label: getPositionShortLabel(position),
        sequence: createRfiSequence(position),
      })),
    },
    {
      id: "three-bet-call",
      label: "3Bet/Call",
      children: THREE_BET_RESPONSE_POSITIONS.map((responder) => {
        const responderIndex = POKER_POSITIONS.indexOf(responder);
        const openers = RFI_POSITIONS.filter(
          (opener) => POKER_POSITIONS.indexOf(opener) < responderIndex,
        );

        return {
          id: `three-bet-${positionId(responder)}`,
          label: getPositionShortLabel(responder),
          children: openers.map((opener) => ({
            id: `three-bet-${positionId(responder)}-${positionId(opener)}`,
            label: getPositionShortLabel(opener),
            sequence: createThreeBetSequence(opener, responder),
          })),
        };
      }),
    },
  ],
};

export const findRangeTreeNode = (
  nodeId: string,
  node: RangeTreeNode = RANGE_TREE_ROOT,
): RangeTreeNode | undefined => {
  if (node.id === nodeId) {
    return node;
  }

  for (const child of node.children ?? []) {
    const found = findRangeTreeNode(nodeId, child);
    if (found) {
      return found;
    }
  }
};

export const isRangeTreeNodeId = (value: unknown): value is string =>
  typeof value === "string" && findRangeTreeNode(value) !== undefined;

const getLeaves = (node: RangeTreeNode): RangeTreeNode[] => {
  if (node.sequence) {
    return [node];
  }

  return (node.children ?? []).flatMap(getLeaves);
};

export const createRandomSequenceForTreeNode = (
  nodeId: string,
  random: () => number = Math.random,
): SequenceAction[] => {
  const node = findRangeTreeNode(nodeId) ?? RANGE_TREE_ROOT;
  const leaves = getLeaves(node);
  const leafIndex = Math.min(
    Math.floor(random() * leaves.length),
    leaves.length - 1,
  );
  const sequence = leaves[leafIndex]?.sequence ?? [];

  return sequence.map((action) => ({ ...action }));
};
