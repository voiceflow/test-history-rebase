import { BlockType } from '@realtime-sdk/constants';
import { DBPortWithLinkData, Port } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
// eslint-disable-next-line you-dont-need-lodash-underscore/is-string
import _isString from 'lodash/isString';

import { IN_PORT_KEY, MIGRATION_BLOCKS } from './constants';

export const getInPortID = (nodeID: string): string => `${nodeID}${IN_PORT_KEY}`;

export const isBlock = (node: BaseModels.BaseDiagramNode): node is BaseModels.BaseBlock => Array.isArray(node.data.steps) && !!node.coords;

export const isStep = (node: BaseModels.BaseDiagramNode): node is BaseModels.BaseStep => Array.isArray(node.data.ports);

export const generateInPort = (nodeID: string, { platform = null, virtual = false, label = '' }: Partial<Port> = {}): Port => ({
  platform,
  virtual,
  label,
  id: getInPortID(nodeID),
  nodeID,
});

export const generateOutPort = (nodeID: string, port: DBPortWithLinkData, settings?: Partial<Port>): Port => ({
  ...generateInPort(nodeID, settings),
  id: (_isString(port.id) && port.id) || Utils.id.objectID(),
  linkData: port.data,
});

export const needsMigration = (dbBlockType: string, appBlockType: BlockType): boolean => {
  return MIGRATION_BLOCKS.includes(dbBlockType) && dbBlockType !== appBlockType;
};
