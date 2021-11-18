import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const codeAdapter = createBlockAdapter<Node.Code.StepData, NodeData.Code>(
  ({ code }) => ({ code }),
  ({ code }) => ({ code })
);

export default codeAdapter;
