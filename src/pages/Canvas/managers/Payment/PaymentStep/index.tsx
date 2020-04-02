import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Product from '@/ducks/product';
import { connect } from '@/hocs';
import { NodeData, Product as ProductType } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';
import { MergeProps } from '@/types';

export type PaymentStepProps = {
  label?: string;
  withPorts: boolean;
  upsellMessage?: string | null;
  successPortID: string;
  failurePortID: string;
};

export const PaymentStep: React.FC<PaymentStepProps> = ({ label, upsellMessage, withPorts, successPortID, failurePortID }) => {
  return (
    <Step>
      <Section>
        <Item label={label} labelVariant={StepLabelVariant.SECONDARY} icon="purchase" iconColor="#558B2F" placeholder="Select a product" />
      </Section>
      {label && (
        <>
          <Section>
            <Item icon="alexa" iconColor="#616c60" label={upsellMessage} placeholder="Add Upsell Message" />
          </Section>
          <Section>
            {withPorts && (
              <>
                <FailureItem
                  label={
                    <>
                      <VariableLabel>Declined</VariableLabel> or <VariableLabel>Error</VariableLabel>
                    </>
                  }
                  labelVariant={StepLabelVariant.SECONDARY}
                  portID={failurePortID}
                />
                <SuccessItem label="Purchased" portID={successPortID} />
              </>
            )}
          </Section>
        </>
      )}
    </Step>
  );
};

type ConnectedPaymentStepProps = ConnectedStepProps<NodeData.Payment> & {
  product?: ProductType;
};

const ConnectedPaymentStep: React.FC<ConnectedPaymentStepProps> = ({ node, withPorts, product }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return (
    <PaymentStep
      label={product?.name}
      upsellMessage={product?.purchasePrompt}
      successPortID={successPortID}
      failurePortID={failurePortID}
      withPorts={withPorts}
    />
  );
};

const mapStateToProps = {
  product: Product.productByIDSelector,
};

const mergeProps: MergeProps<typeof mapStateToProps, {}, ConnectedStepProps<NodeData.Payment>> = ({ product: productByIDSelector }, _, { data }) => ({
  product: productByIDSelector(data?.productID),
});

export default connect(mapStateToProps, null, mergeProps)(ConnectedPaymentStep);
