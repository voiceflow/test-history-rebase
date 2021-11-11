import { Node } from '@voiceflow/base-types';

import { DistinctPlatform } from '../../../../constants';
import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { createBlockAdapter } from '../utils';

const intentAdapter = createBlockAdapter<Node.Intent.StepData, NodeData.Intent, [{ platform: DistinctPlatform }], [{ platform: DistinctPlatform }]>(
  ({ intent, mappings, availability }, { platform }) => ({
    ...distinctPlatformsData({ intent: null, mappings: [], availability: Node.Intent.IntentAvailability.GLOBAL }),
    [platform]: {
      intent,
      mappings: mappings ?? [],
      availability: availability ?? Node.Intent.IntentAvailability.GLOBAL,
    },
  }),
  (data, { platform }) => {
    const { intent, mappings, availability } = data[platform];

    return { intent, mappings, availability };
  }
);

export default intentAdapter;
