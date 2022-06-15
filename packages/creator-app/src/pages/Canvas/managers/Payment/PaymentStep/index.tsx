import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';
import { ProductMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface PaymentStepProps {
  label?: string;
  nodeID: string;
  withPorts: boolean;
  upsellMessage?: string | null;
  successPortID: string;
  failurePortID: string;
  palette: HSLShades;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ label, upsellMessage, withPorts, nodeID, successPortID, failurePortID, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon={NODE_CONFIG.icon} label={label} palette={palette} placeholder="Select a product" labelVariant={StepLabelVariant.SECONDARY} />
    </Section>

    {label && (
      <>
        <Section>
          <Item icon="alexa" palette={palette} label={upsellMessage} placeholder="Add Upsell Message" />
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

const ConnectedPaymentStep: ConnectedStep<Realtime.NodeData.Payment, Realtime.NodeData.PaymentBuiltInPorts> = ({
  ports,
  data,
  withPorts,
  palette,
}) => {
  const productMap = React.useContext(ProductMapContext)!;

  const product = data?.productID ? productMap[data.productID] : null;

  return (
    <MemoizedPaymentStep
      label={product?.name}
      nodeID={data.nodeID}
      withPorts={withPorts}
      upsellMessage={product?.purchasePrompt}
      successPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      failurePortID={ports.out.builtIn[BaseModels.PortType.FAIL]}
      palette={palette}
    />
  );
};

export default ConnectedPaymentStep;
