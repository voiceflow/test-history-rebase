import { ProjectSecretTag } from '@voiceflow/schema-types';
import { Box, Button, ButtonVariant, Modal, Portal, ThemeColor, toast, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import PhoneInput, { isValidPhoneNumber } from '@/components/PhoneInput';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { TwilioPrototypeJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

interface WaitAgentState {
  phoneNumber: string;
  opened: boolean;
  valid: boolean;
}

const WaitNumberStage: React.FC<StageComponentProps<TwilioPrototypeJob.WaitNumberStage>> = ({ restart, cancel }) => {
  const [state, api] = useSmartReducerV2<WaitAgentState>({
    phoneNumber: '',
    opened: true,
    valid: false,
  });

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const updatePhoneNumber = (phoneNumber = '') => {
    api.update({ phoneNumber, valid: isValidPhoneNumber(phoneNumber) });
  };

  const savePhoneNumber = async () => {
    if (!isValidPhoneNumber(state.phoneNumber)) return;

    // disable button during save
    api.update({ valid: false });

    try {
      await client.apiV3.projectSecret.create(projectID, ProjectSecretTag.WHATSAPP_PHONE_NUMBER, state.phoneNumber, state.phoneNumber);
      restart();
    } catch {
      toast.error('Unable to save phone number.');
    }
  };

  return (
    <>
      <Portal portalNode={document.body}>
        <Modal.Backdrop closing={!state.opened} onClick={cancel} />
      </Portal>

      <Modal type="WaitNumberStage" opened={state.opened} hidden={false} onExited={cancel} maxWidth={400}>
        <Modal.Header capitalizeText={false} actions={<Modal.Header.CloseButton onClick={cancel} />}>
          Test on Your Phone
        </Modal.Header>

        <Modal.Body>
          <PhoneInput defaultCountry="US" placeholder="Enter WhatsApp number" value={state.phoneNumber} onChange={updatePhoneNumber} />
          <Box fontSize={13} color={ThemeColor.SECONDARY} mt={12}>
            You need to have access to the WhatsApp account of the number provided to test from your phone.
          </Box>
        </Modal.Body>

        <Modal.Footer gap={8}>
          <Button variant={ButtonVariant.TERTIARY} onClick={cancel} squareRadius>
            Cancel
          </Button>

          <Button variant={ButtonVariant.PRIMARY} onClick={savePhoneNumber} disabled={!state.valid}>
            Add Number & Test
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WaitNumberStage;
