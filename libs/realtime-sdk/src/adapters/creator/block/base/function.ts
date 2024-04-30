import { Utils } from '@voiceflow/common';
import type { FunctionNode } from '@voiceflow/dtos';

import type { NodeData } from '@/models';
import * as RealtimeUtilsPort from '@/utils/port';

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
