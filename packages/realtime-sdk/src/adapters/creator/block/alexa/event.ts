import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';

const eventAdapter = createBlockAdapter<Node.Event.StepData, NodeData.Event>(
  ({ mappings, requestName }) => ({ mappings, requestName }),
  ({ mappings, requestName }) => ({ mappings, requestName })
);

export default eventAdapter;
