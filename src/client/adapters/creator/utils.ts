import { Block, DiagramNode, Port as DBPort, Step } from '@voiceflow/api-sdk';
import _isString from 'lodash/isString';

import { adapterLogger } from '@/client/adapters/utils';
import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { FeatureFlagMap } from '@/ducks/feature';
import { LinkData, Port } from '@/models';
import { objectID } from '@/utils';

import { IN_PORT_KEY, MIGRATION_BLOCKS } from './constants';

export const creatorLogger = adapterLogger.child('creator');

export const getInPortID = (nodeID: string): string => `${nodeID}${IN_PORT_KEY}`;

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

export const needsMigration = (dbBlockType: string, appBlockType: BlockType, features: FeatureFlagMap): boolean => {
  const isFeatureEnabled = features?.[FeatureFlag.CONDITIONS_BUILDER];

  return !!isFeatureEnabled?.isEnabled && MIGRATION_BLOCKS.includes(dbBlockType) && dbBlockType !== appBlockType;
};
