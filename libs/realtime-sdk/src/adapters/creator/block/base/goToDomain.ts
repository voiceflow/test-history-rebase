import type { NodeData } from '@realtime-sdk/models';
import type { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, emptyOutPortsAdapter, emptyOutPortsAdapterV2 } from '../utils';

const goToDomainAdapter = createBlockAdapter<BaseNode.GoToDomain.StepData, NodeData.GoToDomain>(
  ({ domainID }) => ({ domainID }),
  ({ domainID = null }) => ({ domainID })
);

export const goToDomainOutPortsAdapter = emptyOutPortsAdapter;

export const goToDomainOutPortsAdapterV2 = emptyOutPortsAdapterV2;

export default goToDomainAdapter;
