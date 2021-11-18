import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { ProductMapContext } from '@/pages/Canvas/contexts';

import { NODE_CONFIG } from '../constants';

export interface CancelPaymentStepProps {
  label?: string;
  nodeID: string;
  withPorts: boolean;
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

    {!!label && (
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

const ConnectedCancelPaymentStep: ConnectedStep<Realtime.NodeData.CancelPayment, Realtime.NodeData.CancelPaymentBuiltInPorts> = ({
  node,
  data,
  withPorts,
}) => {
  const productMap = React.useContext(ProductMapContext)!;

  const product = data?.productID ? productMap[data.productID] : null;

  return (
    <CancelPaymentStep
      label={product?.name}
      nodeID={node.id}
      withPorts={withPorts}
      successPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
      failurePortID={node.ports.out.builtIn[Models.PortType.FAIL]}
    />
  );
};

export default ConnectedCancelPaymentStep;
