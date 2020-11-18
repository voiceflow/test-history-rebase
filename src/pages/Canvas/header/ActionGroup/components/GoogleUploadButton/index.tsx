import React from 'react';

import { FeatureFlag } from '@/config/features';
import { GoogleStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { useFeature, useToggle } from '@/hooks';
import { Google } from '@/pages/Publish/Upload';
import { PublishContext } from '@/pages/Skill/contexts';
import { useCanvasMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';

import { ConnectButton, LoadingButton, SuccessButton, UploadButton } from '../ActionButtons';
import UploadPopup from '../UploadPopup';
import Button from './Button';

const GoogleUploadButton: React.FC<GoogleUploadButtonConnectedProps> = ({ google, getGoogleAccount }) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const isCanvasMode = useCanvasMode();

  const { job, cancel, publish } = React.useContext(PublishContext)!;

  const [opened, onToggle] = useToggle();

  const needsLogin = !google;

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
      onToggle(true);
    } else {
      onToggle();
    }
  };

  React.useEffect(() => {
    getGoogleAccount();
  }, []);

  const GoogleButton = () => {
    if (needsLogin) {
      return <ConnectButton onClick={onClick} />;
    }
    switch (job?.stage.type) {
      case GoogleStageType.WAIT_ACCOUNT:
      case GoogleStageType.WAIT_PROJECT:
        return <ConnectButton onClick={onClick} />;
      case GoogleStageType.IDLE:
      case GoogleStageType.PROGRESS:
        return <LoadingButton tooltipOpen={job?.stage.type === GoogleStageType.PROGRESS} progress={job.stage.data.progress as number} />;
      case GoogleStageType.SUCCESS:
        return <SuccessButton />;
      case GoogleStageType.WAIT_INVOCATION_NAME:
      default:
        return <UploadButton onClick={onClick} isJobActive={isRunning(job)} />;
    }
  };

  const noPopup = headerRedesign.isEnabled && job?.stage.type === GoogleStageType.PROGRESS;
  return (
    <>
      {headerRedesign.isEnabled && isCanvasMode ? <GoogleButton /> : <Button onClick={onClick} isActive={isRunning(job)} />}
      <UploadPopup open={opened && !noPopup} onClose={onClose}>
        {!noPopup && <Google />}
      </UploadPopup>
    </>
  );
};

const mapStateToProps = {
  google: Account.googleAccountSelector,
};

const mapDispatchToProps = {
  getGoogleAccount: Account.getGoogleAccount,
};

type GoogleUploadButtonConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(GoogleUploadButton);
