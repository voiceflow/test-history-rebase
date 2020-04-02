import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Product from '@/ducks/product';
import { connect } from '@/hocs';
import { NodeData, Product as ProductType } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { MergeProps } from '@/types';

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
            <FailureItem label="Declined" portID={failurePortID} />
            <SuccessItem label="Successfully Cancelled" portID={successPortID} />
          </>
        )}
      </Section>
    )}
  </Step>
);

type ConnectedCancelPaymentStepProps = ConnectedStepProps<NodeData.Payment> & {
  product?: ProductType;
};

const ConnectedCancelPaymentStep: React.FC<ConnectedCancelPaymentStepProps> = ({ node, withPorts, product }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return <CancelPaymentStep label={product?.name} successPortID={successPortID} failurePortID={failurePortID} withPorts={withPorts} />;
};

const mapStateToProps = {
  product: Product.productByIDSelector,
};

const mergeProps: MergeProps<typeof mapStateToProps, {}, ConnectedStepProps<NodeData.Payment>> = ({ product: productByIDSelector }, _, { data }) => ({
  product: productByIDSelector(data?.productID),
});

export default connect(mapStateToProps, null, mergeProps)(ConnectedCancelPaymentStep);
