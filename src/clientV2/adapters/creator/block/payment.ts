import type { StepData } from '@voiceflow/alexa-types/build/nodes/payment';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const paymentAdapter = createBlockAdapter<StepData, NodeData.Payment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID })
);

export default paymentAdapter;
