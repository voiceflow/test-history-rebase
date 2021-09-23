import { Constants } from '@voiceflow/general-types';
import { Overwrite } from 'utility-types';

import { BlockType, DistinctPlatform } from '@/constants';
import { Link, NodeData, NodeWithData } from '@/models';
import { NonNullishRecord, Point } from '@/types';

import { getDistinctPlatformValue } from './platform';
import { isMarkupOrCombinedBlockType } from './typeGuards';

const checkNodeType =
  <T>(type: BlockType) =>
  (data: { type: BlockType }): data is NodeData<T> =>
    data.type === type;

export const isFlowNode = checkNodeType<NodeData.Flow>(BlockType.FLOW);

export const isLinkedFlowNode = (
  data: NodeData<unknown>
): data is Overwrite<NodeData<NodeData.Flow>, NonNullishRecord<Pick<NodeData.Flow, 'diagramID'>>> => isFlowNode(data) && !!data.diagramID;

export const isCommandNode = checkNodeType<NodeData.Command>(BlockType.COMMAND);

export const isLinkedCommandNode = (
  data: NodeData<unknown>,
  platform: Constants.PlatformType
): data is NodeData<NodeData.Command> & Record<DistinctPlatform, NonNullishRecord<Pick<NodeData.Command.PlatformData, 'diagramID'>>> =>
  isCommandNode(data) && !!getDistinctPlatformValue(platform, data).diagramID;

export const isIntentNode = checkNodeType<NodeData.Intent>(BlockType.INTENT);

export const isLinkedIntentNode = (
  data: NodeData<unknown>,
  platform: Constants.PlatformType
): data is NodeData<NodeData.Intent> & Record<DistinctPlatform, NonNullishRecord<Pick<NodeData.Intent.PlatformData, 'intent'>>> =>
  isIntentNode(data) && !!getDistinctPlatformValue(platform, data).intent;

export const isChoiceNode = checkNodeType<NodeData.Interaction>(BlockType.CHOICE);

export const isPaymentNode = checkNodeType<NodeData.Payment>(BlockType.PAYMENT);

export const isLinkedPaymentNode = (
  data: NodeData<unknown>
): data is Overwrite<NodeData<NodeData.Payment>, NonNullishRecord<Pick<NodeData.Payment, 'productID'>>> => isPaymentNode(data) && !!data.productID;

export const isCancelPaymentNode = checkNodeType<NodeData.CancelPayment>(BlockType.CANCEL_PAYMENT);

export const isProductLinkedNode = (data: NodeData<unknown>): data is NodeData<{ productID: string }> =>
  (isPaymentNode(data) || isCancelPaymentNode(data)) && !!data.productID;

export const getNodesGroupCenter = (nodes: NodeWithData[], links: Link[]): Point => {
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

  return [centerX, centerY];
};
