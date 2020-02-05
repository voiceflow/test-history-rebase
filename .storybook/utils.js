import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import globalDecorator, { withStoryDetails } from './decorators';

export const configureStorybook = () => {
  addDecorator(withKnobs);
  addDecorator(globalDecorator);
  addDecorator(withStoryDetails);
};
