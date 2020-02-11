import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import CardStep from '.';

const CARD_IMAGE = 'https://www.sundaypost.com/wp-content/uploads/sites/13/2017/04/Glenfinnan-viaduct.jpg.jpg';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    label: 'Hi {name}, welcome to Hogwarts',
    onClickPort,
  };
};

export default {
  title: 'Creator/Steps/Card Step',
  component: CardStep,
};

export const empty = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Card Block">
      <CardStep onClickPort={onClickPort} />
    </NewBlock>
  );
};

export const withLabel = () => (
  <NewBlock name="Card Block">
    <CardStep {...getProps()} />
  </NewBlock>
);

export const withLongLabel = () => (
  <NewBlock name="Card Block">
    <CardStep {...getProps()} label="Hi {name}, welcome to Hogwarts; a magical school of whimsy and mystery" />
  </NewBlock>
);

export const withImage = () => (
  <NewBlock name="Card Block">
    <CardStep {...getProps()} image={CARD_IMAGE} />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Card Block">
    <CardStep {...getProps()} isActive image={CARD_IMAGE} />
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Card Block">
    <CardStep {...getProps()} withPort={false} />
  </NewBlock>
);

export const connected = () => (
  <NewBlock name="Card Block">
    <CardStep {...getProps()} isConnected />
  </NewBlock>
);
