import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';
import { Models } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';

import { generateOutPort } from '../../utils';
import { createBlockAdapter, getPortByLabel, PortsAdapter } from '../utils';

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

// for the alexa version
export const streamPortsAdapter: PortsAdapter = {
  toDB: (ports) => {
    const nextPort = getPortByLabel(ports, Models.PortType.NEXT);
    const previousPort = getPortByLabel(ports, Models.PortType.PREVIOUS);
    const pausePort = getPortByLabel(ports, Models.PortType.PAUSE);

    return [
      {
        type: Models.PortType.NEXT,
        target: nextPort?.target || null,
        id: nextPort!.port.id,
        data: nextPort!.link?.data,
      },
      {
        type: Models.PortType.PREVIOUS,
        target: previousPort?.target || null,
        id: previousPort!.port.id,
        data: previousPort!.link?.data,
      },
      {
        type: Models.PortType.PAUSE,
        target: pausePort?.target || null,
        id: pausePort!.port.id,
        data: pausePort!.link?.data,
      },
    ];
  },
  fromDB: (ports, { nodeID }) => [
    {
      port: generateOutPort(nodeID, ports[0], { label: Models.PortType.NEXT, platform: Constants.PlatformType.ALEXA }),
      target: ports[0].target,
    },
    {
      port: generateOutPort(nodeID, ports[1], { label: Models.PortType.PREVIOUS, platform: Constants.PlatformType.ALEXA }),
      target: ports[1].target,
    },
    {
      port: generateOutPort(nodeID, ports[2], { label: Models.PortType.PAUSE, platform: Constants.PlatformType.ALEXA }),
      target: ports[2].target,
    },
  ],
};

export default streamAdapter;
