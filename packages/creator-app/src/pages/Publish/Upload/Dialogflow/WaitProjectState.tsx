import { useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { useAsyncMountUnmount, useTeardown } from '@/hooks';
import { UploadProject } from '@/models';

import { StageContainer } from '../components';
import ProjectStateAgentList from './components/ProjectState/AgentList';
import ProjectStateEmpty from './components/ProjectState/Empty';
import ProjectStateError from './components/ProjectState/Error';
import ProjectStateLoading from './components/ProjectState/Loading';

interface WaitDFESProjectStageProps {
  cancel: () => void;
  onClose?: () => void;
  setMultiProjects?: (value: boolean) => void;
  updateCurrentStage: (selected: UploadProject.Dialogflow | null) => void;
}

const WaitDFESProjectStage: React.FC<WaitDFESProjectStageProps> = ({ updateCurrentStage, setMultiProjects }) => {
  const [projects, setProjects] = React.useState<UploadProject.Dialogflow[]>([]);

  const [state, api] = useSmartReducerV2({ error: false, loading: true });

  const handleCreateNewAgent = () => updateCurrentStage(null);

  const handleProjectSelected = (selectedProject: UploadProject.Dialogflow) => updateCurrentStage(selectedProject);

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
    if (state.loading) return <ProjectStateLoading />;

    if (state.error) return <ProjectStateError />;

    if (projects.length > 0)
      return <ProjectStateAgentList projects={projects} onCreateNewAgent={handleCreateNewAgent} onProjectSelected={handleProjectSelected} />;

    return <ProjectStateEmpty onCreateNewAgent={handleCreateNewAgent} />;
  }, [state, projects]);

  return <StageContainer noPadding>{stateContent}</StageContainer>;
};

export default WaitDFESProjectStage;
