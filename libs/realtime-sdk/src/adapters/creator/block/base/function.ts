import { NodeData } from '@realtime-sdk/models';
import * as RealtimeUtilsPort from '@realtime-sdk/utils/port';
import { Utils } from '@voiceflow/common';
import { FunctionNode } from '@voiceflow/dtos';

import { createBlockAdapter, createOutPortsAdapterV2, outPortDataFromDB, outPortDataToDB } from '../utils';

const functionAdapter = createBlockAdapter<NodeData.Function, Omit<FunctionNode['data'], 'portsV2'>>(
  ({ functionID, inputMapping, outputMapping, name }) => ({ functionID, inputMapping, outputMapping, name }),
  ({ functionID, inputMapping, outputMapping, name }) => ({ functionID, inputMapping, outputMapping, name })
);

export const functionOutPortsAdapterV2 = createOutPortsAdapterV2(
  (dbPorts, options) => ({
    ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
    byKey: Utils.object.mapValue(dbPorts.byKey || {}, (port) => outPortDataFromDB(port!, options)),
  }),
  ({ byKey }) => ({
    ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
    byKey: Utils.object.mapValue(byKey, outPortDataToDB),
  })
);

export default functionAdapter;
