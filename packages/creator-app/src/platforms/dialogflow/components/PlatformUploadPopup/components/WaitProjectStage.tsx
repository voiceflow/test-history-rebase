import { Box, Button, ButtonVariant, Input, isNetworkError, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { LoaderStage, StageAlert, StageContainer, StageEmpty, StageProjectList } from '@/components/PlatformUploadPopup/components';
import { Project } from '@/components/PlatformUploadPopup/constants';
import * as Account from '@/ducks/account';
import * as Version from '@/ducks/version';
import { useAsyncMountUnmount, useDispatch, useTeardown } from '@/hooks';
import { UploadProject } from '@/models';

interface WaitDFESProjectStageProps {
  cancel: VoidFunction;
  setMultiProjects?: (value: boolean) => void;
  createNewAgent: VoidFunction;
  retry: (reset: () => Promise<void>) => Promise<void>;
  updateCurrentStage: (selected: UploadProject.Dialogflow | null) => void;
}

const WaitDFESProjectStage: React.FC<WaitDFESProjectStageProps> = ({ updateCurrentStage, setMultiProjects, createNewAgent, retry }) => {
  const [projects, setProjects] = React.useState<UploadProject.Dialogflow[]>([]);
  const [dialogflowProjectID, setDialogflowProjectID] = React.useState('');
  const projectList = projects.map((project) => ({ id: project.googleProjectID, name: project.agentName }));

  const loadGoogleAccount = useDispatch(Account.google.loadAccount);
  const updateAgentName = useDispatch(Version.dialogflow.updateAgentName);

  const [state, api] = useSmartReducerV2({ error: false, loading: true });

  const handleProjectSelected = async (selectedProject: Project) => {
    await updateAgentName(selectedProject.name);

    updateCurrentStage({ googleProjectID: selectedProject.id, agentName: selectedProject.name });
  };

  useAsyncMountUnmount(async () => {
    try {
      const projectIDs = await client.platform.dialogflow.project.getDialogFlowESProjects();

      api.update({ error: false, loading: false });

      setProjects(projectIDs);
      setMultiProjects?.(projectIDs.length > 0);
      api.update({ error: false, loading: false });
    } catch (err) {
      if (isNetworkError(err) && err.statusCode === 403) {
        await retry(async () => {
          await client.platform.google.session.unlinkAccount();
          await loadGoogleAccount();
        });
      } else {
        api.update({ error: true, loading: false });
      }
    }
  });

  useTeardown(() => setMultiProjects?.(false));

  const stateContent = React.useMemo(() => {
    if (state.loading) return <LoaderStage />;

    if (state.error)
      return (
        <StageAlert>
          Failed to retrieve projects for your Google developer account
          <hr />
          <Box.FlexCenter mt={16} flexDirection="column">
            <b>Manually Enter Google Cloud Project ID</b>
            <Box my={12}>
              <Input value={dialogflowProjectID} onChange={(e) => setDialogflowProjectID(e.target.value)} placeholder="Project ID" />
            </Box>
            <Button onClick={() => handleProjectSelected({ id: dialogflowProjectID, name: 'test' })} variant={ButtonVariant.TERTIARY}>
              Submit
            </Button>
          </Box.FlexCenter>
        </StageAlert>
      );

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
  }, [state, projects, dialogflowProjectID]);

  return <StageContainer noPadding>{stateContent}</StageContainer>;
};

export default WaitDFESProjectStage;
