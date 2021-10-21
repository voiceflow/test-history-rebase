import { Node } from '@voiceflow/google-dfes-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const customPayload = createBlockAdapter<Node.Payload.StepData, NodeData.CustomPayload>(
  ({ data: customPayload }) => ({ customPayload }),
  ({ customPayload }) => ({ data: customPayload })
);

export default customPayload;
