import type { StepData as DirectiveData } from '@voiceflow/alexa-types/build/nodes/directive';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const directiveDataAdapter = createBlockAdapter<DirectiveData, NodeData.Directive>(
  ({ directive }) => ({ directive }),
  ({ directive }) => ({ directive })
);

export default directiveDataAdapter;
