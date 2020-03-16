import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { CancelPaymentStep, CancelPaymentStepProps } from '.';

const getProps = () => ({
  withPorts: true,
  label: 'product name',
  successPortID: 'successPortID',
  failurePortID: 'failurePortID',
});

export default {
  title: 'Creator/Steps/Cancel Payment Step',
  component: CancelPaymentStep,
};

const render = (props?: Partial<CancelPaymentStepProps>) => () => (
  <NewBlock name="Cancel Payment Block">
    <CancelPaymentStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepDispatcher()(render());

export const withProduct = withStepDispatcher()(render({ label: 'New York Times Quiz Pack' }));
