import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
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
      ports: Utils.array.filterOutNullish([
        { ...nextPortData, platform: VoiceflowConstants.PlatformType.ALEXA },
        { ...previousPortData, platform: VoiceflowConstants.PlatformType.ALEXA },
        pausePortData && { ...pausePortData, platform: VoiceflowConstants.PlatformType.ALEXA },
      ]),
      dynamic: [],
      builtIn: {
        [BaseModels.PortType.NEXT]: nextPortData.port.id,
        [BaseModels.PortType.PAUSE]: pausePortData?.port.id ?? undefined,
        [BaseModels.PortType.PREVIOUS]: previousPortData.port.id,
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

export default streamAdapter;
