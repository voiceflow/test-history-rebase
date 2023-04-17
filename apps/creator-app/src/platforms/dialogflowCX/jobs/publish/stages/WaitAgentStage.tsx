import { Box, Button, ButtonVariant, Link, Modal, Portal, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import { DIALOGFLOW_CX_CONSOLE } from '@/constants/platforms/dialogflowCX';
import { DialogflowCXPublishJob } from '@/models';
import AgentSettings from '@/platforms/dialogflowCX/jobs/publish/components/AgentSettings';
import URLExample from '@/platforms/dialogflowCX/jobs/publish/components/URLExample';
import { StageComponentProps } from '@/platforms/types';

interface WaitAgentState {
  opened: boolean;
  valid: boolean;
}

const WaitAgentStage: React.FC<StageComponentProps<DialogflowCXPublishJob.WaitAgentStage>> = ({ restart, cancel }) => {
  const [state, api] = useSmartReducerV2<WaitAgentState>({
    opened: true,
    valid: false,
  });

  const onClose = () => cancel();

  return (
    <>
      <Portal portalNode={document.body}>
        <Modal.Backdrop closing={!state.opened} onClick={onClose} />
      </Portal>

      <Modal type="WaitAgentStage" opened={state.opened} hidden={false} onExited={onClose} maxWidth={400}>
        <Modal.Header capitalizeText={false} actions={<Modal.Header.CloseButtonAction onClick={onClose} />}>
          Connect to Agent
        </Modal.Header>

        <Modal.Body>
          From your <Link href={DIALOGFLOW_CX_CONSOLE}>Dialogflow CX console</Link>, copy and paste the full agent URL that you want to connect to
          this assistant. {URLExample}
          <Box mt={16}>
            <AgentSettings onValid={(valid) => api.update({ valid })} />
          </Box>
        </Modal.Body>

        <Modal.Footer gap={8}>
          <Button variant={ButtonVariant.TERTIARY} onClick={onClose} squareRadius>
            Cancel
          </Button>

          <Button variant={ButtonVariant.PRIMARY} onClick={() => restart()} disabled={!state.valid}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WaitAgentStage;
