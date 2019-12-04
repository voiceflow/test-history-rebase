import React from 'react';

import SessionLocked from '@/components/ErrorPages/SessionLocked';
import Button from '@/componentsV2/Button';

const ProjectLockWarning = ({ onTakeover }) => (
  <SessionLocked>
    <Button onClick={onTakeover}>Takeover session</Button>
  </SessionLocked>
);

export default ProjectLockWarning;
