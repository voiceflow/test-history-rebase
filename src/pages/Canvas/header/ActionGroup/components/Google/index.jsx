/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import * as Account from '@/ducks/account';
import * as GooglePublish from '@/ducks/publish/google';
import { GOOGLE_STATES } from '@/ducks/publish/google';
import { connect } from '@/hocs';
import UploadGoogle from '@/pages/Publish/Upload/Google';

import UploadPopup from '../UploadPopup';
import Upload from './Upload';

const GoogleActionGroup = (props) => {
  const { googlePublish, google, checkGoogleAccount, resetGoogleUpload, updateGoogleStage } = props;
  const [open, setOpen] = useState(false);

  if (!google) updateGoogleStage(GOOGLE_STATES.GOOGLE_LOGIN);

  useEffect(() => {
    if (googlePublish.stage === GooglePublish.GOOGLE_STAGES.IDLE) {
      setOpen(false);
    } else if (GooglePublish.GOOGLE_STATES[googlePublish.stage].end) {
      setOpen(true);
    }
  }, [googlePublish.stage, googlePublish.id]);

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
      <Upload setPopup={setOpen} />
      {[GooglePublish.GOOGLE_STAGES.GOOGLE_LOGIN, GooglePublish.GOOGLE_STAGES.NO_DIALOGFLOW].includes(googlePublish.stage) ? (
        <Modal isOpen={open} contentClassName="overflow-hidden" toggle={close}>
          <ModalHeader toggle={close}>{GooglePublish.GOOGLE_STATES[googlePublish.stage].description}</ModalHeader>
          <UploadGoogle />
        </Modal>
      ) : (
        <UploadPopup open={open} onClose={close}>
          <UploadGoogle />
        </UploadPopup>
      )}
    </>
  );
};

const mapStatToProps = {
  googlePublish: GooglePublish.publishStateSelector,
  google: Account.googleAccountSelector,
};

const mapDispatchToProps = {
  resetGoogleUpload: GooglePublish.resetGoogleUpload,
  checkGoogleAccount: Account.checkGoogleAccount,
  updateGoogleStage: GooglePublish.updateGoogleStage,
};

export default connect(mapStatToProps, mapDispatchToProps)(GoogleActionGroup);
