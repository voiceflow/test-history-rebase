import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { Icon } from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

const CONNECT_ICON: Record<PlatformType, Icon | null> = {
  [PlatformType.ALEXA]: 'amazonAlexa',
  [PlatformType.GOOGLE]: 'googleAssistantNoColor',
  [PlatformType.GENERAL]: null,
  [PlatformType.IVR]: null,
  [PlatformType.CHATBOT]: null,
  [PlatformType.MOBILE_APP]: null,
};

const CONNECT_MESSAGE: Record<PlatformType, string> = {
  [PlatformType.ALEXA]: 'Connect to Alexa',
  [PlatformType.GOOGLE]: 'Connect to Google',
  [PlatformType.GENERAL]: '',
  [PlatformType.IVR]: '',
  [PlatformType.CHATBOT]: '',
  [PlatformType.MOBILE_APP]: '',
};

type ConnectButtonProps = {
  onClick: () => void;
};

const ConnectButton: React.FC<ConnectButtonProps & ConnectedConnectButtonProps> = ({ platform, onClick }) =>
  CONNECT_ICON[platform] ? (
    <TippyTooltip title={CONNECT_MESSAGE[platform]} position="bottom">
      <IconButton
        id={Identifier.UPLOAD}
        iconProps={{ color: '#3D82E2' }}
        preventFocusStyle
        variant={IconButtonVariant.ACTION}
        icon={CONNECT_ICON[platform] as Icon}
        large
        onClick={onClick}
      />
    </TippyTooltip>
  ) : null;

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

type ConnectedConnectButtonProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ConnectButton) as React.FC<ConnectButtonProps>;
