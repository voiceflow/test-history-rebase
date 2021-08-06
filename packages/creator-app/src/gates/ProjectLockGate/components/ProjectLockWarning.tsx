import { Button } from '@voiceflow/ui';
import React from 'react';

import SessionLocked from '@/components/SessionLocked';

export interface ProjectLockWarningProps {
  onTakeover: () => void;
}

const ProjectLockWarning: React.FC<ProjectLockWarningProps> = ({ onTakeover }) => (
  <SessionLocked>
    <Button onClick={onTakeover}>Takeover session</Button>
  </SessionLocked>
);

export default ProjectLockWarning;
