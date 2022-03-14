import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { baseIntentAdapter } from '../base';
import { createBlockAdapter } from '../utils';

const intentAdapter = createBlockAdapter<BaseNode.Intent.StepData, NodeData.Intent>(
  (data) => baseIntentAdapter.fromDB(data),
  (data) => baseIntentAdapter.toDB(data)
);

export default intentAdapter;
