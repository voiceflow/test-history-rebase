import { withRedux } from '_storybook';
import React from 'react';

import ConfirmModal from '.';

export default {
  title: 'Modal/Confirm',
  component: ConfirmModal,
  includeStories: [],
};

export const normal = withRedux()(() => <ConfirmModal />);
