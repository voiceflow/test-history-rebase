import { Overwrite } from 'utility-types';

import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

const checkNodeType = <T>(type: BlockType) => (data: { type: BlockType }): data is NodeData<T> => data.type === type;

export const isDisplayNode = checkNodeType<NodeData.Display>(BlockType.DISPLAY);

export const isLinkedeDisplayNode = (data: NodeData<unknown>): data is Overwrite<NodeData<NodeData.Display>, { displayID: string }> =>
  isDisplayNode(data) && !!data.displayID;

export const isFlowNode = checkNodeType<NodeData.Flow>(BlockType.FLOW);

export const isLinkedeFlowNode = (data: NodeData<unknown>): data is Overwrite<NodeData<NodeData.Flow>, { diagramID: string }> =>
  isFlowNode(data) && !!data.diagramID;

export const isCommandNode = checkNodeType<NodeData.Command>(BlockType.COMMAND);

export const isLinkedCommandNode = (
  data: NodeData<unknown>,
  platform: PlatformType
): data is NodeData<NodeData.Command> & Record<typeof platform, { diagramID: string }> => isCommandNode(data) && !!data[platform].diagramID;
