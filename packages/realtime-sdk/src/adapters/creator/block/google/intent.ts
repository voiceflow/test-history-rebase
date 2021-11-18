import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';

import { baseIntentAdapter } from '../base';
import { createBlockAdapter } from '../utils';

const intentAdapter = createBlockAdapter<Node.Intent.StepData, NodeData.Intent>(
  (data) => baseIntentAdapter.fromDB(data, { platform: Constants.PlatformType.GOOGLE }),
  (data) => baseIntentAdapter.toDB(data, { platform: Constants.PlatformType.GOOGLE })
);

export default intentAdapter;
