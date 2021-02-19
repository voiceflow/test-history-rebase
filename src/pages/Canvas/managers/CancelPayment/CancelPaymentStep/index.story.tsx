import { withStepContext } from '_storybook';
import React from 'react';

import Block from '@/pages/Canvas/components/Block';

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
  <Block name="Cancel Payment Block">
    <CancelPaymentStep {...getProps()} {...props} />
  </Block>
);

export const empty = withStepContext()(render());

export const withProduct = withStepContext()(render({ label: 'New York Times Quiz Pack' }));
