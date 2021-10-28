import React from 'react';

import { AlexaStageType } from '@/constants/platforms';
import { AlexaPublishJob } from '@/models';

import Button, { ButtonVariant } from '../../components/Button';

interface AlexaUploadButtonProps {
  needsLogin: boolean;
  successfullyPublished: boolean;
  onPublish: () => void;
  alexaPublishJob: AlexaPublishJob.AnyJob | null;
  popupOpened: boolean;
  showSelectVendor: boolean;
}

const AlexaUploadButton: React.FC<AlexaUploadButtonProps> = ({
  needsLogin,
  successfullyPublished,
  onPublish,
  alexaPublishJob,
  popupOpened,
  showSelectVendor,
}) => {
  if (needsLogin) {
    return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
  }

  if (successfullyPublished) {
    return <Button variant={ButtonVariant.SUCCESS} />;
  }

  if (popupOpened && showSelectVendor) {
    return <Button variant={ButtonVariant.CONNECT} />;
  }

  switch (alexaPublishJob?.stage.type) {
    case AlexaStageType.WAIT_ACCOUNT:
      return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
    case AlexaStageType.IDLE:
      return <Button variant={ButtonVariant.LOADING} progress={0} />;
    case AlexaStageType.PROGRESS:
      return <Button variant={ButtonVariant.LOADING} progress={alexaPublishJob.stage.data.progress} />;
    case AlexaStageType.SUCCESS:
      return <Button variant={ButtonVariant.SUCCESS} />;
    default:
      return <Button onClick={onPublish} variant={ButtonVariant.UPLOAD} />;
  }
};

export default AlexaUploadButton;
