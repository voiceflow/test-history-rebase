import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { createBlockAdapter } from '../utils';

const intentAdapter = createBlockAdapter<Node.Intent.StepData, NodeData.Intent>(
  ({ intent, mappings }) => ({
    ...distinctPlatformsData({ intent: null, mappings: [] }),
    [Constants.PlatformType.GOOGLE]: { intent, mappings: mappings ?? [] },
  }),
  ({ [Constants.PlatformType.GOOGLE]: { intent, mappings } }) => ({ intent, mappings })
);

export default intentAdapter;
