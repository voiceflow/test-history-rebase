/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import * as Account from '@/ducks/account';
import * as AlexaPublish from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import UploadAlexa from '@/pages/Publish/Upload/Alexa';

import PublishAmazonForm from './Form';

export function PublishAmazon(props) {
  const { stage, amazon, isLocked, checkAmazonAccount, syncVendors, resetAlexaUpload, publish } = props;
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const onPublish = () => {
    setOpen(true);
    publish({ submit: true });
  };

  useEffect(() => setClose(AlexaPublish.ALEXA_STATES[stage].end), [stage]);

  useEffect(() => {
    if (!amazon) {
      (async () => {
        await checkAmazonAccount();
        await syncVendors();
      })();
    }
    // reset state on unmount
    return resetAlexaUpload;
  }, [amazon]);

  return (
    <>
      <PublishAmazonForm isLocked={isLocked} publish={onPublish} />
      <Modal isOpen={open} onClosed={resetAlexaUpload} centered contentClassName="overflow-hidden">
        {close && <ModalHeader toggle={() => setOpen(false)} header={AlexaPublish.ALEXA_STATES[stage]?.description} />}
        <UploadAlexa />
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
  syncVendors: AlexaPublish.syncVendors,
  publish: AlexaPublish.publish,
};

export default connect(mapStateToProps, mapDispatchToProps)(PublishAmazon);
