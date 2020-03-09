import { action } from '@storybook/addon-actions';
import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { CodeStep, CodeStepProps } from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    codeAdded: true,
    withPorts: true,
    successPort: 'abc',
    failPort: 'abc',
  };
};

const render = (props?: Partial<CodeStepProps>) => (
  <NewBlock name="Code Block">
    <CodeStep {...getProps()} {...props} />
  </NewBlock>
);

export default {
  title: 'Creator/Steps/Code Step',
  component: CodeStep,
};

export const empty = withStepDispatcher()(() => render({ codeAdded: false }));

export const emptyWithoutPorts = withStepDispatcher()(() => render({ codeAdded: false, withPorts: false }));

export const codeAdded = withStepDispatcher()(render);

export const withoutPorts = withStepDispatcher()(() => render({ withPorts: false }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render);

export const active = withStepDispatcher()(() => render({ isActive: true }));
