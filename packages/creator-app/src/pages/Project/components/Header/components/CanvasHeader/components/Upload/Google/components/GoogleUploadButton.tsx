import React from 'react';

import { GoogleStageType } from '@/constants/platforms';
import { GooglePublishJob } from '@/models';

import Button, { ButtonVariant } from '../../components/Button';

interface GoogleUploadButtonProps {
  needsLogin: boolean;
  successfullyPublished: boolean;
  onPublish: () => void;
  googlePublishJob: GooglePublishJob.AnyJob | null;
}

const GoogleUploadButton: React.FC<GoogleUploadButtonProps> = ({ needsLogin, successfullyPublished, onPublish, googlePublishJob }) => {
  if (needsLogin) {
    return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
  }

  if (successfullyPublished) {
    return <Button variant={ButtonVariant.SUCCESS} />;
  }

  switch (googlePublishJob?.stage.type) {
    case GoogleStageType.WAIT_ACCOUNT:
      return <Button onClick={onPublish} variant={ButtonVariant.CONNECT} />;
    case GoogleStageType.IDLE:
      return <Button variant={ButtonVariant.LOADING} progress={0} />;
    case GoogleStageType.PROGRESS:
      return <Button variant={ButtonVariant.LOADING} progress={googlePublishJob.stage.data.progress} />;
    case GoogleStageType.SUCCESS:
      return <Button variant={ButtonVariant.SUCCESS} />;
    default:
      return <Button onClick={onPublish} variant={ButtonVariant.UPLOAD} />;
  }
};

export default GoogleUploadButton;
