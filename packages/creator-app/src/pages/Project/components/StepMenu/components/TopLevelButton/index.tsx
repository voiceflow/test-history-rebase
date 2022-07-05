import { SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useHover } from '@/hooks';

import { TopStepItem } from '../../constants';
import SubMenu from '../SubMenu';
import { TopLevelButtonContainer } from './TopLevelButtonContainer';

interface TopLevelButtonItem {
  step: TopStepItem;
  isVisible: boolean;
}

const TopLevelButton: React.FC<TopLevelButtonItem> = ({ step, isVisible }) => {
  const [isHovered, , hoverHandlers] = useHover();

  return (
    <TopLevelButtonContainer focused={isHovered} visible={isVisible} {...hoverHandlers}>
      <SvgIcon icon={step.icon} size={step.label === 'Logic' ? 24 : 22} marginLeft="21px" style={{ display: 'block' }} />
      <Text paddingTop="3px" fontSize="11px" fontWeight={600}>
        {step.label}
      </Text>
      {step.steps && isHovered && <SubMenu steps={step.steps} />}
    </TopLevelButtonContainer>
  );
};

export default TopLevelButton;
