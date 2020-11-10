import React from 'react';

import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks';
import { Google } from '@/pages/Publish/UploadV2';
import { PublishContext } from '@/pages/Skill/contexts';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';

import UploadPopup from '../UploadPopup';
import Button from './Button';

const GoogleUploadButton: React.FC<GoogleUploadButtonConnectedProps> = ({ getGoogleAccount }) => {
  const { job, cancel, publish } = React.useContext(PublishContext)!;

  const [opened, onToggle] = useToggle();

  const onClose = React.useCallback(async () => {
    await cancel();
    onToggle(false);
  }, [cancel]);

  React.useEffect(() => {
    if (!opened && isNotify(job)) {
      onToggle(true);
    }
  }, [opened, job?.status]);

  const onClick = () => {
    if (isReady(job)) {
      publish();
      onToggle(false);
    } else {
      onToggle();
    }
  };

  React.useEffect(() => {
    getGoogleAccount();
  }, []);

  return (
    <>
      <Button onClick={onClick} isActive={isRunning(job)} />

      <UploadPopup open={opened} onClose={onClose}>
        <Google />
      </UploadPopup>
    </>
  );
};

const mapDispatchToProps = {
  getGoogleAccount: Account.getGoogleAccount,
};

type GoogleUploadButtonConnectedProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(GoogleUploadButton);
