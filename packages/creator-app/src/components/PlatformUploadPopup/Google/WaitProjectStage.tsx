import { useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { FeatureFlag } from '@/config/features';
import { useAsyncMountUnmount, useFeature, useTeardown } from '@/hooks';

import { LoaderStage, StageAlert, StageContainer, StageEmpty, StageProjectList } from '../components';

interface WaitProjectStageProps {
  cancel: () => void;
  onClose?: () => void;
  setMultiProjects?: (value: boolean) => void;
  updateCurrentStage: (googleProjectID: string | null) => void;
}

const GOOGLE_CONSOLE_URL = 'https://console.actions.google.com/';

const WaitProjectStage: React.FC<WaitProjectStageProps> = ({ cancel, updateCurrentStage, setMultiProjects }) => {
  const [projects, setProjects] = React.useState<{ id: string; name?: string }[]>([]);
  const isGoogleCreate = useFeature(FeatureFlag.GOOGLE_CREATE)?.isEnabled;
  const projectList = React.useMemo(() => projects.map(({ id, name = '' }) => ({ id, name })), [projects]);

  const [state, api] = useSmartReducerV2({ error: false, loading: true });

  const handleCreateNewProject = () => {
    if (isGoogleCreate) {
      updateCurrentStage(null);
      return;
    }
    window.open(GOOGLE_CONSOLE_URL, '_blank');
    cancel();
  };

  useAsyncMountUnmount(async () => {
    try {
      const projectIDs = await client.platform.google.project.getGoogleProjects();

      api.update({ error: false, loading: false });

      setProjects(projectIDs);
      setMultiProjects?.(projectIDs.length > 0);
    } catch {
      api.update({ error: true, loading: false });
    }
  });

  useTeardown(() => setMultiProjects?.(false));

  const stateContent = React.useMemo(() => {
    if (state.loading) return <LoaderStage />;

    if (state.error) return <StageAlert>Failed to retrieve projects for your Google developer account</StageAlert>;

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

  return <StageContainer noPadding>{stateContent}</StageContainer>;
};

export default WaitProjectStage;
