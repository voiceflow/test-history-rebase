import { Block, DiagramNode, Port as DBPort, Step } from '@voiceflow/api-sdk';
import _isString from 'lodash/isString';

import { adapterLogger } from '@/client/adapters/utils';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { FeatureFlagMap } from '@/ducks/feature';
import { LinkData, Port } from '@/models';
import { objectID } from '@/utils';

import { IN_PORT_KEY } from './constants';

export const creatorLogger = adapterLogger.child('creator');

export const getInPortID = (nodeID: string) => `${nodeID}${IN_PORT_KEY}`;

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

export const getBlockType = ({
  type,
  data,
  features,
  toDB,
}: {
  type: BlockType | string;
  data?: DiagramNode['data'];
  features?: FeatureFlagMap;
  toDB?: boolean;
}): BlockType => {
  if (data?.deprecatedType) {
    return BlockType.DEPRECATED;
  }

  // FE should always have BlockType _v1, if FF is enabled then send V2 of the BlockType

  if (toDB) {
    switch (type) {
      case BlockType.IF:
      case BlockType.IFV2:
        return features?.[FeatureFlag.CONDITIONS_BUILDER]?.isEnabled ? BlockType.IFV2 : BlockType.IF;
      case BlockType.SET:
      case BlockType.SETV2:
        return features?.[FeatureFlag.CONDITIONS_BUILDER]?.isEnabled ? BlockType.SETV2 : BlockType.SET;
      default:
        return type as BlockType;
    }
  } else {
    switch (type) {
      case BlockType.IFV2:
      case BlockType.IF:
        return BlockType.IF;
      case BlockType.SETV2:
      case BlockType.SET:
        return BlockType.SET;
      default:
        return type as BlockType;
    }
  }
};
