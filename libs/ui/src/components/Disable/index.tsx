import React from 'react';

import { DisableBox } from './components';

const DisableContainer: React.FC<React.PropsWithChildren<{ disabled: boolean }>> = ({ disabled, children }) => {
  return <DisableBox disabled={disabled}>{children}</DisableBox>;
};

export default DisableContainer;
