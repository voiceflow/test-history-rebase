import { Box, Button, ButtonVariant, Input, isNetworkError, useOnClickOutside, usePersistFunction, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { LoaderStage, StageContainer, StageEmpty, StageProjectList } from '@/components/PlatformUploadPopup/components';
import { Project } from '@/components/PlatformUploadPopup/types';
import * as Account from '@/ducks/account';
import * as Version from '@/ducks/version';
import { useAsyncMountUnmount, useDispatch } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { DialogflowESPublishJob, UploadProject } from '@/models';
import { StageComponentProps } from '@/platforms/types';

import CreateNewAgentModal from './CreateNewAgentModal';

const WaitDFESProjectStage: React.FC<StageComponentProps<DialogflowESPublishJob.WaitProjectStage>> = ({ updateCurrentStage, retry, cancel }) => {
  const [projects, setProjects] = React.useState<UploadProject.Dialogflow[]>([]);
  const [dialogflowProjectID, setDialogflowProjectID] = React.useState('');
  const projectList = projects.map((project) => ({ id: project.googleProjectID, name: project.agentName }));
  const containerRef = React.useRef<HTMLDivElement>(null);

  const loadGoogleAccount = useDispatch(Account.google.loadAccount);
  const updateInvocationName = useDispatch(Version.updateInvocationName);

  const [state, api] = useSmartReducerV2({ error: false, loading: true });

  const handleProjectSelected = async (selectedProject: Project) => {
    await updateInvocationName(selectedProject.name);

    updateCurrentStage({ googleProjectID: selectedProject.id, agentName: selectedProject.name });
  };

  const createNewAgentModal = ModalsV2.useModal(CreateNewAgentModal);

  const createNewAgent = usePersistFunction(() => {
    createNewAgentModal
      .open()
      .then(() => updateCurrentStage(null))
      .catch(() => cancel());
  });

  // we have a modal so can't use dismissable popup property, needs to be custom
  useOnClickOutside(containerRef, () => !createNewAgentModal.opened && cancel(), []);

  useAsyncMountUnmount(
    async () => {
      try {
        const projectIDs = await client.platform.dialogflowES.project.getDialogFlowESProjects();

        api.update({ error: false, loading: false });

        setProjects(projectIDs);
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
    },
    () => {
      createNewAgentModal.close();
    }
  );

  const stateContent = React.useMemo(() => {
    if (state.loading) return <LoaderStage />;

    if (state.error)
      return (
        <Box p={22}>
          Failed to retrieve projects for Google developer account
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
        </Box>
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

  return (
    <StageContainer noPadding width={254} ref={containerRef}>
      {stateContent}
    </StageContainer>
  );
};

export default WaitDFESProjectStage;
