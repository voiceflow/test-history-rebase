import * as RealtimeUtilsPort from '@realtime-sdk/utils/port';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { NodeData } from '../../../../models';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  findDBNoMatchPort,
  findDBPortByType,
  outPortDataFromDB,
  outPortDataToDB,
} from '../utils';

const cardV2Adapter = createBlockAdapter<Omit<BaseNode.CardV2.StepData, 'noMatch' | 'noReply'>, Omit<NodeData.CardV2, 'noMatch' | 'noReply'>>(
  ({ cards, layout }) => ({
    cards,
    layout,
  }),
  ({ cards, layout }) => ({
    cards,
    layout,
  })
);

export const cardV2OutPortsAdapter = createOutPortsAdapter<NodeData.CardV2BuiltInPorts, NodeData.CardV2>(
  (dbPorts, options) => {
    const dbNoMatchPort = findDBNoMatchPort(dbPorts);
    const dbNoReplyPort = findDBPortByType(dbPorts, BaseModels.PortType.NO_REPLY);

    const noMatchPortData = dbNoMatchPort && outPortDataFromDB(dbNoMatchPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      builtIn: {
        [BaseModels.PortType.NO_MATCH]: noMatchPortData ?? undefined,
        [BaseModels.PortType.NO_REPLY]: noReplyPortData ?? undefined,
      },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NO_MATCH]: noMatchPortData, [BaseModels.PortType.NO_REPLY]: noReplyPortData } }) => [
    ...[noMatchPortData && outPortDataToDB(noMatchPortData)].filter(Utils.array.isNotNullish),
    ...[noReplyPortData && outPortDataToDB(noReplyPortData)].filter(Utils.array.isNotNullish),
  ]
);

export const cardV2OutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CardV2BuiltInPorts, NodeData.CardV2>(
  (dbPorts, options) => {
    const dbNoReplyPort = dbPorts.builtIn[BaseModels.PortType.NO_REPLY];
    const dbNoMatchPort = dbPorts.builtIn[BaseModels.PortType.NO_MATCH];

    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);
    const noMatchPortData = dbNoMatchPort && outPortDataFromDB(dbNoMatchPort, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      byKey: Utils.object.mapValue(dbPorts.byKey || {}, (port) => outPortDataFromDB(port, options)),
      builtIn: {
        [BaseModels.PortType.NO_MATCH]: noMatchPortData,
        [BaseModels.PortType.NO_REPLY]: noReplyPortData ?? undefined,
      },
    };
  },
  ({ byKey, builtIn: { [BaseModels.PortType.NO_MATCH]: noMatchPortData, [BaseModels.PortType.NO_REPLY]: noReplyPortData } }) => ({
    ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
    byKey: Utils.object.mapValue(byKey, outPortDataToDB),
    builtIn: {
      ...(noReplyPortData ? { [BaseModels.PortType.NO_REPLY]: outPortDataToDB(noReplyPortData) } : {}),
      ...(noMatchPortData ? { [BaseModels.PortType.NO_MATCH]: outPortDataToDB(noMatchPortData) } : {}),
    },
  })
);

export default cardV2Adapter;
