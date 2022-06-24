import { Box, SvgIcon, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { useEnableDisable } from '@/hooks';

import { StepItem } from '../../../constants';
import { SubMenuButtonContainer } from './SubMenuButtonContainer';

const SubMenuButton: React.FC<{ step: StepItem }> = ({ step }) => {
  const [isClickedState, enableClickedState, clearClickedState] = useEnableDisable();

  return (
    <SubMenuButtonContainer isClicked={isClickedState} onMouseUp={clearClickedState} onMouseDown={enableClickedState}>
      <TippyTooltip
        position="right"
        interactive
        bodyOverflow
        html={
          <TippyTooltip.FooterButton buttonText="More" width={200} onClick={() => window.open(step.tooltipLink, '_blank')}>
            {step.tooltipText}
          </TippyTooltip.FooterButton>
        }
      >
        <Box.FlexStart>
          <SvgIcon icon={step.icon} size={16} />
          <Text pl={12} fontSize="15px">
            {step.name}
          </Text>
        </Box.FlexStart>
      </TippyTooltip>
    </SubMenuButtonContainer>
  );
};

export default SubMenuButton;
