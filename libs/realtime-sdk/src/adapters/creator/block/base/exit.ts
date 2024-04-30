import type { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '@/models';

import { createBlockAdapter, emptyOutPortsAdapter, emptyOutPortsAdapterV2 } from '../utils';

const exitAdapter = createBlockAdapter<BaseNode.Exit.StepData, NodeData.Exit>(
  () => ({}),
  () => ({})
);

export const exitOutPortsAdapter = emptyOutPortsAdapter;

export const exitOutPortsAdapterV2 = emptyOutPortsAdapterV2;

export default exitAdapter;
