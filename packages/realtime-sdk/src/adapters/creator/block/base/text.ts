import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const textAdapter = createBlockAdapter<Node.Text.StepData, NodeData.Text>(
  (data) => data,
  (data) => data
);

export default textAdapter;
