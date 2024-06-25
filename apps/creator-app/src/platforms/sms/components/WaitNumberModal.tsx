import type { ProjectSecretTag } from '@voiceflow/schema-types';
import { Box, Button, ButtonVariant, Modal, Portal, ThemeColor, toast, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import PhoneInput, { isValidPhoneNumber } from '@/components/PhoneInput';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

interface WaitNumberModalProps {
  tag: ProjectSecretTag;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
  description: string;
}

interface WaitNumberState {
  phoneNumber: string;
  opened: boolean;
  valid: boolean;
}

export const WaitNumberModal: React.FC<WaitNumberModalProps> = ({ tag, description, onClose, onSuccess }) => {
  const [state, api] = useSmartReducerV2<WaitNumberState>({
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
      await client.apiV3.projectSecret.create(projectID, tag, state.phoneNumber, state.phoneNumber);
      onSuccess();
    } catch {
      toast.error('Unable to save phone number.');
    }
  };

  return (
    <>
      <Portal portalNode={document.body}>
        <Modal.Backdrop closing={!state.opened} onClick={onClose} />
      </Portal>

      <Modal type="WaitNumberStage" opened={state.opened} hidden={false} onExited={onClose} maxWidth={400}>
        <Modal.Header capitalizeText={false} actions={<Modal.Header.CloseButtonAction onClick={onClose} />}>
          Test on Your Phone
        </Modal.Header>

        <Modal.Body>
          <PhoneInput
            defaultCountry="US"
            placeholder="Enter number"
            value={state.phoneNumber}
            onChange={updatePhoneNumber}
          />
          <Box fontSize={13} color={ThemeColor.SECONDARY} mt={12}>
            {description}
          </Box>
        </Modal.Body>

        <Modal.Footer gap={8}>
          <Button variant={ButtonVariant.TERTIARY} onClick={onClose} squareRadius>
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
