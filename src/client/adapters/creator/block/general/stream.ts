import { StepData } from '@voiceflow/general-types/build/nodes/stream';

import { PlatformType } from '@/constants';
import { PortType } from '@/constants/canvas';
import { NodeData } from '@/models';

import { generateOutPort } from '../../utils';
import { createBlockAdapter, getPortByLabel, PortsAdapter } from '../utils';

const streamAdapter = createBlockAdapter<StepData, NodeData.Stream>(
  ({ loop, src, customPause }) => ({
    loop,
    audio: src,
    title: null,
    iconImage: null,
    customPause: !!customPause,
    description: null,
    backgroundImage: null,
  }),
  ({ loop, audio, customPause }) => ({
    src: audio,
    loop,
    customPause,
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
        data: nextPort?.link?.data,
      },
      {
        type: PortType.PREVIOUS,
        target: previousPort?.target || null,
        id: previousPort!.port.id,
        data: previousPort?.link?.data,
      },
      {
        type: PortType.PAUSE,
        target: pausePort?.target || null,
        id: pausePort!.port.id,
        data: pausePort?.link?.data,
      },
    ];
  },
  fromDB: (ports, { nodeID }) => [
    {
      port: generateOutPort(nodeID, ports[0], { label: PortType.NEXT, platform: PlatformType.GENERAL }),
      target: ports[0].target,
    },
    {
      port: generateOutPort(nodeID, ports[1], { label: PortType.PREVIOUS, platform: PlatformType.GENERAL }),
      target: ports[1].target,
    },
    {
      port: generateOutPort(nodeID, ports[2], { label: PortType.PAUSE, platform: PlatformType.GENERAL }),
      target: ports[2].target,
    },
  ],
};

export default streamAdapter;
