import {
  Animations,
  Box,
  Button,
  ButtonVariant,
  Input,
  Label,
  Modal,
  Portal,
  System,
  TippyTooltip,
  usePersistFunction,
  useSmartReducerV2,
} from '@voiceflow/ui';
import React from 'react';

import { JobStatus } from '@/constants';
import { DialogflowCXStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import * as Project from '@/ducks/projectV2';
import { useSelector } from '@/hooks';
import AgentSettings from '@/platforms/dialogflowCX/jobs/publish/components/AgentSettings';
import { StageComponentProps } from '@/platforms/types';

const WaitVersionName: React.FC<StageComponentProps<any>> = ({ start, setJob, cancel }) => {
  const [state, api] = useSmartReducerV2({
    settings: false,
    name: '',
  });

  const hasGoogleAccount = !!useSelector(Account.googleAccountSelector);
  const hasExistingAgent = !!useSelector(Project.active.platformDataSelector)?.agent;

  const onConfirm = usePersistFunction(() => {
    // ensure we get the current state of the store
    const startingOptions = { versionName: state.name };

    if (!hasGoogleAccount) {
      // set a "fake" job and get the user to login before continuing
      setJob({ id: 'login', stage: { type: DialogflowCXStageType.WAIT_ACCOUNT, data: {} }, status: JobStatus.FINISHED }, startingOptions);
      return;
    }

    start(startingOptions);
  });

  const toggleSettings = usePersistFunction(() => api.update({ settings: !state.settings }));
  const onClose = () => cancel();

  return (
    <>
      <Portal portalNode={document.body}>
        <Modal.Backdrop closing={false} onClick={onClose} />
      </Portal>

      <Modal type="WaitVersionName" opened hidden={false} maxWidth={400} onExited={onClose}>
        {!state.settings ? (
          <>
            <Modal.Header
              capitalizeText={false}
              actions={
                hasExistingAgent && (
                  <System.IconButtonsGroup.Base>
                    <TippyTooltip content="Settings" position="top">
                      <System.IconButton.Base icon="systemSettings" onClick={toggleSettings} />
                    </TippyTooltip>
                  </System.IconButtonsGroup.Base>
                )
              }
            >
              Upload to Dialogflow CX
            </Modal.Header>
            <Modal.Body>
              This action will upload a new version to Dialogflow CX. Confirm you want to continue.
              <Box mt={16}>
                <Input value={state.name} onChangeText={(name) => api.update({ name })} placeholder="Enter versions name (optional)" />
              </Box>
            </Modal.Body>
          </>
        ) : (
          <Animations.FadeLeftContainer distance={10}>
            <Modal.Header border>
              <System.IconButtonsGroup.Base mr={12}>
                <System.IconButton.Base icon="largeArrowLeft" onClick={toggleSettings} />
              </System.IconButtonsGroup.Base>

              <Box ml={22}>Upload Settings</Box>
            </Modal.Header>

            <Modal.Body mt={20}>
              <Label>Agent URL</Label>
              <Box mt={12}>
                <AgentSettings waitOnAgent={false} />
              </Box>
            </Modal.Body>
          </Animations.FadeLeftContainer>
        )}

        <Modal.Footer gap={8}>
          <Button variant={ButtonVariant.TERTIARY} onClick={onClose} squareRadius>
            Cancel
          </Button>
          <Button variant={ButtonVariant.PRIMARY} onClick={onConfirm}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WaitVersionName;
