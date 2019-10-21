import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { FlexApart } from '@/componentsV2/Flex';
import { IconContainer } from '@/containers/Designer/components/Step/components';
import StepContainer from '@/containers/Designer/components/Step/components/StepContainer';

import { Message, PortContainer } from './components';

export const ActionType = {
  PROMPT: 'prompt',
};

export const PLACEHOLDER_CONTENT = {
  isPlaceholder: true,
  message: 'No action selected',
  icon: 'power',
};

export const ACTION_CONTENT = {
  [ActionType.PROMPT]: {
    message: 'Prompt the user',
    icon: 'choice',
    color: '#3A5999',
  },
};

const ActionStep = ({ type }) => {
  const { isPlaceholder, message, icon, color } = ACTION_CONTENT[type] || PLACEHOLDER_CONTENT;

  return (
    <StepContainer>
      <IconContainer>
        <SvgIcon icon={icon} color={color} />
      </IconContainer>
      <FlexApart fullWidth>
        <Message isPlaceholder={isPlaceholder}>{message}</Message>
        <PortContainer disabled={isPlaceholder}>
          <SvgIcon icon="portConnected" />
        </PortContainer>
      </FlexApart>
    </StepContainer>
  );
};

export default ActionStep;
