import { NodeData } from '@realtime-sdk/models';
import * as RealtimeUtilsPort from '@realtime-sdk/utils/port';
import { Utils } from '@voiceflow/common';
import { ButtonsV2NodeData } from '@voiceflow/dtos';

import { createBlockAdapter, createOutPortsAdapterV2, outPortDataFromDB, outPortDataToDB } from '../utils';

export const buttonsV2Adapter = createBlockAdapter<Omit<ButtonsV2NodeData, 'portsV2'>, NodeData.ButtonsV2>(
  ({ name, items, noReply, noMatch, listenForOtherTriggers }) => ({
    name,
    items,
    noReply,
    noMatch,
    listenForOtherTriggers,
  }),
  ({ name, items, noReply, noMatch, listenForOtherTriggers }) => ({
    name,
    items,
    noReply,
    noMatch,
    listenForOtherTriggers,
  })
);

export const buttonsV2OutPortsAdapterV2 = createOutPortsAdapterV2(
  (dbPorts, options) => ({
    ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
    byKey: Utils.object.mapValue(dbPorts.byKey || {}, (port) => outPortDataFromDB(port, options)),
  }),
  ({ byKey }) => ({
    ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
    byKey: Utils.object.mapValue(byKey, outPortDataToDB),
  })
);
