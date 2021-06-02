import React from 'react';

import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import UploadButton from '../UploadButton';

type ButtonProps = {
  onClick: () => void;
  isActive: boolean;
  label?: string;
};

const Button: React.FC<ConnectedButtonProps & ButtonProps> = ({ google, onClick, isActive, label }) => {
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

const mapStateToProps = {
  google: Account.googleAccountSelector,
};

type ConnectedButtonProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Button) as React.FC<ButtonProps>;
