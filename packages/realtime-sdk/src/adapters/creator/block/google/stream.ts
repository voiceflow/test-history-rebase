import { NodeData } from '@realtime-sdk/models';
import { Models } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { Node } from '@voiceflow/google-types';

import { createBlockAdapter, createOutPortsAdapter, findDBNextPort, outPortDataFromDB, outPortDataToDB } from '../utils';

const streamAdapter = createBlockAdapter<Node.Stream.StepData, NodeData.Stream>(
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
      ports: [{ ...nextPortData, platform: Constants.PlatformType.GOOGLE }],
      dynamic: [],
      builtIn: { [Models.PortType.NEXT]: nextPortData.port.id },
    };
  },
  ({ builtIn: { [Models.PortType.NEXT]: nextPortData } }) => [outPortDataToDB(nextPortData)]
);

export default streamAdapter;
