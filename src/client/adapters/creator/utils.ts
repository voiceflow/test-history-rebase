import { BlockType, PlatformType } from '@/constants';
import { DBNode, Port } from '@/models';
import PORT_LABELS from '@/pages/Canvas/managers/labels';
import { Point } from '@/types';

import { adapterLogger } from '../utils';
import {
  INVOCATION_NODE_ID_PREFIX,
  NODE_HEIGHT_DIFFERENCE,
  NODE_WIDTH_DIFFERENCE,
  VIRTUAL_NODE_ID_PREFIX,
  VIRTUAL_PORT_ID_PREFIX,
} from './constants';

export const creatorLogger = adapterLogger.child('creator');

export const isSupportedBlockType = (type: BlockType) => Object.values(BlockType).includes(type);

export const getVirtualPortID = (nodeID: string) => `${VIRTUAL_PORT_ID_PREFIX}${nodeID}`;

export const getVirtualNodeID = (nodeID: string) => `${VIRTUAL_NODE_ID_PREFIX}${nodeID}`;

export const getInvocationNodeID = (nodeID: string) => `${INVOCATION_NODE_ID_PREFIX}${nodeID}`;

export const findDiagramCenter = (nodes: DBNode.WithCoords[]): Point => {
  const xValues = nodes.map((node) => node.x);
  const yValues = nodes.map((node) => node.y);

  const maxX = Math.max(...xValues);
  const minX = Math.min(...xValues);
  const maxY = Math.max(...yValues);
  const minY = Math.min(...yValues);

  return [(maxX - minX) / 2, (maxY - minY) / 2];
};

export const spreadOutNodes = (nodes: DBNode.WithCoords[], [centerX, centerY]: Point) =>
  nodes.map((node) => ({
    ...node,
    x: centerX + (node.x - centerX) * NODE_WIDTH_DIFFERENCE,
    y: centerY + (node.y - centerY) * NODE_HEIGHT_DIFFERENCE,
  }));

export const getAlternativePlatform = (platform: PlatformType) => (platform === PlatformType.ALEXA ? PlatformType.GOOGLE : PlatformType.ALEXA);

export const getPortLabel = (port: Port, type: BlockType | undefined, index: number | undefined, platform: PlatformType) => {
  if (type !== BlockType.STREAM) {
    return PORT_LABELS[type!]?.(port, index!, platform);
  }

  if (port.platform !== PlatformType.ALEXA) {
    return null;
  }

  switch (index) {
    case 1:
      return 'next';
    case 2:
      return 'previous';
    case 3:
      return 'pause';
    default:
      return null;
  }
};
