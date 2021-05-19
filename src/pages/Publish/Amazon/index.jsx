/* eslint-disable no-secrets/no-secrets */
import React, { useEffect, useState } from 'react';

import Modal, { ModalHeader } from '@/components/LegacyModal';
import { JobStatus } from '@/constants';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { Alexa } from '@/pages/Publish/Upload';
import { PublishContext } from '@/pages/Skill/contexts';

import PublishAmazonForm from './Form';

export const PublishAmazon = (props) => {
  const { isLocked, syncSelectedVendor } = props;
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const { job, publish, cancel } = React.useContext(PublishContext);

  const onPublish = () => {
    setOpen(true);
    publish(true);
  };

  useEffect(() => {
    if (job && job.status === JobStatus.FINISHED) {
      setClose(true);
    }
  }, [job?.status]);

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

const mapDispatchToProps = {
  syncSelectedVendor: Account.amazon.syncSelectedVendor,
};

export default connect(null, mapDispatchToProps)(PublishAmazon);
