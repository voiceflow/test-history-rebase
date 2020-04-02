import React from 'react';

import { withStepContext } from '@/../.storybook';
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

export const empty = withStepContext()(render());

export const withProduct = withStepContext()(render({ label: 'New York Times Quiz Pack' }));
