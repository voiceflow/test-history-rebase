import React from 'react';

import Box from '@/components/Box';
import TippyTooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { usePermission } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import UploadButton from '../UploadButton';

type ButtonProps = {
  onClick: () => void;
  isActive: boolean;
  label?: string;
};

const Button: React.FC<ConnectedButtonProps & ButtonProps> = ({ google, onClick, isActive, label }) => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const needsLogin = !google;

  const buttonIcon = isActive ? 'publishSpin' : 'rocket';
  const buttonLabel = label || (needsLogin ? 'Connect to Google' : 'Upload to Google');

  return (
    <TippyTooltip
      html={<Box width={180}>Test your Action on your own device, or on the Action developer console</Box>}
      position="bottom"
      disabled={!canEditCanvas}
    >
      <UploadButton icon={buttonIcon} id={Identifier.UPLOAD} onClick={onClick} isUploading={isActive}>
        {buttonLabel}
      </UploadButton>
    </TippyTooltip>
  );
};

const mapStateToProps = {
  google: Account.googleAccountSelector,
};

type ConnectedButtonProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Button) as React.FC<ButtonProps>;
