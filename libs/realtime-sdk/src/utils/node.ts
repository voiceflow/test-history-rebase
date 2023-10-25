import { BlockType } from '@realtime-sdk/constants';
import { NodeData } from '@realtime-sdk/models';

const checkNodeType =
  <T>(type: BlockType) =>
  (data: { type: BlockType }): data is NodeData<T> =>
    data.type === type;

export const isComponentNode = checkNodeType<NodeData.Component>(BlockType.COMPONENT);

export const isDiagramNode = (data: NodeData<unknown>): data is NodeData<{ diagramID?: string }> => isComponentNode(data);

export const isCommandNode = checkNodeType<NodeData.Command>(BlockType.COMMAND);

export const isIntentNode = checkNodeType<NodeData.Intent>(BlockType.INTENT);

export const isGoToIntentNode = checkNodeType<NodeData.GoToIntent>(BlockType.GO_TO_INTENT);

export const isChoiceNode = checkNodeType<NodeData.Interaction>(BlockType.CHOICE);

export const isCustomBlockPointer = checkNodeType<NodeData.Pointer>(BlockType.CUSTOM_BLOCK_POINTER);

export const isPaymentNode = checkNodeType<NodeData.Payment>(BlockType.PAYMENT);

export const isCancelPaymentNode = checkNodeType<NodeData.CancelPayment>(BlockType.CANCEL_PAYMENT);

export const isProductLinkedNode = (data: NodeData<unknown>): data is NodeData<{ productID: string }> =>
  (isPaymentNode(data) || isCancelPaymentNode(data)) && !!data.productID;
