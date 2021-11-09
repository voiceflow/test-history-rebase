import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { ProductMapContext } from '@/pages/Canvas/contexts';

import { NODE_CONFIG } from '../constants';

export interface CancelPaymentStepProps {
  label?: string;
  withPorts: boolean;
  nodeID: string;
  successPortID: string;
  failurePortID: string;
}

export const CancelPaymentStep: React.FC<CancelPaymentStepProps> = ({ label, nodeID, successPortID, failurePortID, withPorts }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label={label}
        icon={NODE_CONFIG.icon}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Select a product to cancel"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>

    {label && (
      <Section>
        {withPorts && (
          <>
            <SuccessItem label="Successfully Cancelled" portID={successPortID} />
            <FailureItem label="Declined" portID={failurePortID} />
          </>
        )}
      </Section>
    )}
  </Step>
);

const MemoizedCancelPaymentStep = React.memo(CancelPaymentStep);

const ConnectedCancelPaymentStep: React.FC<ConnectedStepProps<Realtime.NodeData.CancelPayment>> = ({ node, data, withPorts }) => {
  const productMap = React.useContext(ProductMapContext)!;
  const product = data?.productID ? productMap[data.productID] : null;

  const [successPortID, failurePortID] = node.ports.out;

  return (
    <MemoizedCancelPaymentStep
      label={product?.name}
      nodeID={node.id}
      withPorts={withPorts}
      successPortID={successPortID}
      failurePortID={failurePortID}
    />
  );
};

export default ConnectedCancelPaymentStep;
