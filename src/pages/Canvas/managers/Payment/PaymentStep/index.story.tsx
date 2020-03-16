import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { PaymentStep, PaymentStepProps } from '.';

const getProps = () => {
  return {
    label: 'Hi {name}, welcome to Hogwarts',
    successPortID: 'successPortID',
    failurePortID: 'failurePortID',
    withPorts: true,
    upsellMessage: "If you'd like to access the full collection, visit NYT website",
  };
};

export default {
  title: 'Creator/Steps/Payment Step',
  component: PaymentStep,
};

const render = (props?: Partial<PaymentStepProps>) => () => (
  <NewBlock name="Payment Block">
    <PaymentStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepDispatcher()(render({ label: '', upsellMessage: '' }));

export const filledProduct = withStepDispatcher()(render());

export const active = withStepDispatcher()(render({ isActive: true }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());
