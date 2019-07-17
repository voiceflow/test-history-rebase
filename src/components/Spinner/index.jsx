import cn from 'classnames';
import React from 'react';
import styled from 'styled-components';

import Loader from '../Loader';

const Text = styled.div`
  color: #132144;
  font-weight: 400;
  font-size: 18px;
  padding-bottom: 14px;
`;

export const Spinner = ({ transparent, isEmpty, message, name }) => {
  return (
    <div id="loading-diagram" className={cn({ transparent })}>
      <div className="text-center">
        <Loader />
        {!isEmpty && <Text>{message || `Loading ${name}...`}</Text>}
      </div>
    </div>
  );
};

export default Spinner;
