import { Box, BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import { UploadProject } from '@/models';
import { ProjectItem, ProjectSelectionFooter, ProjectSelectionFooterLink } from '@/pages/Publish/Upload/components';

interface ProjectStateAgentListProps {
  projects: UploadProject.Dialogflow[];
  onCreateNewAgent: () => void;
  onProjectSelected: (selectedProject: UploadProject.Dialogflow) => void;
}

const ProjectStateAgentList: React.FC<ProjectStateAgentListProps> = ({ projects, onCreateNewAgent, onProjectSelected }) => {
  return (
    <>
      <Box height={42} display="flex" mb={10} alignItems="flex-end" pl={24}>
        <Text fontWeight={600} fontSize={15}>
          Connect to Agent
        </Text>
      </Box>

      <Box maxHeight={400} style={{ overflow: 'auto' }} pb={12}>
        {projects.map(({ googleProjectID, agentName }) => (
          <BoxFlex key={googleProjectID} fullWidth onClick={() => onProjectSelected({ googleProjectID, agentName })}>
            <ProjectItem>{agentName}</ProjectItem>
          </BoxFlex>
        ))}
      </Box>

      <ProjectSelectionFooter>
        <ProjectSelectionFooterLink onClick={onCreateNewAgent}>Create New Agent</ProjectSelectionFooterLink>
      </ProjectSelectionFooter>
    </>
  );
};

export default ProjectStateAgentList;
