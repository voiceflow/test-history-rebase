/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import { FeatureFlag } from '@/config/features';
import { JobStatus } from '@/constants';
import * as Account from '@/ducks/account';
import { syncSelectedVendor } from '@/ducks/account/sideEffectsV2';
import * as AlexaPublish from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import UploadAlexa from '@/pages/Publish/Upload/Alexa';
import { Alexa } from '@/pages/Publish/UploadV2';
import { PublishContext } from '@/pages/Skill/contexts';

import PublishAmazonForm from './Form';

export function PublishAmazon(props) {
  const { stage, amazon, isLocked, checkAmazonAccount, syncVendors, resetAlexaUpload, publish, syncSelectedVendor } = props;
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const { job, publish: publishV2, cancel } = React.useContext(PublishContext);

  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  const onPublish = () => {
    setOpen(true);
    dataRefactor.isEnabled ? publishV2(true) : publish({ submit: true });
  };

  useEffect(() => {
    if (dataRefactor.isEnabled && job && job.status === JobStatus.FINISHED) {
      setClose(true);
    } else if (!dataRefactor.isEnabled) {
      setClose(AlexaPublish.ALEXA_STATES[stage].end);
    }
  }, [stage, job?.status]);

  useEffect(() => {
    if (!dataRefactor.isEnabled && !amazon) {
      (async () => {
        await checkAmazonAccount();
        await syncVendors();
      })();
    }

    // reset state on unmount
    return resetAlexaUpload;
  }, [amazon]);

  useEffect(() => {
    if (dataRefactor.isEnabled) {
      syncSelectedVendor();
    }
  }, []);

  return (
    <>
      <PublishAmazonForm isLocked={isLocked} publish={onPublish} dataRefactorEnabled={!!dataRefactor.isEnabled} />
      <Modal isOpen={open} onClosed={dataRefactor.isEnabled ? cancel : resetAlexaUpload} centered contentClassName="overflow-hidden">
        {close && <ModalHeader toggle={() => setOpen(false)} />}
        {dataRefactor.isEnabled ? <Alexa /> : <UploadAlexa />}
      </Modal>
    </>
  );
}

const mapStateToProps = {
  stage: AlexaPublish.publishStageSelector,
  amazon: Account.amazonAccountSelector,
};

const mapDispatchToProps = {
  resetAlexaUpload: AlexaPublish.resetAlexaUpload,
  checkAmazonAccount: Account.checkAmazonAccount,
  syncSelectedVendor,
  syncVendors: AlexaPublish.syncVendors,
  publish: AlexaPublish.publish,
};

export default connect(mapStateToProps, mapDispatchToProps)(PublishAmazon);
