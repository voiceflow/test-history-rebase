import React from 'react';

import { GoogleStageType } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';
import { GooglePublishJob } from '@/models';
import Button, { ButtonVariant } from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload/components/Button';

interface GoogleUploadButtonProps {
  onPublish: () => void;
  googlePublishJob: GooglePublishJob.AnyJob | null;
}

const GoogleUploadButton: React.FC<GoogleUploadButtonProps> = ({ onPublish, googlePublishJob }) => {
  const google = useSelector(Account.googleAccountSelector);
  const needsLogin = !google;

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
      return <Button onClick={onPublish} variant={needsLogin ? ButtonVariant.CONNECT : ButtonVariant.UPLOAD} />;
  }
};

export default GoogleUploadButton;
