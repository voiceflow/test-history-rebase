import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { FlexAround } from '@/componentsV2/Flex';
import theme from '@/styles/theme';

const req = require.context('../src', true, /\.story\.jsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);

addDecorator((story) => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);
addDecorator((story) => <FlexAround style={{ fontFamily: '"Open Sans", sans-serif' }}>{story()}</FlexAround>);
addDecorator(withKnobs);
