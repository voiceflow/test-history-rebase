import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { PaymentStep, PaymentStepProps } from '.';

const getProps = () => ({
  label: 'Hi {name}, welcome to Hogwarts',
  successPortID: 'successPortID',
  failurePortID: 'failurePortID',
  withPorts: true,
  upsellMessage: "If you'd like to access the full collection, visit NYT website",
});

export default {
  title: 'Creator/Steps/Payment Step',
  component: PaymentStep,
};

const render = (props?: Partial<PaymentStepProps>) => () => (
  <NewBlock name="Payment Block">
    <PaymentStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepContext()(render({ label: '', upsellMessage: '' }));

export const filledProduct = withStepContext()(render());

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());
