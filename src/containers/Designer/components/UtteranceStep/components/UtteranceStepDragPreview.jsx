import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import StepIconContainer from '@/containers/Designer/components/Step/components/StepIconContainer';

import UtteranceContainer from './UtteranceContainer';

const UtteranceStepDragPreview = ({ icon, color, getRect, children }) => (
  <div style={{ width: `${getRect().width}px` }}>
    <UtteranceContainer isDragging={false}>
      <StepIconContainer>
        <SvgIcon icon={icon} color={color} />
      </StepIconContainer>
      <Flex>{children}</Flex>
    </UtteranceContainer>
  </div>
);

export default UtteranceStepDragPreview;
