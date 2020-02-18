import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import PaymentStep from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    label: 'Hi {name}, welcome to Hogwarts',
    onClickPort,
  };
};

export default {
  title: 'Creator/Steps/Payment Step',
  component: PaymentStep,
};

export const empty = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Payment Block">
      <PaymentStep onClickPort={onClickPort} />
    </NewBlock>
  );
};

export const filledProduct = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Payment Block">
      <PaymentStep productLabel="New York Times Quiz" onClickPort={onClickPort} />
    </NewBlock>
  );
};

export const filledProductWithUpsell = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Payment Block">
      <PaymentStep
        productLabel="New York Times Quiz"
        upsellMessage="If you'd like to access the full collection, visit NYT website"
        onClickPort={onClickPort}
      />
    </NewBlock>
  );
};

export const active = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Payment Block">
      <PaymentStep
        productLabel="New York Times Quiz"
        upsellMessage="If you'd like to access the full collection, visit NYT website"
        onClickPort={onClickPort}
        isActive
      />
    </NewBlock>
  );
};

export const connected = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Payment Block">
      <PaymentStep
        productLabel="New York Times Quiz"
        upsellMessage="If you'd like to access the full collection, visit NYT website"
        onClickPort={onClickPort}
        isConnectedSuccessPort
        isConnectedFailPort
      />
    </NewBlock>
  );
};
