import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import CaptureStep from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    fromVariable: 'FirstName',
    toVariable: 'Name',
  };
};

export default {
  title: 'Creator/Steps/Capture Step',
  component: CaptureStep,
};

export const empty = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Capture Block">
      <CaptureStep onClickPort={onClickPort} />
    </NewBlock>
  );
};

export const withVariables = () => (
  <NewBlock name="Capture Block">
    <CaptureStep {...getProps()} fromVariable="FirstName" toVariable="Name" />
  </NewBlock>
);

export const withLongVariables = () => (
  <NewBlock name="Capture Block">
    <CaptureStep {...getProps()} fromVariable="UK_First_name" toVariable="Name" />
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Capture Block">
    <CaptureStep {...getProps()} withPort={false} />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Capture Block">
    <CaptureStep {...getProps()} isActive />
  </NewBlock>
);

export const connected = () => (
  <NewBlock name="Capture Block">
    <CaptureStep {...getProps()} isConnected />
  </NewBlock>
);
