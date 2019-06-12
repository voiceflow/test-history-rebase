import React from 'react';
import { createPortal } from 'react-dom';
import wrapDisplayName from 'recompose/wrapDisplayName';

const rootNode = document.querySelector('#root');

export default () => (Wrapper) => {
  function WithRootPortal(props) {
    return createPortal(<Wrapper {...props} />, rootNode);
  }

  WithRootPortal.displayName = wrapDisplayName(Wrapper, 'WithRootPortal');

  return WithRootPortal;
};
