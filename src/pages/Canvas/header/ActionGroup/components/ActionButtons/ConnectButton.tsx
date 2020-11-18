import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { Icon } from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const CONNECT_ICON: Record<PlatformType, Icon | null> = {
  [PlatformType.ALEXA]: 'amazonAlexa',
  [PlatformType.GOOGLE]: 'googleAssistantNoColor',
  [PlatformType.GENERAL]: null,
};

type ConnectButtonProps = {
  onClick: () => void;
};

const ConnectButton: React.FC<ConnectButtonProps & ConnectedConnectButtonProps> = ({ platform, onClick }) => {
  return CONNECT_ICON[platform] ? (
    <IconButton
      iconProps={{ color: '#3D82E2' }}
      preventFocusStyle
      variant={IconButtonVariant.ACTION}
      icon={CONNECT_ICON[platform] as Icon}
      large
      onClick={onClick}
    />
  ) : null;
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

type ConnectedConnectButtonProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps)(ConnectButton) as React.FC<ConnectButtonProps>;
