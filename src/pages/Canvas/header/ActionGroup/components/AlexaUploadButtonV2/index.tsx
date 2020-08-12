import React from 'react';

import { JobStatus } from '@/constants';
import { useToggle } from '@/hooks';
import { Alexa } from '@/pages/Publish/UploadV2';
import { PublishContext } from '@/pages/Skill/contexts';

import UploadPopup from '../UploadPopup';
import Button from './Button';

const AlexaUploadButton = () => {
  const { job, cancel } = React.useContext(PublishContext)!;

  const [opened, onToggle] = useToggle();

  const onClose = React.useCallback(async () => {
    await cancel();
    onToggle(false);
  }, [cancel]);

  React.useEffect(() => {
    if (!opened && job?.status === JobStatus.PENDING) {
      onToggle(true);
    }
  }, [opened, job?.status]);

  return (
    <>
      <Button onClick={onToggle} />

      <UploadPopup open={opened} onClose={onClose}>
        <Alexa />
      </UploadPopup>
    </>
  );
};

export default AlexaUploadButton;
