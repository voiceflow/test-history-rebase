import React from 'react';

import { DragTargetType } from '@/containers/Designer/constants';
import { useReorderable } from '@/containers/Designer/hooks';

import { Container, Title } from './components';

const Step = ({ title, className, children }) => {
  const [isDragging, connectTarget, renderHandle] = useReorderable(DragTargetType.STEP, { title, children });

  return (
    <Container isDragging={isDragging} className={className} ref={connectTarget}>
      {renderHandle()}
      <Title>{title}</Title>
      {children}
    </Container>
  );
};

export default Step;
