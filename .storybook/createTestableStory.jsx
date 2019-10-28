import React from 'react';

import Test from './Test';
import Variant from './Variant';

const StoryComponent = ({ Component }) => {
  return (
    <Test>
      <Component />
    </Test>
  );
};

export default (Component) => () => React.createElement(StoryComponent, { Component });
