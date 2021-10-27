import React from 'react';

import Modal, { ModalBody } from '@/components/Modal';
import { JobStatus, ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import { useDidUpdateEffect, useDispatch, useModals, useSetup, useTrackingEvents } from '@/hooks';
import { Alexa } from '@/pages/Publish/Upload';
import { PublishContext } from '@/pages/Skill/contexts';

import PublishAmazonForm from './Form';

export const PublishAmazon: React.FC = () => {
  const syncSelectedVendor = useDispatch(Account.amazon.syncSelectedVendor);

  const { job, publish, cancel } = React.useContext(PublishContext)!;

  const publishAmazonModal = useModals(ModalType.PUBLISH_AMAZON);

  const [closable, setClosable] = React.useState(false);

  const [trackingEvents] = useTrackingEvents();

  const onPublish = () => {
    publishAmazonModal.open();

    publish(true);
  };

  useSetup(() => {
    trackingEvents.trackActiveProjectAlexaPublishPage();

    syncSelectedVendor();
  });

  React.useEffect(() => {
    if (job?.status === JobStatus.FINISHED) {
      setClosable(true);
    }
  }, [job?.status]);

  useDidUpdateEffect(() => {
    if (!publishAmazonModal.isOpened) {
      cancel();
    }
  }, [publishAmazonModal.isOpened]);

  return (
    <>
      <PublishAmazonForm onPublish={onPublish} />

      <Modal id={ModalType.PUBLISH_AMAZON} title="" closable={closable}>
        <ModalBody>
          <Alexa loader />
        </ModalBody>
      </Modal>
    </>
  );
};

export default PublishAmazon;
