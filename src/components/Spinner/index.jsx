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

export const Spinner = (props) => {
  return (
    <div id="loading-diagram" className={cn({ transparent: props.transparent })}>
      <div className="text-center">
        <Loader />
        <Text>{props.message || `Loading ${props.name}...`}</Text>
      </div>
    </div>
  );
};

export default Spinner;
