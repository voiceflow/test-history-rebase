import React from 'react';

import { withRedux } from '@/../.storybook';

import ConfirmModal from '.';

export default {
  title: 'Modal/Confirm',
  component: ConfirmModal,
  includeStories: [],
};

export const normal = withRedux()(() => <ConfirmModal />);
