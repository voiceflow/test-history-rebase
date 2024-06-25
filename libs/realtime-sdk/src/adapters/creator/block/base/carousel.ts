import * as RealtimeUtilsPort from '@realtime-sdk/utils/port';
import type { BaseNode } from '@voiceflow/base-types';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

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

const carouselAdapter = createBlockAdapter<
  Omit<BaseNode.Carousel.StepData, 'noMatch' | 'noReply'>,
  Omit<NodeData.Carousel, 'noMatch' | 'noReply'>
>(
  ({ cards, layout }) => ({
    cards,
    layout,
  }),
  ({ cards, layout }) => ({
    cards,
    layout,
  })
);

export const carouselOutPortsAdapter = createOutPortsAdapter<NodeData.CarouselBuiltInPorts, NodeData.Carousel>(
  (dbPorts, options) => {
    const dbNoMatchPort = findDBNoMatchPort(dbPorts);
    const dbNoReplyPort = findDBPortByType(dbPorts, BaseModels.PortType.NO_REPLY);
    const dbNextPort = findDBNextPort(dbPorts);

    const nextPortData = dbNextPort && outPortDataFromDB(dbNextPort, options);
    const noMatchPortData = dbNoMatchPort && outPortDataFromDB(dbNoMatchPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      builtIn: {
        [BaseModels.PortType.NO_MATCH]: noMatchPortData ?? undefined,
        [BaseModels.PortType.NO_REPLY]: noReplyPortData ?? undefined,
        [BaseModels.PortType.NEXT]: nextPortData ?? undefined,
      },
    };
  },
  ({
    builtIn: {
      [BaseModels.PortType.NO_MATCH]: noMatchPortData,
      [BaseModels.PortType.NO_REPLY]: noReplyPortData,
      [BaseModels.PortType.NEXT]: nextPortData,
    },
  }) => [
    ...[nextPortData && outPortDataToDB(nextPortData)].filter(Utils.array.isNotNullish),
    ...[noMatchPortData && outPortDataToDB(noMatchPortData)].filter(Utils.array.isNotNullish),
    ...[noReplyPortData && outPortDataToDB(noReplyPortData)].filter(Utils.array.isNotNullish),
  ]
);

export const carouselOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CarouselBuiltInPorts, NodeData.Carousel>(
  (dbPorts, options) => {
    const dbNextPort = dbPorts.builtIn[BaseModels.PortType.NEXT];
    const dbNoReplyPort = dbPorts.builtIn[BaseModels.PortType.NO_REPLY];
    const dbNoMatchPort = dbPorts.builtIn[BaseModels.PortType.NO_MATCH];

    const nextPortData = dbNextPort && outPortDataFromDB(dbNextPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);
    const noMatchPortData = dbNoMatchPort && outPortDataFromDB(dbNoMatchPort, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      byKey: Utils.object.mapValue(dbPorts.byKey || {}, (port) => outPortDataFromDB(port!, options)),
      builtIn: {
        [BaseModels.PortType.NEXT]: nextPortData ?? undefined,
        [BaseModels.PortType.NO_MATCH]: noMatchPortData,
        [BaseModels.PortType.NO_REPLY]: noReplyPortData ?? undefined,
      },
    };
  },
  ({
    byKey,
    builtIn: {
      [BaseModels.PortType.NEXT]: nextPortData,
      [BaseModels.PortType.NO_MATCH]: noMatchPortData,
      [BaseModels.PortType.NO_REPLY]: noReplyPortData,
    },
  }) => ({
    ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
    byKey: Utils.object.mapValue(byKey, outPortDataToDB),
    builtIn: {
      ...(nextPortData ? { [BaseModels.PortType.NEXT]: outPortDataToDB(nextPortData) } : {}),
      ...(noReplyPortData ? { [BaseModels.PortType.NO_REPLY]: outPortDataToDB(noReplyPortData) } : {}),
      ...(noMatchPortData ? { [BaseModels.PortType.NO_MATCH]: outPortDataToDB(noMatchPortData) } : {}),
    },
  })
);

export default carouselAdapter;
