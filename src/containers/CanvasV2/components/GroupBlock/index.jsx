import React from 'react';

import MergeOverlay from '@/containers/CanvasV2/components/MergeOverlay';
import { useImperativeApi } from '@/hooks';

import { Container, Overlay, Section } from './components';

export { Section };

const GroupBlock = ({ isActive, addButton = null, children, ...props }, ref) => {
  const nodeRef = useImperativeApi({ ref });

  return (
    <Container isActive={isActive} {...props} ref={nodeRef}>
      {children}
      <MergeOverlay component={Overlay} isActive={isActive} />
      {addButton}
    </Container>
  );
};

export default React.forwardRef(GroupBlock);
