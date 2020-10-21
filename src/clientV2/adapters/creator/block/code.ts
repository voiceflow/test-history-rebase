import type { StepData as CodeData } from '@voiceflow/general-types/build/nodes/code';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const codeAdapter = createBlockAdapter<CodeData, NodeData.Code>(
  ({ code }) => ({ code }),
  ({ code }) => ({ code })
);

export default codeAdapter;
