import React from 'react';

import Modal, { ModalBody } from '@/components/Modal';
import { JobStatus, ModalType } from '@/constants';
import { PublishContext } from '@/contexts';
import * as Account from '@/ducks/account';
import { useDidUpdateEffect, useDispatch, useModals, useSetup, useTrackingEvents } from '@/hooks';
import { Alexa } from '@/platforms';

import PublishAmazonForm from './Form';

export const PublishAmazon: React.FC = () => {
  const syncSelectedVendor = useDispatch(Account.amazon.syncSelectedVendor);

  const { job, publish: publishToAlexa, cancel } = React.useContext(PublishContext)!;

  const publishAmazonModal = useModals(ModalType.PUBLISH_AMAZON);
  const publishVersionModal = useModals(ModalType.PUBLISH_VERSION_MODAL);

  const [closable, setClosable] = React.useState(false);

  const [trackingEvents] = useTrackingEvents();

  const publish = React.useCallback(
    (versionName: string) => {
      publishAmazonModal.open();
      publishToAlexa({ versionName, submit: true });
    },
    [publishAmazonModal, publishToAlexa]
  );

  const onPublish = React.useCallback(() => {
    publishVersionModal.open({ onConfirm: publish });
  }, []);

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
          <Alexa.Components.PlatformUploadPopup loader />
        </ModalBody>
      </Modal>
    </>
  );
};

export default PublishAmazon;
