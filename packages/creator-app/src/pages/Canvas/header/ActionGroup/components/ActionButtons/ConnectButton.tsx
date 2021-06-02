import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { Icon } from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { PlatformType } from '@/constants';
import { PlatformContext } from '@/pages/Skill/contexts';
import { Identifier } from '@/styles/constants';
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

const ConnectButton: React.FC<ConnectButtonProps> = ({ onClick }) => {
  const platform = React.useContext(PlatformContext)!;

  return getConnectIcon(platform) ? (
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
};

export default ConnectButton;
