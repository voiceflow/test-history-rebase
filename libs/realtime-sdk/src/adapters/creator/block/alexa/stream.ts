import { NodeData } from '@realtime-sdk/models';
import * as RealtimeUtils from '@realtime-sdk/utils';
import { AlexaNode } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  findDBNextPort,
  findDBPortByType,
  migrateDBPortType,
  outPortDataFromDB,
  outPortDataToDB,
} from '../utils';

const streamAdapter = createBlockAdapter<AlexaNode.Stream.StepData, NodeData.Stream>(
  ({ loop, audio, title, iconImage, customPause, description, backgroundImage }) => ({
    loop,
    audio,
    title: title ?? null,
    iconImage: iconImage ?? null,
    customPause,
    description: description ?? null,
    backgroundImage: backgroundImage ?? null,
  }),
  ({ loop, audio, title, iconImage, customPause, description, backgroundImage }) => ({
    loop,
    audio,
    title: title ?? undefined,
    iconImage: iconImage ?? undefined,
    customPause,
    description: description ?? undefined,
    backgroundImage: backgroundImage ?? undefined,
  })
);

export const streamOutPortsAdapter = createOutPortsAdapter<NodeData.StreamBuiltInPorts, NodeData.Stream>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);
    const dbPreviousPort = findDBPortByType(dbPorts, BaseModels.PortType.PREVIOUS) ?? migrateDBPortType(dbPorts[1], BaseModels.PortType.PREVIOUS);
    const dbPausePort =
      findDBPortByType(dbPorts, BaseModels.PortType.PAUSE) ?? (dbPorts[2] ? migrateDBPortType(dbPorts[2], BaseModels.PortType.PAUSE) : null);

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const previousPortData = outPortDataFromDB(dbPreviousPort, options);
    const pausePortData = dbPausePort && outPortDataFromDB(dbPausePort, options);

    return {
      ...RealtimeUtils.port.createEmptyNodeOutPorts(),
      builtIn: {
        [BaseModels.PortType.NEXT]: nextPortData,
        [BaseModels.PortType.PAUSE]: pausePortData || undefined,
        [BaseModels.PortType.PREVIOUS]: previousPortData,
      },
    };
  },
  ({
    builtIn: {
      [BaseModels.PortType.NEXT]: nextPortData,
      [BaseModels.PortType.PREVIOUS]: previousPortData,
      [BaseModels.PortType.PAUSE]: pausePortData,
    },
  }) =>
    Utils.array.filterOutNullish([
      outPortDataToDB(nextPortData),
      previousPortData && outPortDataToDB(previousPortData),
      pausePortData && outPortDataToDB(pausePortData),
    ])
);

export const streamOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.StreamBuiltInPorts, NodeData.Stream>(
  (dbPorts, options) => {
    const dbNextPort = dbPorts.builtIn[BaseModels.PortType.NEXT];
    const dbPreviousPort = dbPorts.builtIn[BaseModels.PortType.PREVIOUS];
    const dbPausePort = dbPorts.builtIn[BaseModels.PortType.PAUSE];

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const previousPortData = dbPreviousPort && outPortDataFromDB(dbPreviousPort, options);
    const pausePortData = dbPausePort && outPortDataFromDB(dbPausePort, options);

    return {
      ...RealtimeUtils.port.createEmptyNodeOutPorts(),
      builtIn: {
        [BaseModels.PortType.NEXT]: nextPortData,
        [BaseModels.PortType.PAUSE]: pausePortData,
        [BaseModels.PortType.PREVIOUS]: previousPortData,
      },
    };
  },
  ({
    builtIn: {
      [BaseModels.PortType.NEXT]: nextPortData,
      [BaseModels.PortType.PREVIOUS]: previousPortData,
      [BaseModels.PortType.PAUSE]: pausePortData,
    },
  }) => ({
    ...RealtimeUtils.port.createEmptyNodeOutPorts(),
    builtIn: {
      [BaseModels.PortType.NEXT]: outPortDataToDB(nextPortData),
      ...(previousPortData ? { [BaseModels.PortType.PREVIOUS]: outPortDataToDB(previousPortData) } : {}),
      ...(pausePortData ? { [BaseModels.PortType.PAUSE]: outPortDataToDB(pausePortData) } : {}),
    },
  })
);

export default streamAdapter;
