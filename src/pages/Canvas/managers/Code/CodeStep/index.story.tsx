import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { CodeStep, CodeStepProps } from '.';

const getProps = () => {
  return {
    codeAdded: true,
    withPorts: true,
    successPortID: 'abc',
    failurePortID: 'abc',
  };
};

const render = (props?: Partial<CodeStepProps>) => () => (
  <NewBlock name="Code Block">
    <CodeStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Code Step',
  component: CodeStep,
};

export const empty = withStepContext()(render({ codeAdded: false }));

export const emptyWithoutPorts = withStepContext()(render({ codeAdded: false, withPorts: false }));

export const codeAdded = withStepContext()(render());

export const withoutPorts = withStepContext()(render({ withPorts: false }));

export const connected = withStepContext({ isConnected: true })(render());

export const active = withStepContext({ isActive: true })(render());
