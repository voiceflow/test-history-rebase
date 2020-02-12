import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import User from '@/components/User';

import Container from './CombinedBlockHandleContainer';

const CombinedBlockHandle = ({ icon, color, lockOwner, className }, ref) => (
  <Container className={className} ref={ref}>
    {lockOwner && <User user={lockOwner} />}
    <SvgIcon icon={icon} color={color} className="drag-handle__icon" />
    <SvgIcon icon="grid" className="drag-handle" />
  </Container>
);

export default React.forwardRef(CombinedBlockHandle);
