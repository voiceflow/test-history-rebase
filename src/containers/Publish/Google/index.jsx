/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';

import Modal, { ModalHeader } from '@/components/Modal';
import UploadGoogle from '@/containers/Publish/Upload/Google';
import { checkGoogleAccount } from '@/ducks/account';
import { GOOGLE_STATES, loadDialogflow, publish, resetGoogleUpload } from '@/ducks/publish/google';
import { activeProjectIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

import PublishGoogleForm from './Form';

export function PublishGoogle(props) {
  const { stage, google, projectID, checkGoogleAccount, resetGoogleUpload, publish, loadDialogflow } = props;
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);

  const onPublish = () => {
    setOpen(true);
    resetGoogleUpload();
    publish();
  };

  useEffect(() => setClose(GOOGLE_STATES[stage].end), [stage]);

  useEffect(() => {
    loadDialogflow();
  }, [projectID]);
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
      <Modal isOpen={open} centered contentClassName="overflow-hidden">
        {close && <ModalHeader toggle={() => setOpen(false)} header={GOOGLE_STATES[stage]?.description} />}
        <UploadGoogle />
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => ({
  stage: state.publish.google.stage,
  google: state.account.google,
  projectID: activeProjectIDSelector(state),
});

const mapDispatchToProps = {
  resetGoogleUpload,
  checkGoogleAccount,
  publish,
  loadDialogflow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishGoogle);
