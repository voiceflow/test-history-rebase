import React from 'react';

import { DialogflowESStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';
import { DialogflowESPublishJob } from '@/models';
import Button, { ButtonVariant } from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/Button';

interface DialogflowESUploadButtonProps {
  onPublish: () => void;
  DialogflowESPublishJob: DialogflowESPublishJob.AnyJob | null;
}

const DialogflowESUploadButton: React.FC<DialogflowESUploadButtonProps> = ({ onPublish, DialogflowESPublishJob }) => {
  const isLoggedIn = !!useSelector(Account.googleAccountSelector);

  switch (DialogflowESPublishJob?.stage.type) {
    case DialogflowESStageType.WAIT_ACCOUNT:
      return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
    case DialogflowESStageType.IDLE:
      return <Button variant={ButtonVariant.LOADING} progress={0} />;
    case DialogflowESStageType.PROGRESS:
      return <Button variant={ButtonVariant.LOADING} progress={DialogflowESPublishJob.stage.data.progress} />;
    case DialogflowESStageType.SUCCESS:
      return <Button variant={ButtonVariant.SUCCESS} />;
    default:
      return <Button onClick={onPublish} variant={isLoggedIn ? ButtonVariant.UPLOAD : ButtonVariant.CONNECT} />;
  }
};

export default DialogflowESUploadButton;
