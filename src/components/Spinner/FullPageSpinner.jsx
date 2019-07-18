import React from 'react';
import styled from 'styled-components';

import Spinner from './Spinner';

const Diagram = styled.div`
  position: ${(props) => (props.isAbs ? 'absolute' : 'fixed')};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullSpinner = (props) => {
  return (
    <Diagram>
      <Spinner {...props} />
    </Diagram>
  );
};

export default FullSpinner;
