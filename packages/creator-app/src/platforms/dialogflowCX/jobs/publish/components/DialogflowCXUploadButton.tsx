import React from 'react';

import { DialogflowCXStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';
import { DialogflowCXPublishJob } from '@/models';
import Button, { ButtonVariant } from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/Button';

interface DialogflowUploadButtonProps {
  onPublish: () => void;
  dialogflowPublishJob: DialogflowCXPublishJob.AnyJob | null;
}

const DialogflowCXUploadButton: React.FC<DialogflowUploadButtonProps> = ({ onPublish, dialogflowPublishJob }) => {
  const isLoggedIn = !!useSelector(Account.googleAccountSelector);

  switch (dialogflowPublishJob?.stage.type) {
    case DialogflowCXStageType.WAIT_ACCOUNT:
      return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
    case DialogflowCXStageType.IDLE:
      return <Button variant={ButtonVariant.LOADING} progress={0} />;
    case DialogflowCXStageType.PROGRESS:
      return <Button variant={ButtonVariant.LOADING} progress={dialogflowPublishJob.stage.data.progress} />;
    case DialogflowCXStageType.SUCCESS:
      return <Button variant={ButtonVariant.SUCCESS} />;
    default:
      return <Button onClick={onPublish} variant={isLoggedIn ? ButtonVariant.UPLOAD : ButtonVariant.CONNECT} />;
  }
};

export default DialogflowCXUploadButton;
