import { action } from '@storybook/addon-actions';
import React from 'react';

import { PlatformType } from '@/constants';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import StreamStep from '.';

const getProps = () => {
  const onClickPort = action('click port');
  const onNextClickPort = action('click port');
  const onPreviousClickPort = action('click port');
  const onPauseClickPort = action('click port');

  return {
    audio: 'How_to_train_your_dragon.mp3',
    onClickPort,
    onNextClickPort,
    onPreviousClickPort,
    onPauseClickPort,
  };
};

export default {
  title: 'Creator/Steps/Stream Step',
  component: StreamStep,
};

export const emptyGoogle = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Payment Block">
      <StreamStep onClickPort={onClickPort} platform={PlatformType.GOOGLE} />
    </NewBlock>
  );
};

export const emptyAlexa = () => {
  const { onNextClickPort, onPreviousClickPort } = getProps();

  return (
    <NewBlock name="Payment Block">
      <StreamStep onNextClickPort={onNextClickPort} onPreviousClickPort={onPreviousClickPort} />
    </NewBlock>
  );
};

export const withAudioAdded = () => {
  return (
    <NewBlock name="Payment Block">
      <StreamStep {...getProps()} />
    </NewBlock>
  );
};

export const withCustomPause = () => {
  return (
    <NewBlock name="Payment Block">
      <StreamStep {...getProps()} customPause={true} />
    </NewBlock>
  );
};

export const active = () => {
  return (
    <NewBlock name="Payment Block">
      <StreamStep {...getProps()} isActive />
    </NewBlock>
  );
};

export const connected = () => {
  return (
    <NewBlock name="Payment Block">
      <StreamStep {...getProps()} isNextConnected isPreviousConnected />
    </NewBlock>
  );
};
