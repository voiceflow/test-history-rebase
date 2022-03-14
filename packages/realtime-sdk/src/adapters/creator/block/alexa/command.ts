import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { baseCommandAdapter } from '../base';
import { createBlockAdapter } from '../utils';

const commandAdapter = createBlockAdapter<BaseNode.Command.StepData, NodeData.Command>(
  (data) => baseCommandAdapter.fromDB(data),
  (data) => baseCommandAdapter.toDB(data)
);

export default commandAdapter;
