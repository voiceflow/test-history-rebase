/* eslint-disable no-secrets/no-secrets */
import React from 'react';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import * as Account from '@/ducks/account';
import * as PublishGoogleDuck from '@/ducks/publish/google';
import { activeProjectIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import UploadGoogle from '@/pages/Publish/Upload/Google';

import PublishGoogleForm from './Form';

export function PublishGoogle(props) {
  const { publishStage, googleAccount, isLocked, projectID, checkGoogleAccount, resetGoogleUpload, publish, loadDialogflow } = props;
  const [open, setOpen] = React.useState(false);
  const [close, setClose] = React.useState(false);

  const onPublish = () => {
    setOpen(true);
    resetGoogleUpload();
    publish();
  };

  React.useEffect(() => setClose(PublishGoogleDuck.GOOGLE_STATES[publishStage].end), [publishStage]);

  React.useEffect(() => {
    loadDialogflow();
  }, [projectID]);

  React.useEffect(() => {
    if (!googleAccount) {
      (async () => {
        await checkGoogleAccount();
      })();
    }
    // reset state on unmount
    return resetGoogleUpload;
  }, []);

  return (
    <>
      <PublishGoogleForm isLocked={isLocked} publish={onPublish} />
      <Modal isOpen={open} centered contentClassName="overflow-hidden">
        {close && <ModalHeader toggle={() => setOpen(false)} header={PublishGoogleDuck.GOOGLE_STATES[publishStage]?.description} />}
        <UploadGoogle />
      </Modal>
    </>
  );
}

const mapStateToProps = {
  publishStage: PublishGoogleDuck.publishStageSelector,
  googleAccount: Account.googleAccountSelector,
  projectID: activeProjectIDSelector,
};

const mapDispatchToProps = {
  resetGoogleUpload: PublishGoogleDuck.resetGoogleUpload,
  checkGoogleAccount: Account.checkGoogleAccount,
  publish: PublishGoogleDuck.publish,
  loadDialogflow: PublishGoogleDuck.loadDialogflow,
};

export default connect(mapStateToProps, mapDispatchToProps)(PublishGoogle);
