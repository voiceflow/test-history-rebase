import cn from 'classnames';
import React from 'react';
import styled from 'styled-components';

import Loader from '../Loader';

const Text = styled.div`
  color: #132144;
  font-weight: 400;
  font-size: 18px;
`;

const Spinner = ({ message, name, isLg, isMd, color, className }) => {
  return (
    <div className={cn('text-center', className)}>
      <Loader isLg={isLg} isMd={isMd} color={color} />
      {!!(message || name) && <Text>{message || `Loading ${name}...`}</Text>}
    </div>
  );
};

export default Spinner;
