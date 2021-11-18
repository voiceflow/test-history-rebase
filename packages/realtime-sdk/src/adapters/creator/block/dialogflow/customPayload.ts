import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/google-dfes-types';

import { createBlockAdapter } from '../utils';

const customPayload = createBlockAdapter<Node.Payload.StepData, NodeData.CustomPayload>(
  ({ data: customPayload }) => ({ customPayload }),
  ({ customPayload }) => ({ data: customPayload })
);

export default customPayload;
