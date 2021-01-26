import type { StepData } from '@voiceflow/general-types/build/nodes/visual';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const commandAdapter = createBlockAdapter<StepData, NodeData.Visual>(
  ({ image, device, visualType, dimensions, canvasVisibility }) => ({
    image,
    device,
    visualType,
    dimensions,
    canvasVisibility,
  }),
  // eslint-disable-next-line sonarjs/no-identical-functions
  ({ image, device, visualType, dimensions, canvasVisibility }) => ({
    image,
    device,
    visualType,
    dimensions,
    canvasVisibility,
  })
);

export default commandAdapter;
