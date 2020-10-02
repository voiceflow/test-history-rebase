import { Overwrite } from 'utility-types';

import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';
import { NonNullishRecord } from '@/types';

const checkNodeType = <T>(type: BlockType) => (data: { type: BlockType }): data is NodeData<T> => data.type === type;

export const isDisplayNode = checkNodeType<NodeData.Display>(BlockType.DISPLAY);

export const isLinkedDisplayNode = (
  data: NodeData<unknown>
): data is Overwrite<NodeData<NodeData.Display>, NonNullishRecord<Pick<NodeData.Display, 'displayID'>>> => isDisplayNode(data) && !!data.displayID;

export const isFlowNode = checkNodeType<NodeData.Flow>(BlockType.FLOW);

export const isLinkedFlowNode = (
  data: NodeData<unknown>
): data is Overwrite<NodeData<NodeData.Flow>, NonNullishRecord<Pick<NodeData.Flow, 'diagramID'>>> => isFlowNode(data) && !!data.diagramID;

export const isCommandNode = checkNodeType<NodeData.Command>(BlockType.COMMAND);

export const isLinkedCommandNode = (
  data: NodeData<unknown>,
  platform: PlatformType
): data is NodeData<NodeData.Command> & Record<typeof platform, NonNullishRecord<Pick<NodeData.Command.PlatformData, 'diagramID'>>> =>
  isCommandNode(data) && !!data[platform].diagramID;

export const isIntentNode = checkNodeType<NodeData.Intent>(BlockType.INTENT);

export const isLinkedIntentNode = (
  data: NodeData<unknown>,
  platform: PlatformType
): data is NodeData<NodeData.Intent> & Record<typeof platform, NonNullishRecord<Pick<NodeData.Intent.PlatformData, 'intent'>>> =>
  isIntentNode(data) && !!data[platform].intent;

export const isChoiceNode = checkNodeType<NodeData.Interaction>(BlockType.CHOICE);

export const isPaymentNode = checkNodeType<NodeData.Payment>(BlockType.PAYMENT);

export const isLinkedPaymentNode = (
  data: NodeData<unknown>
): data is Overwrite<NodeData<NodeData.Payment>, NonNullishRecord<Pick<NodeData.Payment, 'productID'>>> => isPaymentNode(data) && !!data.productID;

export const isCancelPaymentNode = checkNodeType<NodeData.CancelPayment>(BlockType.CANCEL_PAYMENT);

export const isProductLinkedNode = (data: NodeData<unknown>): data is NodeData<{ productID: string }> =>
  (isPaymentNode(data) || isCancelPaymentNode(data)) && !!data.productID;
