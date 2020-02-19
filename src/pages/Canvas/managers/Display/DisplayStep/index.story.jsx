import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import DisplayStep from '.';

const DISPLAY_IMAGE = 'https://www.sundaypost.com/wp-content/uploads/sites/13/2017/04/Glenfinnan-viaduct.jpg.jpg';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    label: 'Hi {name}, welcome to Hogwarts',
    onClickPort,
  };
};

export default {
  title: 'Creator/Steps/Display Step',
  component: DisplayStep,
};

export const empty = () => {
  return (
    <NewBlock name="Display Block">
      <DisplayStep />
    </NewBlock>
  );
};

export const withoutImage = () => {
  return (
    <NewBlock name="Display Block">
      <DisplayStep {...getProps()} />
    </NewBlock>
  );
};

export const withImage = () => {
  return (
    <NewBlock name="Display Block">
      <DisplayStep image={DISPLAY_IMAGE} {...getProps()} />
    </NewBlock>
  );
};

export const longLabel = () => {
  return (
    <NewBlock name="Display Block">
      <DisplayStep image={DISPLAY_IMAGE} {...getProps()} label="Hi my name is Rick Sanchez and this is my Morty" />
    </NewBlock>
  );
};

export const active = () => {
  return (
    <NewBlock name="Display Block">
      <DisplayStep image={DISPLAY_IMAGE} {...getProps()} isActive />
    </NewBlock>
  );
};

export const connected = () => {
  return (
    <NewBlock name="Display Block">
      <DisplayStep isConnected image={DISPLAY_IMAGE} {...getProps()} />
    </NewBlock>
  );
};

export const withoutPort = () => {
  return (
    <NewBlock name="Display Block">
      <DisplayStep image={DISPLAY_IMAGE} {...getProps()} withPort={false} />
    </NewBlock>
  );
};
