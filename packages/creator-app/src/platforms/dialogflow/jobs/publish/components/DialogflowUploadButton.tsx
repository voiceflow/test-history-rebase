import React from 'react';

import { DialogflowStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';
import { DialogflowPublishJob } from '@/models';
import Button, { ButtonVariant } from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/Button';

interface DialogflowUploadButtonProps {
  onPublish: () => void;
  dialogflowPublishJob: DialogflowPublishJob.AnyJob | null;
}

const DialogflowUploadButton: React.FC<DialogflowUploadButtonProps> = ({ onPublish, dialogflowPublishJob }) => {
  const isLoggedIn = !!useSelector(Account.googleAccountSelector);

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
      return <Button onClick={onPublish} variant={isLoggedIn ? ButtonVariant.UPLOAD : ButtonVariant.CONNECT} />;
  }
};

export default DialogflowUploadButton;
