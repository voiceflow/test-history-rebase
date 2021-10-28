import React from 'react';

import { DialogflowStageType } from '@/constants/platforms';
import { DialogflowPublishJob } from '@/models';

import Button, { ButtonVariant } from '../../components/Button';

interface DialogflowUploadButtonProps {
  needsLogin: boolean;
  successfullyPublished: boolean;
  onPublish: () => void;
  dialogflowPublishJob: DialogflowPublishJob.AnyJob | null;
}

const DialogflowUploadButton: React.FC<DialogflowUploadButtonProps> = ({ needsLogin, onPublish, successfullyPublished, dialogflowPublishJob }) => {
  if (needsLogin) {
    return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
  }

  if (successfullyPublished) {
    return <Button variant={ButtonVariant.SUCCESS} />;
  }

  switch (dialogflowPublishJob?.stage.type) {
    case DialogflowStageType.WAIT_ACCOUNT:
      return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
    case DialogflowStageType.IDLE:
      return <Button variant={ButtonVariant.LOADING} progress={0} />;
    case DialogflowStageType.PROGRESS:
      return <Button variant={ButtonVariant.LOADING} progress={dialogflowPublishJob.stage.data.progress} />;
    case DialogflowStageType.SUCCESS:
      return <Button variant={ButtonVariant.SUCCESS} />;
    default:
      return <Button onClick={onPublish} variant={ButtonVariant.UPLOAD} />;
  }
};

export default DialogflowUploadButton;
