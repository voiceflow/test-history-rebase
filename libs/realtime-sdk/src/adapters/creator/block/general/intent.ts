import type { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '@/models';

import { baseIntentAdapter } from '../base';
import { createBlockAdapter } from '../utils';

const intentAdapter = createBlockAdapter<BaseNode.Intent.StepData, NodeData.Intent>(
  (data, options) => baseIntentAdapter.fromDB(data, options),
  (data, options) => baseIntentAdapter.toDB(data, options)
);

export default intentAdapter;
