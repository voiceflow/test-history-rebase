import { NodeData } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { FunctionNode } from '@voiceflow/dtos';

import { createBlockAdapter, createOutPortsAdapterV2, outPortDataFromDB, outPortDataToDB } from '../utils';

const functionAdapter = createBlockAdapter<NodeData.Function, Omit<FunctionNode['data'], 'portsV2'>>(
  ({ functionID, inputMapping, outputMapping, name }) => ({ functionID, inputMapping, outputMapping, name }),
  ({ functionID, inputMapping, outputMapping, name }) => ({ functionID, inputMapping, outputMapping, name })
);

export const functionOutPortsAdapterV2 = createOutPortsAdapterV2(
  (dbPorts, options) => {
    const dbNextPort = dbPorts.builtIn[BaseModels.PortType.NEXT];
    const nextPortData = dbNextPort && outPortDataFromDB(dbNextPort, options);
    return {
      dynamic: [],
      byKey: Utils.object.mapValue(dbPorts.byKey || {}, (port) => outPortDataFromDB(port!, options)),
      builtIn: {
        [BaseModels.PortType.NEXT]: nextPortData ?? undefined,
      },
    };
  },
  ({ byKey, builtIn: { [BaseModels.PortType.NEXT]: nextPortData } }) => ({
    dynamic: [],
    builtIn: {
      ...(nextPortData ? { [BaseModels.PortType.NEXT]: outPortDataToDB(nextPortData) } : {}),
    },
    byKey: Utils.object.mapValue(byKey, outPortDataToDB),
  })
);

export default functionAdapter;
