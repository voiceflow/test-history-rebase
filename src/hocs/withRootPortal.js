import React from 'react';
import { createPortal } from 'react-dom';
import wrapDisplayName from 'recompose/wrapDisplayName';

const rootNode = document.querySelector('#root');

export default () => (Wrapper) => {
  const WithRootPortal = (props) => createPortal(<Wrapper {...props} />, rootNode);

  WithRootPortal.displayName = wrapDisplayName(Wrapper, 'WithRootPortal');

  return WithRootPortal;
};
