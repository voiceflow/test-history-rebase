import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { CaptureStep, CaptureStepProps } from '.';

const getProps = () => ({
  fromVariable: 'FirstName',
  toVariable: 'Name',
  portID: 'fsgqe',
});

export default {
  title: 'Creator/Steps/Capture Step',
  component: CaptureStep,
};

const render = (props?: Partial<CaptureStepProps>) => () => (
  <NewBlock name="Capture Block">
    <CaptureStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepContext()(render({ fromVariable: '', toVariable: '' }));

export const withVariables = withStepContext()(render());

export const withLongVariables = withStepContext()(render({ fromVariable: 'UK_First_name', toVariable: 'Name' }));

export const withoutPort = withStepContext({ withPorts: false })(render());

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());
