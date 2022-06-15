import { SvgIconTypes, Text, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { getPlatformName } from '@/constants/platforms';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { PlatformContext } from '@/pages/Project/contexts';
import { Identifier } from '@/styles/constants';

import { getPlatformIconProps } from '../constants';
import StyledButton from './StyledButton';

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

interface ButtonProps {
  key?: string;
  icon?: SvgIconTypes.Icon;
  tooltip?: TippyTooltipProps;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
}

const getButtonProps = (platform: VoiceflowConstants.PlatformType, { variant, progress }: ConnectButtonProps): ButtonProps => {
  const loadIconProps: ButtonProps = { icon: 'loader' as const };

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
      return { icon: 'greenCheckMark', tooltip: { html: <span>Successfully Uploaded</span> } };
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
