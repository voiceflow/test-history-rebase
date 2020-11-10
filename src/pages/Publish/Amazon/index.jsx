/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import { JobStatus } from '@/constants';
import * as Account from '@/ducks/account';
import * as AlexaPublish from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import { Alexa } from '@/pages/Publish/UploadV2';
import { PublishContext } from '@/pages/Skill/contexts';

import PublishAmazonForm from './Form';

export const PublishAmazon = (props) => {
  const { stage, isLocked, syncSelectedVendor } = props;
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const { job, publish: publishV2, cancel } = React.useContext(PublishContext);

  const onPublish = () => {
    setOpen(true);
    publishV2(true);
  };

  useEffect(() => {
    if (job && job.status === JobStatus.FINISHED) {
      setClose(true);
    }
  }, [stage, job?.status]);

  useEffect(() => {
    syncSelectedVendor();
  }, []);

  return (
    <>
      <PublishAmazonForm isLocked={isLocked} publish={onPublish} />
      <Modal isOpen={open} onClosed={cancel} centered contentClassName="overflow-hidden">
        {close && <ModalHeader toggle={() => setOpen(false)} />}
        <Alexa />
      </Modal>
    </>
  );
};

const mapStateToProps = {
  stage: AlexaPublish.publishStageSelector,
};

const mapDispatchToProps = {
  syncSelectedVendor: Account.syncSelectedVendor,
  syncVendors: AlexaPublish.syncVendors,
};

export default connect(mapStateToProps, mapDispatchToProps)(PublishAmazon);
