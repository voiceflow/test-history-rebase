import * as RealtimeUtilsPort from '@realtime-sdk/utils/port';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type { VoiceflowNode } from '@voiceflow/voiceflow-types';

import type { NodeData } from '../../../../models';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  findDBNextPort,
  findDBNoMatchPort,
  findDBPortByType,
  outPortDataFromDB,
  outPortDataToDB,
} from '../utils';

const cardV2Adapter = createBlockAdapter<
  Omit<VoiceflowNode.CardV2.StepData, 'noMatch' | 'noReply'>,
  Omit<NodeData.CardV2, 'noMatch' | 'noReply'>
>(
  ({ title, buttons, imageUrl, description }) => ({ title, buttons, imageUrl, description }),
  ({ title, buttons, imageUrl, description }) => ({ title, buttons, imageUrl, description })
);

export const cardV2OutPortsAdapter = createOutPortsAdapter<NodeData.CardV2BuiltInPorts, NodeData.CardV2>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);
    const dbNoReplyPort = findDBPortByType(dbPorts, BaseModels.PortType.NO_REPLY);
    const dbNoMatchPort = findDBNoMatchPort(dbPorts);

    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);
    const nextPortData = dbNextPort && outPortDataFromDB(dbNextPort, options);
    const noMatchPortData = dbNoMatchPort && outPortDataFromDB(dbNoMatchPort, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      builtIn: {
        [BaseModels.PortType.NEXT]: nextPortData ?? undefined,
        [BaseModels.PortType.NO_MATCH]: noMatchPortData ?? undefined,
        [BaseModels.PortType.NO_REPLY]: noReplyPortData ?? undefined,
      },
    };
  },
  ({
    builtIn: {
      [BaseModels.PortType.NEXT]: nextPortData,
      [BaseModels.PortType.NO_MATCH]: noMatchPortData,
      [BaseModels.PortType.NO_REPLY]: noReplyPortData,
    },
  }) => [
    ...[nextPortData && outPortDataToDB(nextPortData)].filter(Utils.array.isNotNullish),
    ...[noReplyPortData && outPortDataToDB(noReplyPortData)].filter(Utils.array.isNotNullish),
    ...[noMatchPortData && outPortDataToDB(noMatchPortData)].filter(Utils.array.isNotNullish),
  ]
);

export const cardV2OutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CardV2BuiltInPorts, NodeData.CardV2>(
  (dbPorts, options) => {
    const dbNoMatchPort = dbPorts.builtIn[BaseModels.PortType.NO_MATCH];
    const dbNextPort = dbPorts.builtIn[BaseModels.PortType.NEXT];
    const dbNoReplyPort = dbPorts.builtIn[BaseModels.PortType.NO_REPLY];
    const noMatchPortData = dbNoMatchPort && outPortDataFromDB(dbNoMatchPort, options);
    const nextPortData = dbNextPort && outPortDataFromDB(dbNextPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      byKey: Utils.object.mapValue(dbPorts.byKey || {}, (port) => outPortDataFromDB(port!, options)),
      builtIn: {
        [BaseModels.PortType.NO_REPLY]: noReplyPortData ?? undefined,
        [BaseModels.PortType.NO_MATCH]: noMatchPortData,
        [BaseModels.PortType.NEXT]: nextPortData ?? undefined,
      },
    };
  },
  ({
    byKey,
    builtIn: {
      [BaseModels.PortType.NO_REPLY]: noReplyPortData,
      [BaseModels.PortType.NEXT]: nextPortData,
      [BaseModels.PortType.NO_MATCH]: noMatchPortData,
    },
  }) => ({
    ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
    byKey: Utils.object.mapValue(byKey, outPortDataToDB),
    builtIn: {
      ...(noMatchPortData ? { [BaseModels.PortType.NO_MATCH]: outPortDataToDB(noMatchPortData) } : {}),
      ...(nextPortData ? { [BaseModels.PortType.NEXT]: outPortDataToDB(nextPortData) } : {}),
      ...(noReplyPortData ? { [BaseModels.PortType.NO_REPLY]: outPortDataToDB(noReplyPortData) } : {}),
    },
  })
);

export default cardV2Adapter;
