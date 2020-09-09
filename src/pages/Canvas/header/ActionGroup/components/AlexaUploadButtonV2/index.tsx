import React from 'react';

import { useToggle } from '@/hooks';
import { Alexa } from '@/pages/Publish/UploadV2';
import { PublishContext } from '@/pages/Skill/contexts';
import { isNotify, isReady, isRunning } from '@/utils/job';

import UploadPopup from '../UploadPopup';
import Button from './Button';

const AlexaUploadButton = () => {
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

  return (
    <>
      <Button onClick={onClick} isActive={isRunning(job)} />

      <UploadPopup open={opened} onClose={onClose}>
        <Alexa />
      </UploadPopup>
    </>
  );
};

export default AlexaUploadButton;
