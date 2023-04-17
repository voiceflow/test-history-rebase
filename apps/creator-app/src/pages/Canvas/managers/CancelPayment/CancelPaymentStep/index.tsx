import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { ProductMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface CancelPaymentStepProps {
  label?: string;
  nodeID: string;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
  palette: HSLShades;
}

export const CancelPaymentStep: React.FC<CancelPaymentStepProps> = ({ label, nodeID, successPortID, failurePortID, withPorts, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label={label}
        icon={NODE_CONFIG.icon}
        palette={palette}
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
  ports,
  data,
  withPorts,
  palette,
}) => {
  const productMap = React.useContext(ProductMapContext)!;

  const product = data?.productID ? productMap[data.productID] : null;

  return (
    <CancelPaymentStep
      label={product?.name}
      nodeID={data.nodeID}
      withPorts={withPorts}
      successPortID={ports.out.builtIn[BaseModels.PortType.NEXT] ?? null}
      failurePortID={ports.out.builtIn[BaseModels.PortType.FAIL] ?? null}
      palette={palette}
    />
  );
};

export default ConnectedCancelPaymentStep;
