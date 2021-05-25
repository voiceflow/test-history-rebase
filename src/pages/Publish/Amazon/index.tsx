import React from 'react';

import Box from '@/components/Box';
import Modal, { ModalHeader } from '@/components/LegacyModal';
import { JobStatus } from '@/constants';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { Alexa } from '@/pages/Publish/Upload';
import { PublishContext } from '@/pages/Skill/contexts';
import { ConnectedProps } from '@/types';

import PublishAmazonForm from './Form';

const ModalComponent = Modal as React.FC<any>;

export const PublishAmazon: React.FC<ConnectedPublishAmazonProps> = ({ syncSelectedVendor }) => {
  const [open, setOpen] = React.useState(false);
  const [close, setClose] = React.useState(false);
  const { job, publish, cancel } = React.useContext(PublishContext)!;

  const onPublish = () => {
    setOpen(true);
    publish(true);
  };

  React.useEffect(() => {
    if (job && job.status === JobStatus.FINISHED) {
      setClose(true);
    }
  }, [job?.status]);

  React.useEffect(() => {
    syncSelectedVendor();
  }, []);

  return (
    <>
      <PublishAmazonForm onPublish={onPublish} />
      <ModalComponent isOpen={open} onClosed={cancel} centered contentClassName="overflow-hidden">
        {close && (
          <Box position="absolute" width="100%">
            <ModalHeader toggle={() => setOpen(false)} />
          </Box>
        )}
        <Box p={10}>
          <Alexa loader />
        </Box>
      </ModalComponent>
    </>
  );
};

const mapDispatchToProps = {
  syncSelectedVendor: Account.amazon.syncSelectedVendor,
};

type ConnectedPublishAmazonProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(PublishAmazon);
