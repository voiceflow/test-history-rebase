import { Block, DiagramNode, Port as DBPort, Step } from '@voiceflow/api-sdk';
import _isString from 'lodash/isString';

import { adapterLogger } from '@/client/adapters/utils';
import { BlockType, PlatformType } from '@/constants';
import { LinkData, Port } from '@/models';
import { objectID } from '@/utils';

import { IN_PORT_KEY } from './constants';

export const creatorLogger = adapterLogger.child('creator');

export const isSupportedBlockType = (type: BlockType) => Object.values(BlockType).includes(type);

export const getInPortID = (nodeID: string) => `${nodeID}${IN_PORT_KEY}`;

export const getAlternativePlatform = (platform: PlatformType) => (platform === PlatformType.ALEXA ? PlatformType.GOOGLE : PlatformType.ALEXA);

export const isBlock = (node: DiagramNode): node is Block => Array.isArray(node.data.steps) && !!node.coords;

export const isStep = (node: DiagramNode): node is Step => Array.isArray(node.data.ports);

export const generateInPort = (nodeID: string, { platform = null, virtual = false, label = '' }: Partial<Port> = {}): Port => ({
  platform,
  virtual,
  label,
  id: getInPortID(nodeID),
  nodeID,
});

export const generateOutPort = (nodeID: string, port: DBPort<LinkData>, settings?: Partial<Port>): Port => ({
  ...generateInPort(nodeID, settings),
  id: (_isString(port.id) && port.id) || objectID(),
  linkData: port.data,
});
