import { SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { TopStepItem } from '../../constants';
import { TopLevelButtonContainer } from './TopLevelButtonContainer';

interface TopLevelButtonItem {
  step: TopStepItem;
  isFocused: boolean;
  onClick: (step: TopStepItem) => void;
}

const TopLevelButton: React.FC<TopLevelButtonItem> = ({ step, isFocused, onClick }) => {
  return (
    <TopLevelButtonContainer onClick={() => onClick(step)} focused={isFocused}>
      <SvgIcon icon={step.icon} size={22}></SvgIcon>
      <Text paddingTop="4px" fontSize="11px">
        {step.name}
      </Text>
    </TopLevelButtonContainer>
  );
};

export default TopLevelButton;
