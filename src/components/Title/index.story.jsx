import { text } from '@storybook/addon-knobs';
import React from 'react';

import Title from '.';

const getProps = () => ({
  children: text('Label', 'Title'),
});

export default {
  title: 'Title',
  component: Title,
};

export const heading = () => <Title {...getProps()} />;

export const subheading = () => <Title variant="subheading" {...getProps()} />;

export const subtitle = () => <Title variant="subtitle" {...getProps()} />;

export const label = () => <Title variant="label" {...getProps()} />;
