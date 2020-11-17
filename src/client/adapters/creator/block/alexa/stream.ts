import type { StepData } from '@voiceflow/alexa-types/build/nodes/stream';

import { PlatformType } from '@/constants';
import { PortType } from '@/constants/canvas';
import { NodeData } from '@/models';

import { generateOutPort } from '../../utils';
import { PortsAdapter, createBlockAdapter, getPortByLabel } from '../utils';

const streamAdapter = createBlockAdapter<StepData, NodeData.Stream>(
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
      },
      {
        type: PortType.PREVIOUS,
        target: previousPort?.target || null,
        id: previousPort!.port.id,
      },
      {
        type: PortType.PAUSE,
        target: pausePort?.target || null,
        id: pausePort!.port.id,
      },
    ];
  },
  fromDB: (ports, { nodeID }) => [
    {
      port: generateOutPort(nodeID, ports[0], { label: PortType.NEXT, platform: PlatformType.ALEXA }),
      target: ports[0].target,
    },
    {
      port: generateOutPort(nodeID, ports[1], { label: PortType.PREVIOUS, platform: PlatformType.ALEXA }),
      target: ports[1].target,
    },
    {
      port: generateOutPort(nodeID, ports[2], { label: PortType.PAUSE, platform: PlatformType.ALEXA }),
      target: ports[2].target,
    },
  ],
};

export default streamAdapter;
