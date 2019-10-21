import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Step from '@/containers/Designer/components/Step';

const PromptStep = ({ children }) => (
  <Step>
    <SvgIcon icon="user" />
    {children}
  </Step>
);

export default PromptStep;
