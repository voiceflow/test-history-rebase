import { Box, BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import { Project } from '../constants';
import ProjectItem from './ProjectItem';
import ProjectSelectionFooter from './ProjectSelectionFooter';
import ProjectSelectionFooterLink from './ProjectSelectionFooterLink';

interface StageProjectListProps {
  title: string;
  projects: Project[];
  onFooterSubmit: () => void;
  footerSubmitText: string;
  onProjectSelected: (selectedProject: Project) => void;
}

const StageProjectList: React.FC<StageProjectListProps> = ({ projects, title, onFooterSubmit, footerSubmitText, onProjectSelected }) => {
  return (
    <>
      <Box height={42} display="flex" mb={10} alignItems="flex-end" pl={24}>
        <Text fontWeight={600} fontSize={15} color="#132144">
          {title}
        </Text>
      </Box>

      <Box maxHeight={400} style={{ overflow: 'auto' }} pb={12}>
        {projects.map(({ id, name }) => (
          <BoxFlex key={id} fullWidth onClick={() => onProjectSelected({ id, name })}>
            <ProjectItem>{name}</ProjectItem>
          </BoxFlex>
        ))}
      </Box>

      <ProjectSelectionFooter>
        <ProjectSelectionFooterLink onClick={onFooterSubmit}>{footerSubmitText}</ProjectSelectionFooterLink>
      </ProjectSelectionFooter>
    </>
  );
};

export default StageProjectList;
