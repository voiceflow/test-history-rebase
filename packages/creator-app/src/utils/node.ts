import { Utils } from '@voiceflow/realtime-sdk';

import { Link, NodeWithData } from '@/models';
import { Point } from '@/types';

import { isMarkupOrCombinedBlockType } from './typeGuards';

export const {
  isFlowNode,
  isLinkedFlowNode,
  isCommandNode,
  isLinkedCommandNode,
  isIntentNode,
  isLinkedIntentNode,
  isChoiceNode,
  isPaymentNode,
  isLinkedPaymentNode,
  isCancelPaymentNode,
  isProductLinkedNode,
} = Utils.node;

export const getNodesGroupCenter = (
  nodes: NodeWithData[],
  links: Link[]
): { center: Point; minX: number; maxX: number; minY: number; maxY: number } => {
  const combinedAndMarkupNodes = nodes.filter(({ node }) => isMarkupOrCombinedBlockType(node.type));

  const nodeXs = combinedAndMarkupNodes.map(({ node: { x } }) => x);
  const nodeYs = combinedAndMarkupNodes.map(({ node: { y } }) => y);
  const linkXs = links.flatMap(({ data }) => data?.points?.map(({ point }) => point[0]) ?? []);
  const linkYs = links.flatMap(({ data }) => data?.points?.map(({ point }) => point[1]) ?? []);

  const minX = Math.min(...nodeXs, ...linkXs);
  const maxX = Math.max(...nodeXs, ...linkXs);
  const minY = Math.min(...nodeYs, ...linkYs);
  const maxY = Math.max(...nodeYs, ...linkYs);

  const [centerX, centerY] = [minX + (maxX - minX) / 2, minY + (maxY - minY) / 2];

  return { center: [centerX, centerY], minX, maxX, minY, maxY };
};
