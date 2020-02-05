import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';

import Button from '.';

const getProps = () => ({
  disabled: boolean('Disabled', false),
  children: text('Label', 'Button'),
  onClick: action('click'),
});

export default {
  title: 'Button',
  component: Button,
};

export const primary = () => <Button variant="primary" {...getProps()} />;

export const primaryWithIcon = () => <Button variant="primary" icon="plus" {...getProps()} />;

export const secondary = () => <Button variant="secondary" {...getProps()} />;

export const secondaryWithIcon = () => <Button icon="plus" variant="secondary" {...getProps()} />;

export const tertiary = () => <Button variant="tertiary" {...getProps()} />;
