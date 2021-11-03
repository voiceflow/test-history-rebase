import { useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { useAsyncMountUnmount, useTeardown } from '@/hooks';
import { UploadProject } from '@/models';

import { LoaderStage, StageAlert, StageContainer, StageProjectList } from '../components';
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

      setProjects(projectIDs);
      setMultiProjects?.(projectIDs.length > 0);
      api.update({ error: false, loading: false });
    } catch {
      api.update({ error: true, loading: false });
    }
  });

  useTeardown(() => setMultiProjects?.(false));

  const stateContent = React.useMemo(() => {
    if (state.loading) return <LoaderStage />;

    if (state.error) return <StageAlert>Failed to retrieve projects for your Google developer account</StageAlert>;

    if (projects.length > 0) {
      return (
        <StageProjectList
          projects={projectList}
          title="Connect to Agent"
          footerSubmitText="Create New Agent"
          onFooterSubmit={createNewAgent}
          onProjectSelected={handleProjectSelected}
        />
      );
    }

    return null;
  }, [state, projects]);

  const hasNoAgents = !stateContent;
  React.useEffect(() => {
    if (hasNoAgents) {
      createNewAgent();
    }
  }, [hasNoAgents]);

  return stateContent ? <StageContainer noPadding>{stateContent}</StageContainer> : null;
};

export default WaitDFESProjectStage;
