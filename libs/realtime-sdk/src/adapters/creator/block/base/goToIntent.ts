import type { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '@/models';

import { createBlockAdapter, emptyOutPortsAdapter, emptyOutPortsAdapterV2 } from '../utils';

const goToIntentAdapter = createBlockAdapter<BaseNode.GoTo.StepData, NodeData.GoToIntent>(
  ({ intent, diagramID }) => ({ intent, diagramID }),
  ({ intent = null, diagramID = null }) => ({ intent, diagramID })
);

export const goToIntentOutPortsAdapter = emptyOutPortsAdapter;

export const goToIntentOutPortsAdapterV2 = emptyOutPortsAdapterV2;

export default goToIntentAdapter;
