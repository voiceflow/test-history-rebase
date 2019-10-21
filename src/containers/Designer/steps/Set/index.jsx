import React from 'react';

import { FlexApart } from '@/componentsV2/Flex';
import Step from '@/containers/Designer/components/Step';

import { VariableBadge, VariableInfo } from './components';

const SetStep = () => (
  <Step title="set">
    <FlexApart fullWidth>
      <VariableBadge>sessions</VariableBadge>
      <VariableInfo>{'{sessions} + 1'}</VariableInfo>
    </FlexApart>
  </Step>
);

export default SetStep;
