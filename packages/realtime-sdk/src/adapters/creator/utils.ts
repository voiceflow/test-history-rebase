import { BaseBlock, BaseDiagramNode, BasePort, BaseStep } from '@voiceflow/api-sdk';
// eslint-disable-next-line you-dont-need-lodash-underscore/is-string
import _isString from 'lodash/isString';

import { BlockType } from '../../constants';
import { LinkData, Port } from '../../models';
import { objectID } from '../../utils/id';
import { IN_PORT_KEY, MIGRATION_BLOCKS } from './constants';

export const getInPortID = (nodeID: string): string => `${nodeID}${IN_PORT_KEY}`;

export const isBlock = (node: BaseDiagramNode): node is BaseBlock => Array.isArray(node.data.steps) && !!node.coords;

export const isStep = (node: BaseDiagramNode): node is BaseStep => Array.isArray(node.data.ports);

export const generateInPort = (nodeID: string, { platform = null, virtual = false, label = '' }: Partial<Port> = {}): Port => ({
  platform,
  virtual,
  label,
  id: getInPortID(nodeID),
  nodeID,
});

export const generateOutPort = (nodeID: string, port: BasePort<LinkData>, settings?: Partial<Port>): Port => ({
  ...generateInPort(nodeID, settings),
  id: (_isString(port.id) && port.id) || objectID(),
  linkData: port.data,
});

export const needsMigration = (dbBlockType: string, appBlockType: BlockType): boolean => {
  return MIGRATION_BLOCKS.includes(dbBlockType) && dbBlockType !== appBlockType;
};
