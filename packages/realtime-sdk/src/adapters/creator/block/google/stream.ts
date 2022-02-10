import { NodeData } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { GoogleNode } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createBlockAdapter, createOutPortsAdapter, findDBNextPort, outPortDataFromDB, outPortDataToDB } from '../utils';

const streamAdapter = createBlockAdapter<GoogleNode.Stream.StepData, NodeData.Stream>(
  ({ loop, audio, title, iconImage, description, backgroundImage }) => ({
    loop,
    audio,
    title: title ?? null,
    iconImage: iconImage ?? null,
    customPause: false,
    description: description ?? null,
    backgroundImage: backgroundImage ?? null,
  }),
  ({ loop, audio, title, iconImage, description, backgroundImage }) => ({
    loop,
    audio,
    title: title ?? undefined,
    iconImage: iconImage ?? undefined,
    description: description ?? undefined,
    backgroundImage: backgroundImage ?? undefined,
  })
);

export const streamOutPortsAdapter = createOutPortsAdapter<NodeData.StreamBuiltInPorts, NodeData.Stream>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);

    const nextPortData = outPortDataFromDB(dbNextPort, options);

    return {
      ports: [{ ...nextPortData, platform: VoiceflowConstants.PlatformType.GOOGLE }],
      dynamic: [],
      builtIn: { [BaseModels.PortType.NEXT]: nextPortData.port.id },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NEXT]: nextPortData } }) => [outPortDataToDB(nextPortData)]
);

export default streamAdapter;
