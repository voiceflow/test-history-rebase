import type { StepData } from '@voiceflow/alexa-types/build/nodes/stream';

import { PlatformType } from '@/constants';
import { NodeData, Port } from '@/models';

import { generateOutPort } from '../utils';
import { PortsAdapter, createBlockAdapter } from './utils';

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

function getPortByLabel(ports: { port: Port; target: string | null }[], label: string) {
  for (let i = 0; i < ports.length; i++) if (ports[i].port.label === label) return ports[i];
  return null;
}

export enum PortType {
  NEXT = 'next',
  PAUSE = 'pause',
  PREVIOUS = 'previous',
}

// for the alexa version
export const streamPortsAdapter: PortsAdapter = {
  toDB: (ports, _node, platform) => {
    if (platform === PlatformType.GOOGLE) {
      return [
        {
          type: '',
          target: ports[0]?.target || null,
        },
      ];
    }

    return [
      {
        type: PortType.NEXT,
        target: getPortByLabel(ports, PortType.NEXT)?.target || null,
      },
      {
        type: PortType.PREVIOUS,
        target: getPortByLabel(ports, PortType.PREVIOUS)?.target || null,
      },
      {
        type: PortType.PAUSE,
        target: getPortByLabel(ports, PortType.PAUSE)?.target || null,
      },
    ];
  },
  fromDB: (ports, { nodeID }, platform) => {
    if (platform === PlatformType.GOOGLE) {
      return [
        {
          port: generateOutPort(nodeID, 0, { platform: PlatformType.GOOGLE }),
          target: ports[0].target,
        },
      ];
    }

    return [
      {
        port: generateOutPort(nodeID, 0, { platform: PlatformType.GOOGLE }),
        target: null,
      },
      {
        port: generateOutPort(nodeID, 1, { label: PortType.NEXT, platform: PlatformType.ALEXA }),
        target: ports[0].target,
      },
      {
        port: generateOutPort(nodeID, 2, { label: PortType.PREVIOUS, platform: PlatformType.ALEXA }),
        target: ports[1].target,
      },
      {
        port: generateOutPort(nodeID, 3, { label: PortType.PAUSE, platform: PlatformType.ALEXA }),
        target: ports[2].target,
      },
    ];
  },
};

export default streamAdapter;
