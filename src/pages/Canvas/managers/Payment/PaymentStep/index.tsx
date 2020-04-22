import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Product from '@/ducks/product';
import { connect } from '@/hocs';
import * as Models from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';
import { ConnectedProps, MergeArguments } from '@/types';

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
};

const ConnectedPaymentStep: React.FC<ConnectedStepProps<Models.NodeData.Payment> & ConnectedPaymentStepProps> = ({ node, withPorts, product }) => {
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

const mergeProps = (
  ...[{ product: productByIDSelector }, , { data }]: MergeArguments<typeof mapStateToProps, {}, ConnectedStepProps<Models.NodeData.Payment>>
) => ({
  product: data?.productID ? productByIDSelector(data.productID) : null,
});

type ConnectedPaymentStepProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)<ConnectedStepProps<Models.NodeData.Payment>>(ConnectedPaymentStep as React.FC);
