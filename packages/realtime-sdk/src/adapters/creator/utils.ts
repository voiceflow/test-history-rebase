import { BlockType } from '@realtime-sdk/constants';
import { DBPortWithLinkData, Port } from '@realtime-sdk/models';
import { getInPortID } from '@realtime-sdk/utils/port';
import { Utils } from '@voiceflow/common';

import { MIGRATION_BLOCKS } from './constants';

export const generateInPort = (nodeID: string, { label = '' }: Partial<Port> = {}): Port => ({
  label,
  id: getInPortID(nodeID),
  nodeID,
});

export const generateOutPort = (nodeID: string, port?: DBPortWithLinkData, settings?: Partial<Port>): Port => ({
  ...generateInPort(nodeID, settings),
  id: (typeof port?.id === 'string' && port.id) || Utils.id.objectID(),
  linkData: port?.data,
});

export const needsMigration = (dbBlockType: string, appBlockType: BlockType): boolean => {
  return MIGRATION_BLOCKS.includes(dbBlockType) && dbBlockType !== appBlockType;
};
