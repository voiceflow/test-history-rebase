import { action } from '@storybook/addon-actions';
import React from 'react';

import EmptyCard from '.';

const getProps = () => ({
  onClick: action('click'),
});

export default {
  title: 'Card/Empty',
  component: EmptyCard,
};

export const normal = () => <EmptyCard {...getProps()} />;
