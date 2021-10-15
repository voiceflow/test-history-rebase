import { FlexApart, FlexCenter, Text } from '@voiceflow/ui';
import React from 'react';

import { ProjectSelectionFooter, ProjectSelectionFooterLink } from '@/pages/Publish/Upload/components';

interface ProjectStateEmptyProps {
  onCreateNewAgent: () => void;
}

const ProjectStateEmpty: React.FC<ProjectStateEmptyProps> = ({ onCreateNewAgent }) => {
  return (
    <FlexApart style={{ height: '264px', flexDirection: 'column' }}>
      <FlexCenter fullWidth style={{ padding: '32px 32px 0 24px', alignItems: 'center', height: '100%' }}>
        <Text textAlign="center" mb={20} fontSize={15} lineHeight="22px" color="#132144">
          No agents exist on the Dialogflow ES Console to connect to. Create a new agent now.
        </Text>
      </FlexCenter>
      <ProjectSelectionFooter>
        <ProjectSelectionFooterLink onClick={onCreateNewAgent}>Create New Agent</ProjectSelectionFooterLink>
      </ProjectSelectionFooter>
    </FlexApart>
  );
};

export default ProjectStateEmpty;
