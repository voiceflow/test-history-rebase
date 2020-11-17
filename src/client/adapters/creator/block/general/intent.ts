import { StepData } from '@voiceflow/general-types/build/nodes/intent';

import { PlatformType } from '@/constants';
import { NodeData } from '@/models';
import { defaultPlatformsData } from '@/utils/platform';

import { createBlockAdapter } from '../utils';

const intentAdapter = createBlockAdapter<StepData, NodeData.Intent>(
  ({ intent, mappings }) => ({
    ...defaultPlatformsData({ intent: null, mappings: [] }),
    [PlatformType.GENERAL]: { intent, mappings: mappings ?? [] },
  }),
  ({ [PlatformType.GENERAL]: { intent, mappings } }) => ({ intent, mappings })
);

export default intentAdapter;
