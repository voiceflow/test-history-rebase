import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, emptyOutPortsAdapter } from '../utils';

const exitAdapter = createBlockAdapter<BaseNode.Exit.StepData, NodeData.Exit>(
  () => ({}),
  () => ({ ports: [] })
);

export const exitOutPortsAdapter = emptyOutPortsAdapter;

export default exitAdapter;
