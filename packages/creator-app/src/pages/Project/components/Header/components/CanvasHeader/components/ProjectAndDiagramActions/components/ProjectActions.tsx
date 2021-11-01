import { Box, Dropdown, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { useProjectOptions } from '@/hooks';

import CaretDownContainer from './CaretDownContainer';

interface ProjectActionsProps {
  onRename: () => void;
  projectID?: string | null;
  projectName?: string | null;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ onRename, projectID, projectName }) => {
  const options = useProjectOptions({
    onRename,
    projectID,
    projectName,
  });

  return !options.length ? (
    <Box width="8px" />
  ) : (
    <Dropdown options={options} placement="bottom" selfDismiss>
      {(ref, onToggle, isOpened) => (
        <CaretDownContainer ref={ref} onClick={onToggle} active={isOpened}>
          <SvgIcon icon="caretDown" width={10} height={5} />
        </CaretDownContainer>
      )}
    </Dropdown>
  );
};

export default ProjectActions;
