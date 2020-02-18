import React from 'react';

import Step, { FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';

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
        <Item label={productLabel} withPort={false} labelVariant="secondary" icon="purchase" placeholder="Select a product" />
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
              labelVariant="secondary"
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
