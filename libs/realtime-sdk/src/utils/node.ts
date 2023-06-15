import { BlockType } from '@realtime-sdk/constants';
import { NodeData } from '@realtime-sdk/models';
import { NonNullishRecord } from '@voiceflow/common';
import { Overwrite } from 'utility-types';

const checkNodeType =
  <T>(type: BlockType) =>
  (data: { type: BlockType }): data is NodeData<T> =>
    data.type === type;

export const isComponentNode = checkNodeType<NodeData.Component>(BlockType.COMPONENT);

export const isLinkedComponentNode = (
  data: NodeData<unknown>
): data is Overwrite<NodeData<NodeData.Component>, NonNullishRecord<Pick<NodeData.Component, 'diagramID'>>> =>
  isComponentNode(data) && !!data.diagramID;

export const isDiagramNode = (data: NodeData<unknown>): data is NodeData<{ diagramID?: string }> => isComponentNode(data);

export const isLinkedDiagramNode = (data: NodeData<unknown>): data is NodeData<{ diagramID: string }> => isLinkedComponentNode(data);

export const isCommandNode = checkNodeType<NodeData.Command>(BlockType.COMMAND);

export const isIntentNode = checkNodeType<NodeData.Intent>(BlockType.INTENT);

export type LinkedIntentNode = NodeData<NodeData.Intent> & NonNullishRecord<Pick<NodeData.Intent.PlatformData, 'intent'>>;

export const isLinkedIntentNode = (data: NodeData<unknown>): data is LinkedIntentNode => isIntentNode(data) && !!data.intent;

export const isChoiceNode = checkNodeType<NodeData.Interaction>(BlockType.CHOICE);

export const isCustomBlockPointer = checkNodeType<NodeData.Pointer>(BlockType.CUSTOM_BLOCK_POINTER);

export const isPaymentNode = checkNodeType<NodeData.Payment>(BlockType.PAYMENT);

export const isLinkedPaymentNode = (
  data: NodeData<unknown>
): data is Overwrite<NodeData<NodeData.Payment>, NonNullishRecord<Pick<NodeData.Payment, 'productID'>>> => isPaymentNode(data) && !!data.productID;

export const isCancelPaymentNode = checkNodeType<NodeData.CancelPayment>(BlockType.CANCEL_PAYMENT);

export const isProductLinkedNode = (data: NodeData<unknown>): data is NodeData<{ productID: string }> =>
  (isPaymentNode(data) || isCancelPaymentNode(data)) && !!data.productID;
