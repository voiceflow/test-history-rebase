import React from 'react';

import Button from '@/components/Button';
import SessionLocked from '@/components/ErrorPages/SessionLocked';

const ProjectLockWarning = ({ onTakeover }) => (
  <SessionLocked>
    <Button onClick={onTakeover}>Takeover session</Button>
  </SessionLocked>
);

export default ProjectLockWarning;
