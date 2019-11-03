import React from 'react';

import { compose } from '@/utils/functional';

import Test from './Test';
import Variant from './Variant';

const StoryComponent = ({ Component }) => {
  return (
    <Test>
      <Component />
    </Test>
  );
};

export default (Component, ...hocs) => {
  const ComponentToRender = hocs ? compose(...hocs)(Component) : Component;

  return () => React.createElement(StoryComponent, { Component: ComponentToRender });
};
