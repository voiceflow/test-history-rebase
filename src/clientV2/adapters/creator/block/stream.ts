import type { StepData } from '@voiceflow/alexa-types/build/nodes/stream';

import { PlatformType } from '@/constants';
import { NodeData } from '@/models';

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

export enum PortType {
  NEXT = 'next',
  PAUSE = 'pause',
  PREVIOUS = 'previous',
}

// for the alexa version
export const streamPortsAdapter: PortsAdapter = {
  toDB: (ports) => [
    {
      type: PortType.NEXT,
      target: ports[1]?.target || null,
    },
    {
      type: PortType.PREVIOUS,
      target: ports[2]?.target || null,
    },
    {
      type: PortType.PAUSE,
      target: ports[3]?.target || null,
    },
  ],
  fromDB: (ports, { nodeID }) => [
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
  ],
};

export default streamAdapter;
