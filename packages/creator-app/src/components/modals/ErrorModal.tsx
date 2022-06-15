import { Alert, Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { supportGraphic } from '@/assets';
import { ModalBody, ModalFooter, UncontrolledModal } from '@/components/Modal';
import * as ModalDuck from '@/ducks/modal';
import { useDispatch, useSelector } from '@/hooks';

import { UncontrolledBackdrop } from './ModalBackdrop';

const ErrorModal: React.FC = () => {
  const error = useSelector((state) => state.modal.errorModal);
  const closeModal = useDispatch(ModalDuck.clearModal);

  if (!error) {
    return null;
  }

  return (
    <>
      <UncontrolledBackdrop onClose={closeModal} />

      <UncontrolledModal id="error" title="ERROR OCCURED" isOpened centered maxWidth={350} onClose={closeModal}>
        <ModalBody padding="16px !important" textAlign="center">
          <img src={supportGraphic} alt="Support" height={80} />

          {error.message ? (
            <>
              <Box my={20}>{error.message}</Box>

              {error.violations?.map((violation, i) => (
                <Alert key={i} variant={Alert.Variant.DANGER}>
                  {violation.message}
                </Alert>
              ))}
            </>
          ) : (
            <Alert variant={Alert.Variant.DANGER}>{typeof error === 'string' ? error : error.error}</Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant={ButtonVariant.TERTIARY} onClick={closeModal}>
            Return
          </Button>
        </ModalFooter>
      </UncontrolledModal>
    </>
  );
};

export default ErrorModal;
