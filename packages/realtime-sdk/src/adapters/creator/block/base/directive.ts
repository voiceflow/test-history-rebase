import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const directiveDataAdapter = createBlockAdapter<Node.Directive.StepData, NodeData.Directive>(
  ({ directive }) => ({ directive }),
  ({ directive }) => ({ directive })
);

export default directiveDataAdapter;
