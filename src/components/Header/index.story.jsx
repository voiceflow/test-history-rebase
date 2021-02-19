import { withRedux } from '_storybook';
import React from 'react';

import Header from '.';

export default {
  title: 'Header',
  component: Header,
  includeStories: [],
};

export const normal = withRedux()(() => <Header />);
