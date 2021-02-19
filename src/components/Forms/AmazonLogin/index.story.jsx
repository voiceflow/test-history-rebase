import { withRedux } from '_storybook';
import React from 'react';

import AmazonLogin from '.';

export default {
  title: 'Forms/Amazon Login',
  component: AmazonLogin,
  includeStories: [],
};

export const normal = withRedux()(() => <AmazonLogin />);
