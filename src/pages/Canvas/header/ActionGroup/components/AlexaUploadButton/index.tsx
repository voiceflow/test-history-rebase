import React from 'react';

import { FeatureFlag } from '@/config/features';
import { AlexaStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { useFeature, useToggle } from '@/hooks';
import { Alexa } from '@/pages/Publish/Upload';
import { PublishContext } from '@/pages/Skill/contexts';
import { useCanvasMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';
import { isNotify, isReady, isRunning } from '@/utils/job';

import { ConnectButton, LoadingButton, SuccessButton, UploadButton } from '../ActionButtons';
import UploadPopup from '../UploadPopup';
import Button from './Button';

const AlexaUploadButton: React.FC<AlexaUploadButtonConnectedProps> = ({ amazon, syncSelectedVendor }) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const isCanvasMode = useCanvasMode();

  const { job, cancel, publish } = React.useContext(PublishContext)!;

  const [opened, onToggle] = useToggle();

  const needsLogin = !amazon;

  const onClose = React.useCallback(async () => {
    await cancel();
    onToggle(false);
  }, [cancel]);

  const onClick = () => {
    if (isReady(job)) {
      publish();
    }
    onToggle(true);
  };

  React.useEffect(() => {
    if (!opened && isNotify(job)) {
      onToggle(true);
    }
  }, [opened, job?.status]);

  React.useEffect(() => {
    syncSelectedVendor();
  }, []);

  const AlexaButton = () => {
    if (needsLogin) {
      return <ConnectButton onClick={onClick} />;
    }
    switch (job?.stage.type) {
      case AlexaStageType.WAIT_ACCOUNT:
      case AlexaStageType.WAIT_VENDORS:
        return <ConnectButton onClick={onClick} />;
      case AlexaStageType.IDLE:
      case AlexaStageType.PROGRESS:
        return <LoadingButton tooltipOpen={job?.stage.type === AlexaStageType.PROGRESS} progress={job.stage.data.progress as number} />;
      case AlexaStageType.SUCCESS:
        return <SuccessButton />;
      case AlexaStageType.WAIT_INVOCATION_NAME:
      default:
        return <UploadButton onClick={onClick} isJobActive={isRunning(job)} />;
    }
  };

  const noPopup = headerRedesign.isEnabled && job?.stage.type === AlexaStageType.PROGRESS;
  return (
    <>
      {headerRedesign.isEnabled && isCanvasMode ? <AlexaButton /> : <Button onClick={onClick} isActive={isRunning(job)} />}
      <UploadPopup open={opened && !noPopup} onClose={onClose}>
        {!noPopup && <Alexa />}
      </UploadPopup>
    </>
  );
};

const mapStateToProps = {
  amazon: Account.amazonAccountSelector,
};

const mapDispatchToProps = {
  syncSelectedVendor: Account.syncSelectedVendor,
};

type AlexaUploadButtonConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaUploadButton);
