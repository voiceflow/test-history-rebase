import { action } from '@storybook/addon-actions';
import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { CaptureStep, CaptureStepProps } from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    fromVariable: 'FirstName',
    toVariable: 'Name',
    portID: 'fsgqe',
    isActive: false,
  };
};

export default {
  title: 'Creator/Steps/Capture Step',
  component: CaptureStep,
};

const render = (props?: Partial<CaptureStepProps>) => () => (
  <NewBlock name="Capture Block">
    <CaptureStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepDispatcher()(render({ fromVariable: '', toVariable: '' }));

export const withVariables = withStepDispatcher()(render());

export const withLongVariables = withStepDispatcher()(render({ fromVariable: 'UK_First_name', toVariable: 'Name' }));

export const withoutPort = withStepDispatcher()(render({ portID: '' }));

export const active = withStepDispatcher()(render({ isActive: true }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());
