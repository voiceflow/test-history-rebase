import React from 'react';

import { DisableBox } from './components';

const DisableContainer: React.OldFC<{ disabled: boolean }> = ({ disabled, children }) => {
  return <DisableBox disabled={disabled}>{children}</DisableBox>;
};

export default DisableContainer;
