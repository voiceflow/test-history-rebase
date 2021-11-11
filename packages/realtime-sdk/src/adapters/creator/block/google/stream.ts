import { Models } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { Node } from '@voiceflow/google-types';

import { NodeData } from '../../../../models';
import { generateOutPort } from '../../utils';
import { createBlockAdapter, getPortByLabel, PortsAdapter } from '../utils';

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

// for the alexa version
export const streamPortsAdapter: PortsAdapter = {
  toDB: (ports) => [
    {
      type: Models.PortType.NEXT,
      target: getPortByLabel(ports, Models.PortType.NEXT)?.target || ports[0].target || null,
      id: ports[0].port.id,
      data: ports[0]?.link?.data,
    },
  ],
  fromDB: (ports, { nodeID }) => [
    {
      port: generateOutPort(nodeID, ports[0], { label: Models.PortType.NEXT, platform: Constants.PlatformType.GOOGLE }),
      target: ports[0].target,
    },
  ],
};

export default streamAdapter;
