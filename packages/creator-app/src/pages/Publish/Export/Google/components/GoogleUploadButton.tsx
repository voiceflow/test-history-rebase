import React from 'react';

import UploadButton from '@/components/PlatformUploadButton';
import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';

interface GoogleUploadButtonProps {
  onClick: () => void;
  isActive: boolean;
  label?: string;
}

const GoogleUploadButton: React.FC<GoogleUploadButtonProps> = ({ onClick, isActive, label }) => {
  const google = useSelector(Account.googleAccountSelector);
  const needsLogin = !google;
  const buttonLabel = label || (needsLogin ? 'Connect to Google' : 'Upload to Google');

  return (
    <UploadButton
      label={buttonLabel}
      tooltip="Test your Action on your own device, or on the Action developer console"
      isActive={isActive}
      onClick={onClick}
    />
  );
};

export default GoogleUploadButton;
