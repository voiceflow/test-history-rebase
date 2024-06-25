import type { NodeData } from '@realtime-sdk/models';
import type { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, nextOnlyOutPortsAdapter, nextOnlyOutPortsAdapterV2 } from '../utils';

const urlAdapter = createBlockAdapter<BaseNode.Url.StepData, NodeData.Url>(
  ({ url }) => ({ url }),
  ({ url }) => ({ url })
);

export const urlOutPortsAdapter = nextOnlyOutPortsAdapter;

export const urlOutPortsAdapterV2 = nextOnlyOutPortsAdapterV2;

export default urlAdapter;
