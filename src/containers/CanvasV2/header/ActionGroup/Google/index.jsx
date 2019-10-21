/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Close from '@/components/Close';
import Modal, { ModalHeader } from '@/components/Modal';
import UploadGoogle from '@/containers/Publish/Upload/Google';
import { checkGoogleAccount } from '@/ducks/account';
import { GOOGLE_STAGES, GOOGLE_STATES, resetGoogleUpload } from '@/ducks/publish/google';

import { PopupContainer, PopupTransition } from '../styled';
import UploadButton from './UploadButton';

const GoogleActionGroup = (props) => {
  const { stage, id, google, checkGoogleAccount, resetGoogleUpload } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (stage === GOOGLE_STAGES.IDLE) setOpen(false);
    else if (GOOGLE_STATES[stage].end) setOpen(true);
  }, [stage, id]);

  useEffect(() => {
    if (!google) {
      (async () => {
        await checkGoogleAccount();
      })();
    }
    // reset state on unmount
    return resetGoogleUpload;
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <UploadButton setPopup={setOpen} />
      {[GOOGLE_STAGES.GOOGLE_LOGIN, GOOGLE_STAGES.NO_DIALOGFLOW].includes(stage) ? (
        <Modal isOpen={open} contentClassName="overflow-hidden" toggle={close}>
          <ModalHeader toggle={close}>{GOOGLE_STATES[stage].description}</ModalHeader>
          <UploadGoogle />
        </Modal>
      ) : (
        <PopupContainer open={open}>
          <Close onClick={close} />
          <PopupTransition>
            <UploadGoogle />
          </PopupTransition>
        </PopupContainer>
      )}
    </>
  );
};

export default connect(
  (state) => ({
    stage: state.publish.google.stage,
    id: state.publish.google.id,
    google: state.account.google,
  }),
  {
    resetGoogleUpload,
    checkGoogleAccount,
  }
)(GoogleActionGroup);
