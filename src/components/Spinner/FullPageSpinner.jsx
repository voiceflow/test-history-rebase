import cn from 'classnames';
import React from 'react';

import Spinner from './Spinner';

const FullSpinner = (props) => {
  const { transparent } = props;
  return (
    <div id="loading-diagram" className={cn({ transparent })}>
      <Spinner {...props} />
    </div>
  );
};

export default FullSpinner;
