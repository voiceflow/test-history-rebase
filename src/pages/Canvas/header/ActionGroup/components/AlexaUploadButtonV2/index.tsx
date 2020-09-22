import React from 'react';

import * as AccountSideEffectsV2 from '@/ducks/account/sideEffectsV2';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks';
import { Alexa } from '@/pages/Publish/UploadV2';
import { PublishContext } from '@/pages/Skill/contexts';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';

import UploadPopup from '../UploadPopup';
import Button from './Button';

const AlexaUploadButton: React.FC<AlexaUploadButtonConnectedProps> = ({ syncSelectedVendor }) => {
  const { job, cancel, publish } = React.useContext(PublishContext)!;

  const [opened, onToggle] = useToggle();

  const onClose = React.useCallback(async () => {
    await cancel();
    onToggle(false);
  }, [cancel]);

  const onClick = () => {
    if (isReady(job)) {
      publish();
      onToggle(false);
    } else {
      onToggle();
    }
  };

  React.useEffect(() => {
    if (!opened && isNotify(job)) {
      onToggle(true);
    }
  }, [opened, job?.status]);

  React.useEffect(() => {
    syncSelectedVendor();
  }, []);

  return (
    <>
      <Button onClick={onClick} isActive={isRunning(job)} />

      <UploadPopup open={opened} onClose={onClose}>
        <Alexa />
      </UploadPopup>
    </>
  );
};

const mapDispatchToProps = {
  syncSelectedVendor: AccountSideEffectsV2.syncSelectedVendor,
};

type AlexaUploadButtonConnectedProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(AlexaUploadButton);
