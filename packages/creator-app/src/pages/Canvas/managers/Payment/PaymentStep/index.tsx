import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Models from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';
import { ProductMapContext } from '@/pages/Canvas/contexts';

import { NODE_CONFIG } from '../constants';

export type PaymentStepProps = {
  label?: string;
  withPorts: boolean;
  upsellMessage?: string | null;
  nodeID: string;
  successPortID: string;
  failurePortID: string;
};

export const PaymentStep: React.FC<PaymentStepProps> = ({ label, upsellMessage, withPorts, nodeID, successPortID, failurePortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Select a product"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
    {label && (
      <>
        <Section>
          <Item icon="alexa" iconColor="#616c60" label={upsellMessage} placeholder="Add Upsell Message" />
        </Section>
        <Section>
          {withPorts && (
            <>
              <SuccessItem label="Purchased" portID={successPortID} />
              <FailureItem
                label={
                  <>
                    <VariableLabel>Declined</VariableLabel> or <VariableLabel>Error</VariableLabel>
                  </>
                }
                labelVariant={StepLabelVariant.SECONDARY}
                portID={failurePortID}
              />
            </>
          )}
        </Section>
      </>
    )}
  </Step>
);

const MemoizedPaymentStep = React.memo(PaymentStep);

const ConnectedPaymentStep: React.FC<ConnectedStepProps<Models.NodeData.Payment>> = ({ node, data, withPorts }) => {
  const productMap = React.useContext(ProductMapContext)!;
  const product = data?.productID ? productMap[data.productID] : null;

  const [successPortID, failurePortID] = node.ports.out;

  return (
    <MemoizedPaymentStep
      label={product?.name}
      nodeID={node.id}
      withPorts={withPorts}
      upsellMessage={product?.purchasePrompt}
      successPortID={successPortID}
      failurePortID={failurePortID}
    />
  );
};

export default ConnectedPaymentStep;
