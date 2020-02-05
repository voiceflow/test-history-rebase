import React from 'react';

import { withRedux } from '@/../.storybook';

import Header from '.';

export default {
  title: 'Header',
  component: Header,
  includeStories: [],
};

export const normal = withRedux()(() => <Header />);
