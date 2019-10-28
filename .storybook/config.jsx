import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';

addDecorator(withKnobs);

function loadStories() {
  const req = require.context('../src', true, /\.story\.jsx$/);

  req.keys().forEach(req);
}

configure(loadStories, module);
