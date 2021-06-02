import { StepData } from '@voiceflow/general-types/build/nodes/jump';

import { PlatformType } from '@/constants';
import { NodeData } from '@/models';
import { distinctPlatformsData } from '@/utils/platform';

import { createBlockAdapter } from '../utils';

const intentAdapter = createBlockAdapter<StepData, NodeData.Intent>(
  ({ intent, mappings }) => ({
    ...distinctPlatformsData({ intent: null, mappings: [] }),
    [PlatformType.GOOGLE]: { intent, mappings: mappings ?? [] },
  }),
  ({ [PlatformType.GOOGLE]: { intent, mappings } }) => ({ intent, mappings })
);

export default intentAdapter;
