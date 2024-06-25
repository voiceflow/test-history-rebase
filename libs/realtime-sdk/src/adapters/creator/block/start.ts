import type { NodeData } from '@realtime-sdk/models';
import type { StartNodeData } from '@voiceflow/dtos';

import blockDataAdapter from './block';
import { createBlockAdapter } from './utils';

const startDataAdapter = createBlockAdapter<Omit<StartNodeData, 'portsV2'>, NodeData.Start>(
  ({ label = '', triggers = [], ...data }, options) => ({ ...blockDataAdapter.fromDB(data, options), label, triggers }),
  ({ label, triggers, ...data }, options) => ({
    ...blockDataAdapter.toDB(data, options),
    label: label || undefined,
    triggers,
  })
);

export default startDataAdapter;
