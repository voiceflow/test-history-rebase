import React from 'react';

import { withRedux } from '@/../.storybook';

import AmazonLogin from '.';

export default {
  title: 'Forms/Amazon Login',
  component: AmazonLogin,
  includeStories: [],
};

export const normal = withRedux()(() => <AmazonLogin />);
