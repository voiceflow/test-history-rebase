import { Constants } from '@voiceflow/general-types';
import { Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { HeaderIconButtonProps } from '@/components/ProjectPage';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { PlatformContext } from '@/pages/Skill/contexts';
import { Identifier } from '@/styles/constants';
import { createPlatformSelector } from '@/utils/platform';

import StyledButton from './StyledButton';

const getPlatformIconProps = createPlatformSelector<HeaderIconButtonProps>(
  {
    [Constants.PlatformType.ALEXA]: { icon: 'amazonAlexa', iconProps: { color: '#5fcaf4' } },
    [Constants.PlatformType.GOOGLE]: { icon: 'googleAssistant' },
  },
  { icon: 'ban' }
);

const getPlatformName = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: 'Alexa',
    [Constants.PlatformType.GOOGLE]: 'Google',
  },
  ''
);

export enum ButtonVariant {
  UPLOAD = 'UPLOAD',
  CONNECT = 'CONNECT',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
}

interface ConnectButtonProps {
  variant?: ButtonVariant;
  onClick?: () => void;
  progress?: number;
}

const getButtonProps = (platform: Constants.PlatformType, { variant, progress }: ConnectButtonProps): HeaderIconButtonProps & { key?: string } => {
  const loadIconProps: HeaderIconButtonProps = { icon: 'loader', color: '#132144', withOpacity: true, size: 18 };

  switch (variant) {
    case ButtonVariant.CONNECT:
      return {
        ...getPlatformIconProps(platform),
        tooltip: { title: `Connect to ${getPlatformName(platform)}`, hotkey: HOTKEY_LABEL_MAP[Hotkey.UPLOAD_PROJECT] },
      };
    case ButtonVariant.UPLOAD:
      return {
        ...getPlatformIconProps(platform),
        tooltip: { title: `Upload to ${getPlatformName(platform)}`, hotkey: HOTKEY_LABEL_MAP[Hotkey.UPLOAD_PROJECT] },
      };
    case ButtonVariant.SUCCESS:
      return { icon: 'greenCheckMark', size: 18, tooltip: { html: <span>Successfully Uploaded</span> } };
    case ButtonVariant.LOADING:
      return {
        ...loadIconProps,
        key: 'progress',
        iconProps: { spin: true },
        tooltip: {
          html: (
            <div>
              Uploading:
              <Text ml="7px" color="rgba(255, 255, 255, 0.59)">
                {progress || 0}%
              </Text>
            </div>
          ),
        },
      };
    default:
      return loadIconProps;
  }
};

const ConnectButton: React.FC<ConnectButtonProps> = ({ onClick, ...props }) => {
  const platform = React.useContext(PlatformContext)!;

  const buttonProps = getButtonProps(platform, props);
  const ButtonContainer = buttonProps.tooltip ? TippyTooltip : React.Fragment;

  return (
    <ButtonContainer {...buttonProps.tooltip} position="bottom">
      <StyledButton id={Identifier.UPLOAD} onClick={onClick} {...buttonProps} />
    </ButtonContainer>
  );
};

export default ConnectButton;
