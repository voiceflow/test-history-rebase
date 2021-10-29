import { NonNullishRecord } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { Overwrite } from 'utility-types';

import { BlockType, DistinctPlatform } from '../constants';
import { NodeData } from '../models';
import { getDistinctPlatformValue } from './platform';

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

export type LinkedIntentNode = NodeData<NodeData.Intent> & Record<DistinctPlatform, NonNullishRecord<Pick<NodeData.Intent.PlatformData, 'intent'>>>;

export const isLinkedIntentNode = (data: NodeData<unknown>, platform: Constants.PlatformType): data is LinkedIntentNode =>
  isIntentNode(data) && !!getDistinctPlatformValue(platform, data).intent;

export const isChoiceNode = checkNodeType<NodeData.Interaction>(BlockType.CHOICE);

export const isPaymentNode = checkNodeType<NodeData.Payment>(BlockType.PAYMENT);

export const isLinkedPaymentNode = (
  data: NodeData<unknown>
): data is Overwrite<NodeData<NodeData.Payment>, NonNullishRecord<Pick<NodeData.Payment, 'productID'>>> => isPaymentNode(data) && !!data.productID;

export const isCancelPaymentNode = checkNodeType<NodeData.CancelPayment>(BlockType.CANCEL_PAYMENT);

export const isProductLinkedNode = (data: NodeData<unknown>): data is NodeData<{ productID: string }> =>
  (isPaymentNode(data) || isCancelPaymentNode(data)) && !!data.productID;
