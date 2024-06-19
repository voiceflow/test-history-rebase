import { NodeData } from '@realtime-sdk/models';
import * as RealtimeUtilsPort from '@realtime-sdk/utils/port';
import { Utils } from '@voiceflow/common';
import { MessageNode } from '@voiceflow/dtos';

import { createBlockAdapter, createOutPortsAdapterV2, outPortDataFromDB, outPortDataToDB } from '../utils';

export const messageAdapter = createBlockAdapter<NodeData.Message, Omit<MessageNode['data'], 'portsV2'>>(
  ({ messageID, draft, name }) => ({ messageID, draft, name }),
  ({ messageID, draft, name }) => ({ messageID, draft, name })
);

export const messageOutPortsAdapterV2 = createOutPortsAdapterV2(
  (dbPorts, options) => ({
    ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
    byKey: Utils.object.mapValue(dbPorts.byKey || {}, (port) => outPortDataFromDB(port!, options)),
  }),
  ({ byKey }) => ({
    ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
    byKey: Utils.object.mapValue(byKey, outPortDataToDB),
  })
);
