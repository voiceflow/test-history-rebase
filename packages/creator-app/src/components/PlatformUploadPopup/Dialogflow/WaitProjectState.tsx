import { useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { useAsyncMountUnmount, useTeardown } from '@/hooks';
import { UploadProject } from '@/models';

import { LoaderStage, StageAlert, StageContainer, StageEmpty, StageProjectList } from '../components';
import { Project } from '../constants';

interface WaitDFESProjectStageProps {
  cancel: () => void;
  onClose?: () => void;
  setMultiProjects?: (value: boolean) => void;
  createNewAgent: () => void;
  updateCurrentStage: (selected: UploadProject.Dialogflow | null) => void;
}

const WaitDFESProjectStage: React.FC<WaitDFESProjectStageProps> = ({ updateCurrentStage, setMultiProjects, createNewAgent }) => {
  const [projects, setProjects] = React.useState<UploadProject.Dialogflow[]>([]);
  const projectList = projects.map((project) => ({ id: project.googleProjectID, name: project.agentName }));

  const [state, api] = useSmartReducerV2({ error: false, loading: true });

  const handleProjectSelected = (selectedProject: Project) =>
    updateCurrentStage({ googleProjectID: selectedProject.id, agentName: selectedProject.name });

  useAsyncMountUnmount(async () => {
    try {
      const projectIDs = await client.platform.dialogflow.project.getDialogFlowESProjects();

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
          title="Connect to Agent"
          footerSubmitText="Create New Agent"
          onFooterSubmit={createNewAgent}
          onProjectSelected={handleProjectSelected}
        />
      );

    return (
      <StageEmpty
        description="No agents exist on the Dialogflow ES Console to connect to. Create a new agent now"
        footerSubmitText="Create New Agent"
        onFooterClick={createNewAgent}
      />
    );
  }, [state, projects]);

  return <StageContainer noPadding>{stateContent}</StageContainer>;
};

export default WaitDFESProjectStage;
