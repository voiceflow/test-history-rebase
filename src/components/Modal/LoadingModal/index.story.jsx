import React from 'react';

import LoadingModal from '.';

export default {
  title: 'Modal/Loading',
  component: LoadingModal,
  includeStories: [],
};

export const normal = () => <LoadingModal open />;
