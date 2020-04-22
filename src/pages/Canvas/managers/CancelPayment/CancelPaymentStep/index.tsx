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
  successPortID: string;
  failurePortID: string;
};

export const CancelPaymentStep: React.FC<CancelPaymentStepProps> = ({ label, successPortID, failurePortID, withPorts }) => (
  <Step>
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

const ConnectedCancelPaymentStep: React.FC<ConnectedStepProps<Models.NodeData.Payment> & ConnectedCancelPaymentStepProps> = ({
  node,
  withPorts,
  product,
}) => {
  const [successPortID, failurePortID] = node.ports.out;

  return <CancelPaymentStep label={product?.name} successPortID={successPortID} failurePortID={failurePortID} withPorts={withPorts} />;
};

const mapStateToProps = {
  product: Product.productByIDSelector,
};

const mergeProps = (
  ...[{ product: productByIDSelector }, , { data }]: MergeArguments<typeof mapStateToProps, {}, ConnectedStepProps<Models.NodeData.Payment>>
) => ({
  product: productByIDSelector(data?.productID as any),
});

type ConnectedCancelPaymentStepProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)<ConnectedStepProps<Models.NodeData.Payment>>(ConnectedCancelPaymentStep as React.FC);
