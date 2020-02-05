import { action } from '@storybook/addon-actions';
import React from 'react';

import VoiceCards from '.';

const getProps = () => ({
  onClick: action('click'),
});

export default {
  title: 'Card/Voice',
  component: VoiceCards,
};

export const normal = () => <VoiceCards {...getProps()} />;
