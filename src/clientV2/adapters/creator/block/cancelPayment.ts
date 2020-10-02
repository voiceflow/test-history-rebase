import type { StepData as CancelPaymentDataData } from '@voiceflow/alexa-types/build/nodes/cancelPayment';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const cancelPaymentDataAdapter = createBlockAdapter<CancelPaymentDataData, NodeData.CancelPayment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID: productID || '' })
);

export default cancelPaymentDataAdapter;
