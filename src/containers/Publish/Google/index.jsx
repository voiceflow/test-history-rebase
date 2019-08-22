/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';

import UploadGoogle from '@/containers/Publish/Upload/Google';
import { checkGoogleAccount } from '@/ducks/account';
import { GOOGLE_STATES, publish, resetGoogleUpload } from '@/ducks/publish/google';

import PublishGoogleForm from './Form';

export function PublishGoogle(props) {
  const { stage, google, checkGoogleAccount, resetGoogleUpload, publish } = props;
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);

  const onPublish = () => {
    setOpen(true);
    publish();
  };

  useEffect(() => {
    if (GOOGLE_STATES[stage].end) setClose(true);
    else setClose(false);
  }, [stage]);

  useEffect(() => {
    if (!google) {
      (async () => {
        await checkGoogleAccount();
      })();
    }
    // reset state on unmount
    return resetGoogleUpload;
  }, []);

  return (
    <>
      <PublishGoogleForm publish={onPublish} />
      <Modal isOpen={open} onClosed={resetGoogleUpload} centered contentClassName="overflow-hidden">
        {close && <button className="close close-upload-success-popup" onClick={() => setOpen(false)} />}
        <UploadGoogle />
      </Modal>
    </>
  );
}

export default connect(
  (state) => ({
    stage: state.publish.google.stage,
    google: state.account.google,
  }),
  {
    resetGoogleUpload,
    checkGoogleAccount,
    publish,
  }
)(PublishGoogle);
