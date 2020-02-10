/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import { checkAmazonAccount, getVendors } from '@/ducks/account';
import { ALEXA_STATES, publish, resetAlexaUpload } from '@/ducks/publish/alexa';
import UploadAlexa from '@/pages/Publish/Upload/Alexa';

import PublishAmazonForm from './Form';

export function PublishAmazon(props) {
  const { stage, amazon, isLocked, checkAmazonAccount, getVendors, resetAlexaUpload, publish } = props;
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);

  const onPublish = () => {
    setOpen(true);
    publish({ submit: true });
  };

  useEffect(() => setClose(ALEXA_STATES[stage].end), [stage]);

  useEffect(() => {
    if (!amazon) {
      (async () => {
        await checkAmazonAccount();
        await getVendors();
      })();
    }
    // reset state on unmount
    return resetAlexaUpload;
  }, []);

  return (
    <>
      <PublishAmazonForm isLocked={isLocked} publish={onPublish} />
      <Modal isOpen={open} onClosed={resetAlexaUpload} centered contentClassName="overflow-hidden">
        {close && <ModalHeader toggle={() => setOpen(false)} header={ALEXA_STATES[stage]?.description} />}
        <UploadAlexa />
      </Modal>
    </>
  );
}

export default connect(
  (state) => ({
    stage: state.publish.alexa.stage,
    amazon: state.account.amazon,
  }),
  {
    resetAlexaUpload,
    checkAmazonAccount,
    getVendors,
    publish,
  }
)(PublishAmazon);
