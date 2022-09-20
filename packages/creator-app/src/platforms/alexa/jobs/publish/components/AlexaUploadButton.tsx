import React from 'react';

import { AlexaStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';
import { AlexaPublishJob } from '@/models';
import Button, { ButtonVariant } from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/Button';

interface AlexaUploadButtonProps {
  onPublish: () => void;
  alexaPublishJob: AlexaPublishJob.AnyJob | null;
}

const AlexaUploadButton: React.FC<AlexaUploadButtonProps> = ({ onPublish, alexaPublishJob }) => {
  const isLoggedIn = !!useSelector(Account.amazonAccountSelector);

  switch (alexaPublishJob?.stage.type) {
    case AlexaStageType.SELECT_VENDORS:
      return <Button variant={ButtonVariant.CONNECT} />;
    case AlexaStageType.WAIT_ACCOUNT:
      return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
    case AlexaStageType.IDLE:
      return <Button variant={ButtonVariant.LOADING} progress={0} />;
    case AlexaStageType.PROGRESS:
      return <Button variant={ButtonVariant.LOADING} progress={alexaPublishJob.stage.data.progress} />;
    case AlexaStageType.SUCCESS:
      return <Button variant={ButtonVariant.SUCCESS} />;
    default:
      return <Button onClick={onPublish} variant={isLoggedIn ? ButtonVariant.UPLOAD : ButtonVariant.CONNECT} />;
  }
};

export default AlexaUploadButton;
