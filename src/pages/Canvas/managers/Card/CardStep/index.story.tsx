import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { CardStep, CardStepProps } from '.';

const CARD_IMAGE = 'https://www.sundaypost.com/wp-content/uploads/sites/13/2017/04/Glenfinnan-viaduct.jpg.jpg';

const getProps = () => ({
  title: 'Hi {name}, welcome to Hogwarts',
  portID: '13tadb',
  image: undefined,
});

export default {
  title: 'Creator/Steps/Card Step',
  component: CardStep,
};

const render = (props?: Partial<CardStepProps>) => () => (
  <NewBlock name="Card Block">
    <CardStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepContext()(render({ title: '' }));

export const withLabel = withStepContext()(render());

export const withLongLabel = withStepContext()(render({ title: 'Hi {name}, welcome to Hogwarts; a magical school of whimsy and mystery' }));

export const withImage = withStepContext()(render({ image: CARD_IMAGE }));

export const active = withStepContext({ isActive: true })(render());

export const withoutPort = withStepContext({ withPorts: false })(render());

export const connected = withStepContext({ isConnected: true })(render());
