/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';

import UploadGoogle from '@/containers/Publish/Upload/Google';
import { checkGoogleAccount } from '@/ducks/account';
import { GOOGLE_STATES, loadDialogflow, publish, resetGoogleUpload } from '@/ducks/publish/google';

import PublishGoogleForm from './Form';

export function PublishGoogle(props) {
  const { stage, google, project_id, checkGoogleAccount, resetGoogleUpload, publish, loadDialogflow } = props;
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
  }, [project_id]);
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
        {close && <button className="close close-upload-success-popup" onClick={() => setOpen(false)} />}
        <UploadGoogle />
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => ({
  stage: state.publish.google.stage,
  google: state.account.google,
  project_id: state.skills.skill.project_id,
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
