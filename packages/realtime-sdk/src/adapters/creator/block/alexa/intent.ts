import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { createBlockAdapter } from '../utils';

const intentAdapter = createBlockAdapter<Node.Intent.StepData, NodeData.Intent>(
  ({ intent, mappings, availability }) => ({
    ...distinctPlatformsData({ intent: null, mappings: [], availability: Node.Intent.IntentAvailability.GLOBAL }),
    [Constants.PlatformType.ALEXA]: { intent, mappings: mappings ?? [], availability: availability ?? Node.Intent.IntentAvailability.GLOBAL },
  }),
  ({ [Constants.PlatformType.ALEXA]: { intent, mappings, availability } }) => ({ intent, mappings, availability })
);

export default intentAdapter;
