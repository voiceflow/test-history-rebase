import { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '../../../../models';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextOnlyOutPortsAdapter,
  nextOnlyOutPortsAdapterV2,
} from '../utils';

const intentAdapter = createBlockAdapter<BaseNode.Intent.StepData, NodeData.Intent>(
  ({ intent, mappings, availability }) => ({
    intent,
    mappings: mappings ?? [],
    availability: availability ?? BaseNode.Intent.IntentAvailability.GLOBAL,
  }),
  ({ intent, mappings, availability }) => ({ intent, mappings, availability })
);

export const intentOutPortsAdapter = createOutPortsAdapter<NodeData.IntentBuiltInPorts, NodeData.Intent>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const intentOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.IntentBuiltInPorts, NodeData.Intent>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default intentAdapter;
