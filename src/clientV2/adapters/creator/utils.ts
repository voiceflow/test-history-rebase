import { Block, DiagramNode, Step } from '@voiceflow/api-sdk';

import { adapterLogger } from '@/client/adapters/utils';
import { BlockType, PlatformType } from '@/constants';

import { IN_PORT_KEY, OUT_PORT_KEY } from './constants';

export const creatorLogger = adapterLogger.child('creator');

export const isSupportedBlockType = (type: BlockType) => Object.values(BlockType).includes(type);

export const getLinkID = (portID: string, target: string) => `${portID}-${target}`;

export const getInPortID = (nodeID: string) => `${nodeID}${IN_PORT_KEY}`;

export const getOutPortID = (nodeID: string, index: number) => `${nodeID}-${index}${OUT_PORT_KEY}`;

export const getAlternativePlatform = (platform: PlatformType) => (platform === PlatformType.ALEXA ? PlatformType.GOOGLE : PlatformType.ALEXA);

export const isBlock = (node: DiagramNode): node is Block => {
  return Array.isArray(node.data.steps) && !!node.coords;
};

export const isStep = (node: DiagramNode): node is Step => {
  return Array.isArray(node.data.ports);
};
