import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { CardStep, CardStepProps } from '.';

const CARD_IMAGE = 'https://www.sundaypost.com/wp-content/uploads/sites/13/2017/04/Glenfinnan-viaduct.jpg.jpg';

const getProps = () => {
  return {
    title: 'Hi {name}, welcome to Hogwarts',
    portID: '13tadb',
    isActive: false,
  };
};

export default {
  title: 'Creator/Steps/Card Step',
  component: CardStep,
};

const render = (props?: Partial<CardStepProps>) => () => (
  <NewBlock name="Card Block">
    <CardStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepDispatcher()(render({ title: '' }));

export const withLabel = withStepDispatcher()(render());

export const withLongLabel = withStepDispatcher()(render({ title: 'Hi {name}, welcome to Hogwarts; a magical school of whimsy and mystery' }));

export const withImage = withStepDispatcher()(render({ image: CARD_IMAGE }));

export const active = withStepDispatcher()(render({ isActive: true }));

export const withoutPort = withStepDispatcher()(render({ portID: '' }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());
