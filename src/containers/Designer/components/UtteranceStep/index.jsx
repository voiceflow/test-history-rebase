import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import StepIconContainer from '@/containers/Designer/components/Step/components/StepIconContainer';
import { DragTargetType } from '@/containers/Designer/constants';
import { useReorderable } from '@/containers/Designer/hooks';

import { Container } from './components';

const UtteranceStep = ({ isReorderable, icon, color, children }) => {
  const [isDragging, connectTarget, renderHandle] = useReorderable(DragTargetType.UTTERANCE_STEP, { icon, color, children });

  return (
    <Container isDragging={isDragging} ref={isReorderable && connectTarget}>
      <StepIconContainer>
        {isReorderable && renderHandle()}
        <SvgIcon icon={icon} color={color} />
      </StepIconContainer>
      <Flex>{children}</Flex>
    </Container>
  );
};

export default UtteranceStep;
