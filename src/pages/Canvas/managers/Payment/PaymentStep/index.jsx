import React from 'react';

import Step, { FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';
import { LabelVariant } from '@/pages/Canvas/components/Step/constants';

function PaymentStep({
  productLabel,
  upsellMessage,
  onSuccessPortClick,
  isConnectedSuccessPort = false,
  onFailPortClick,
  isConnectedFailPort = false,
  isActive,
}) {
  return (
    <Step isActive={isActive}>
      <Section>
        <Item label={productLabel} withPort={false} labelVariant="secondary" icon="purchase" iconColor="#558B2F" placeholder="Select a product" />
      </Section>
      {productLabel && (
        <>
          <Section>
            <Item withPort={false} icon="alexa" iconColor="#616c60" label={upsellMessage} placeholder="Add Upsell Message" />
          </Section>
          <Section>
            <FailureItem
              label={
                <>
                  <VariableLabel>Declined</VariableLabel> or <VariableLabel>Error</VariableLabel>
                </>
              }
              labelVariant={LabelVariant.SECONDARY}
              isConnected={isConnectedFailPort}
              onClickPort={onFailPortClick}
            />
            <SuccessItem label="Purchased" isConnected={isConnectedSuccessPort} onClickPort={onSuccessPortClick} />
          </Section>
        </>
      )}
    </Step>
  );
}

export default PaymentStep;
