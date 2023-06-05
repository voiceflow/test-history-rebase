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
