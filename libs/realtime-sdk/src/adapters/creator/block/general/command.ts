import type { NodeData } from '@realtime-sdk/models';
import type { BaseNode } from '@voiceflow/base-types';

import { baseCommandAdapter } from '../base';
import { createBlockAdapter } from '../utils';

const commandAdapter = createBlockAdapter<BaseNode.Command.StepData, NodeData.Command>(
  (data, options) => baseCommandAdapter.fromDB(data, options),
  (data, options) => baseCommandAdapter.toDB(data, options)
);

export default commandAdapter;
