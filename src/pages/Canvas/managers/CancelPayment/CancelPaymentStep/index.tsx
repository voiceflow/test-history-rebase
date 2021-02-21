import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Product from '@/ducks/product';
import { connect } from '@/hocs';
import * as Models from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { ConnectedProps, MergeArguments } from '@/types';

export type CancelPaymentStepProps = {
  label?: string;
  withPorts: boolean;
  nodeID: string;
  successPortID: string;
  failurePortID: string;
};

export const CancelPaymentStep: React.FC<CancelPaymentStepProps> = ({ label, nodeID, successPortID, failurePortID, withPorts }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item label={label} labelVariant={StepLabelVariant.SECONDARY} icon="trash" iconColor="#d94c4c" placeholder="Select a product to cancel" />
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

const ConnectedCancelPaymentStep: React.FC<ConnectedStepProps<Models.NodeData.CancelPayment> & ConnectedCancelPaymentStepProps> = ({
  node,
  withPorts,
  product,
}) => {
  const [successPortID, failurePortID] = node.ports.out;

  return (
    <CancelPaymentStep label={product?.name} nodeID={node.id} successPortID={successPortID} failurePortID={failurePortID} withPorts={withPorts} />
  );
};

const mapStateToProps = {
  product: Product.productByIDSelector,
};

const mergeProps = (
  ...[{ product: productByIDSelector }, , { data }]: MergeArguments<typeof mapStateToProps, {}, ConnectedStepProps<Models.NodeData.CancelPayment>>
) => ({
  product: productByIDSelector(data?.productID as any),
});

type ConnectedCancelPaymentStepProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)<ConnectedStepProps<Models.NodeData.CancelPayment>>(ConnectedCancelPaymentStep as React.FC);
