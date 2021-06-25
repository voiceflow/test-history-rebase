import { Portal } from '@voiceflow/ui';
import React from 'react';

import { AlexaStageType } from '@/constants/platforms';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { Alexa } from '@/pages/Publish/Upload';
import { ProgressStage } from '@/pages/Publish/Upload/components';
import { useAlexaPublish } from '@/pages/Skill/hooks';

import Button, { ButtonVariant } from './Button';
import Popup from './Popup';

const JOB_STARTED_STAGES = [AlexaStageType.IDLE, AlexaStageType.PROGRESS, AlexaStageType.SUCCESS];

const AlexaPublish: React.FC = () => {
  const { job, noPopup, onCancel, onPublish, needsLogin, popupOpened, vendorSelected, showSelectVendor, setVendorSelected, successfullyPublished } =
    useAlexaPublish();

  const hotkeyDisabled = successfullyPublished || (popupOpened && showSelectVendor) || (!!job && JOB_STARTED_STAGES.includes(job?.stage.type));

  useHotKeys(Hotkey.UPLOAD_PROJECT, onPublish, { disable: hotkeyDisabled, preventDefault: true }, [onPublish]);

  const button = React.useMemo(() => {
    if (needsLogin) {
      return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
    }

    if (successfullyPublished) {
      return <Button variant={ButtonVariant.SUCCESS} />;
    }

    if (popupOpened && showSelectVendor) {
      return <Button variant={ButtonVariant.CONNECT} />;
    }

    switch (job?.stage.type) {
      case AlexaStageType.WAIT_ACCOUNT:
        return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
      case AlexaStageType.IDLE:
        return <Button variant={ButtonVariant.LOADING} progress={0} />;
      case AlexaStageType.PROGRESS:
        return <Button variant={ButtonVariant.LOADING} progress={job.stage.data.progress} />;
      case AlexaStageType.SUCCESS:
        return <Button variant={ButtonVariant.SUCCESS} />;
      default:
        return <Button onClick={onPublish} variant={ButtonVariant.UPLOAD} />;
    }
  }, [job, needsLogin, onPublish, successfullyPublished, popupOpened, vendorSelected, showSelectVendor]);

  return (
    <>
      {button}

      <Portal>
        {job?.stage.type === AlexaStageType.PROGRESS && <ProgressStage progress={job.stage.data.progress} />}

        <Popup multiSelect={showSelectVendor} open={popupOpened && (!vendorSelected || !noPopup)} onClose={onCancel} jobStage={job?.stage.type}>
          {(showSelectVendor || !noPopup) && <Alexa showSelectVendor={showSelectVendor} setVendorSelected={setVendorSelected} />}
        </Popup>
      </Portal>
    </>
  );
};

export default AlexaPublish;
