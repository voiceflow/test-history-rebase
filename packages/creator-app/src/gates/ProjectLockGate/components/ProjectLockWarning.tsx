import React from 'react';

import Button from '@/components/Button';
import SessionLocked from '@/components/ErrorPages/SessionLocked';

export type ProjectLockWarningProps = {
  onTakeover: () => void;
};

const ProjectLockWarning: React.FC<ProjectLockWarningProps> = ({ onTakeover }) => (
  <SessionLocked>
    <Button onClick={onTakeover}>Takeover session</Button>
  </SessionLocked>
);

export default ProjectLockWarning;
