import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const accountLinkingAdapter = createBlockAdapter<Node.AccountLinking.StepData, NodeData.AccountLinking>(
  () => ({}),
  () => ({})
);

export default accountLinkingAdapter;
