import { withRedux } from '_storybook';
import React from 'react';

import ErrorModal from '.';

export default {
  title: 'Modal/Error',
  component: ErrorModal,
  includeStories: [],
};

export const normal = withRedux()(() => <ErrorModal />);
