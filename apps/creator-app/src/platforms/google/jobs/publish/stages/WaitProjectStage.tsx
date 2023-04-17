import { Box, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { LoaderStage, StageContainer, StageEmpty, StageProjectList } from '@/components/PlatformUploadPopup/components';
import { useAsyncMountUnmount } from '@/hooks';
import { GooglePublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const WaitProjectStage: React.FC<StageComponentProps<GooglePublishJob.WaitProjectStage>> = ({ updateCurrentStage }) => {
  const [projects, setProjects] = React.useState<{ id: string; name?: string }[]>([]);
  const projectList = React.useMemo(() => projects.map(({ id, name = '' }) => ({ id, name })), [projects]);

  const [state, api] = useSmartReducerV2({ error: false, loading: true });

  const handleCreateNewProject = () => {
    updateCurrentStage(null);
  };

  useAsyncMountUnmount(async () => {
    try {
      const projectIDs = await client.platform.google.project.getGoogleProjects();

      api.update({ error: false, loading: false });

      setProjects(projectIDs);
    } catch {
      api.update({ error: true, loading: false });
    }
  });

  const stateContent = React.useMemo(() => {
    if (state.loading) return <LoaderStage />;

    if (state.error) return <Box p={22}>Failed to retrieve projects for your Google developer account</Box>;

    if (projects.length > 0)
      return (
        <StageProjectList
          projects={projectList}
          title="Select Project"
          footerSubmitText="Create New Project"
          onFooterSubmit={handleCreateNewProject}
          onProjectSelected={({ id }) => updateCurrentStage(id)}
        />
      );

    return (
      <StageEmpty
        description="No projects exist on the Actions Console to connect to. Create a new project now"
        footerSubmitText="Create New Project"
        onFooterClick={handleCreateNewProject}
      />
    );
  }, [state, projects]);

  return (
    <StageContainer noPadding width={254}>
      {stateContent}
    </StageContainer>
  );
};

export default WaitProjectStage;
