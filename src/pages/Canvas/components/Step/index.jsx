import React from 'react';

import { Container } from './components';

export * from './components';

const Step = ({ isActive, children }) => {
  return <Container isActive={isActive}>{children}</Container>;
};

export default Step;
