import { Node } from '@voiceflow/alexa-types';
import { Constants } from '@voiceflow/general-types';

import { PortType } from '../../../../constants';
import { NodeData } from '../../../../models';
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
    const nextPort = getPortByLabel(ports, PortType.NEXT);
    const previousPort = getPortByLabel(ports, PortType.PREVIOUS);
    const pausePort = getPortByLabel(ports, PortType.PAUSE);

    return [
      {
        type: PortType.NEXT,
        target: nextPort?.target || null,
        id: nextPort!.port.id,
        data: nextPort!.link?.data,
      },
      {
        type: PortType.PREVIOUS,
        target: previousPort?.target || null,
        id: previousPort!.port.id,
        data: previousPort!.link?.data,
      },
      {
        type: PortType.PAUSE,
        target: pausePort?.target || null,
        id: pausePort!.port.id,
        data: pausePort!.link?.data,
      },
    ];
  },
  fromDB: (ports, { nodeID }) => [
    {
      port: generateOutPort(nodeID, ports[0], { label: PortType.NEXT, platform: Constants.PlatformType.ALEXA }),
      target: ports[0].target,
    },
    {
      port: generateOutPort(nodeID, ports[1], { label: PortType.PREVIOUS, platform: Constants.PlatformType.ALEXA }),
      target: ports[1].target,
    },
    {
      port: generateOutPort(nodeID, ports[2], { label: PortType.PAUSE, platform: Constants.PlatformType.ALEXA }),
      target: ports[2].target,
    },
  ],
};

export default streamAdapter;
