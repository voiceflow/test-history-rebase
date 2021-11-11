import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const codeAdapter = createBlockAdapter<Node.Code.StepData, NodeData.Code>(
  ({ code }) => ({ code }),
  ({ code }) => ({ code })
);

export default codeAdapter;
