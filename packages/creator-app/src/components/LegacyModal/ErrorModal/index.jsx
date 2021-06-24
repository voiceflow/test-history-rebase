import { Alert, AlertVariant, Box, Button } from '@voiceflow/ui';
import React from 'react';

import { supportGraphic } from '@/assets';
import { clearModal } from '@/ducks/modal';
import { connect } from '@/hocs';

import { Modal, ModalBody, ModalFooter, ModalHeader } from '../components';

export const ErrorModal = ({ error, dismiss }) => {
  if (!error) {
    return null;
  }

  return (
    <Modal isOpen={!!error} centered modalWidth={350} modalname="error">
      <ModalHeader header="ERROR OCCURED" toggle={dismiss} />
      <ModalBody className="text-center">
        <img src={supportGraphic} alt="Support" height={80} />
        {error.message ? (
          <>
            <Box my={20}>{error.message}</Box>
            {error.violations
              ? error.violations.map((violation, i) => (
                  <Alert color="danger" key={i}>
                    {violation.message}
                  </Alert>
                ))
              : null}
          </>
        ) : (
          <Alert variant={AlertVariant.DANGER}>{typeof error === 'string' ? error : error.error}</Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="tertiary" onClick={dismiss}>
          Return
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  error: state.modal.errorModal,
});

const mapDispatchToProps = {
  dismiss: clearModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
