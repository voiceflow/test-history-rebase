/* eslint-disable no-secrets/no-secrets */
import React from 'react';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import { FeatureFlag } from '@/config/features';
import { JobStatus } from '@/constants';
import * as Account from '@/ducks/account';
import { getGoogleAccountV2 } from '@/ducks/account/sideEffectsV2';
import * as PublishGoogleDuck from '@/ducks/publish/google';
import { activeProjectIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import UploadGoogle from '@/pages/Publish/Upload/Google';
import { PublishContext } from '@/pages/Skill/contexts';

import PublishGoogleForm from './Form';
import PublishGoogleFormV2 from './FormV2';

export function PublishGoogle(props) {
  const {
    publishStage,
    googleAccount,
    isLocked,
    projectID,
    checkGoogleAccount,
    resetGoogleUpload,
    publish,
    loadDialogflow,
    getGoogleAccountV2,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [close, setClose] = React.useState(false);

  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);
  const { job, publish: publishV2, cancel } = React.useContext(PublishContext);

  const onPublish = () => {
    setOpen(true);

    if (dataRefactor.isEnabled) {
      publishV2();
    } else {
      resetGoogleUpload();
      publish();
    }
  };

  React.useEffect(() => {
    if (dataRefactor.isEnabled && job && job.status === JobStatus.FINISHED) {
      setClose(true);
    } else if (!dataRefactor.isEnabled) {
      setClose(PublishGoogleDuck.GOOGLE_STATES[publishStage].end);
    }
  }, [publishStage, job?.status]);

  React.useEffect(() => {
    loadDialogflow();
  }, [projectID]);

  React.useEffect(() => {
    if (dataRefactor.isEnabled) {
      getGoogleAccountV2();

      return;
    }

    if (!googleAccount) {
      checkGoogleAccount();
    }

    // reset state on unmount
    return resetGoogleUpload;
  }, []);

  if (dataRefactor.isEnabled) {
    return <PublishGoogleFormV2 />;
  }

  return (
    <>
      <PublishGoogleForm isLocked={isLocked} publish={onPublish} />
      <Modal isOpen={open} onClosed={dataRefactor.isEnabled ? cancel : resetGoogleUpload} centered contentClassName="overflow-hidden">
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
  getGoogleAccountV2,
  publish: PublishGoogleDuck.publish,
  loadDialogflow: PublishGoogleDuck.loadDialogflow,
};

export default connect(mapStateToProps, mapDispatchToProps)(PublishGoogle);
