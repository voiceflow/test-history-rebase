import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { Icon } from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { PlatformType } from '@/constants';
import * as Project from '@/ducks/project';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { createPlatformSelector } from '@/utils/platform';

const getConnectIcon = createPlatformSelector<Icon | null>(
  {
    [PlatformType.ALEXA]: 'amazonAlexa',
    [PlatformType.GOOGLE]: 'googleAssistantNoColor',
  },
  null
);

const getConnectMessage = createPlatformSelector(
  {
    [PlatformType.ALEXA]: 'Connect to Alexa',
    [PlatformType.GOOGLE]: 'Connect to Google',
  },
  ''
);

type ConnectButtonProps = {
  onClick: () => void;
};

const ConnectButton: React.FC<ConnectButtonProps & ConnectedConnectButtonProps> = ({ platform, onClick }) =>
  getConnectIcon(platform) ? (
    <TippyTooltip title={getConnectMessage(platform)} position="bottom">
      <IconButton
        id={Identifier.UPLOAD}
        iconProps={{ color: '#3D82E2' }}
        preventFocusStyle
        variant={IconButtonVariant.ACTION}
        icon={getConnectIcon(platform) as Icon}
        large
        onClick={onClick}
      />
    </TippyTooltip>
  ) : null;

const mapStateToProps = {
  platform: Project.activePlatformSelector,
};

type ConnectedConnectButtonProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ConnectButton) as React.FC<ConnectButtonProps>;
