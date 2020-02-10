import React from 'react';

import { withRedux } from '@/../.storybook';

import ErrorModal from '.';

export default {
  title: 'Modal/Error',
  component: ErrorModal,
  includeStories: [],
};

export const normal = withRedux()(() => <ErrorModal />);
