import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const eventAdapter = createBlockAdapter<Node.Event.StepData, NodeData.Event>(
  ({ mappings, requestName }) => ({ mappings, requestName }),
  ({ mappings, requestName }) => ({ mappings, requestName })
);

export default eventAdapter;
