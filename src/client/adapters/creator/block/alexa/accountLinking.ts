import type { StepData } from '@voiceflow/alexa-types/build/nodes/accountLinking';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const accountLinkingAdapter = createBlockAdapter<StepData, NodeData.AccountLinking>(
  () => ({}),
  () => ({})
);

export default accountLinkingAdapter;
