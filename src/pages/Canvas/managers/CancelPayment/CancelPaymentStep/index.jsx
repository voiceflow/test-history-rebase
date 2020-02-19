import React from 'react';

import Step, { FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

const CancelPaymentStep = ({ label, isFailConnected, isSuccessConnected, onClickSuccessPort, onClickFailPort, isActive }) => (
  <Step isActive={isActive}>
    <Section>
      <Item label={label} withPort={false} labelVariant="secondary" icon="trash" iconColor="#d94c4c" placeholder="Select a product to cancel" />
    </Section>
    {label && (
      <Section>
        <FailureItem label="Declined" isConnected={isFailConnected} onClickPort={onClickFailPort} />
        <SuccessItem label="Successfully Cancelled" isConnected={isSuccessConnected} onClickPort={onClickSuccessPort} />
      </Section>
    )}
  </Step>
);

export default CancelPaymentStep;
