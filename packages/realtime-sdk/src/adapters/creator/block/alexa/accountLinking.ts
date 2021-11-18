import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';

const accountLinkingAdapter = createBlockAdapter<Node.AccountLinking.StepData, NodeData.AccountLinking>(
  () => ({}),
  () => ({})
);

export default accountLinkingAdapter;
