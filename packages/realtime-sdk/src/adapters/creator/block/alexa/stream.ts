import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';
import { Models } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  findDBNextPort,
  findDBPortByType,
  migrateDBPortType,
  outPortDataFromDB,
  outPortDataToDB,
} from '../utils';

const streamAdapter = createBlockAdapter<Node.Stream.StepData, NodeData.Stream>(
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
    const dbPreviousPort = findDBPortByType(dbPorts, Models.PortType.PREVIOUS) ?? migrateDBPortType(dbPorts[1], Models.PortType.PREVIOUS);
    const dbPausePort =
      findDBPortByType(dbPorts, Models.PortType.PAUSE) ?? (dbPorts[2] ? migrateDBPortType(dbPorts[2], Models.PortType.PAUSE) : null);

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const previousPortData = outPortDataFromDB(dbPreviousPort, options);
    const pausePortData = dbPausePort && outPortDataFromDB(dbPausePort, options);

    return {
      ports: Utils.array.filterOutNullish([
        { ...nextPortData, platform: Constants.PlatformType.ALEXA },
        { ...previousPortData, platform: Constants.PlatformType.ALEXA },
        pausePortData && { ...pausePortData, platform: Constants.PlatformType.ALEXA },
      ]),
      dynamic: [],
      builtIn: {
        [Models.PortType.NEXT]: nextPortData.port.id,
        [Models.PortType.PAUSE]: pausePortData?.port.id ?? undefined,
        [Models.PortType.PREVIOUS]: previousPortData.port.id,
      },
    };
  },
  ({ builtIn: { [Models.PortType.NEXT]: nextPortData, [Models.PortType.PREVIOUS]: previousPortData, [Models.PortType.PAUSE]: pausePortData } }) =>
    Utils.array.filterOutNullish([
      outPortDataToDB(nextPortData),
      previousPortData && outPortDataToDB(previousPortData),
      pausePortData && outPortDataToDB(pausePortData),
    ])
);

export default streamAdapter;
