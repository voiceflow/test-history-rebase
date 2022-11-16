import * as Platform from '@voiceflow/platform-config';
import { Button as UIButton, ButtonVariant as UIButtonVariant, SvgIconTypes, Text, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { PlatformContext } from '@/pages/Project/contexts';
import { Identifier } from '@/styles/constants';

import { getPlatformIconProps } from '../constants';

export enum ButtonVariant {
  UPLOAD = 'UPLOAD',
  CONNECT = 'CONNECT',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ACTIVE = 'ACTIVE',
}

export interface CustomVariantProps {
  tooltip?: Partial<TippyTooltipProps>;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
}

interface ConnectButtonProps {
  variant?: ButtonVariant;
  onClick?: () => void;
  progress?: number;

  /*
    `customProps` used as an escape hatch in-case requirements ask for something
    similar to `Button` but with slight differences.
  */
  customProps?: CustomVariantProps;
}

interface ButtonProps {
  key?: string;
  icon?: SvgIconTypes.Icon;
  tooltip?: TippyTooltipProps;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
}

const getButtonProps = (
  platform: Platform.Constants.PlatformType,
  { variant, progress, customProps = {} }: ConnectButtonProps
): ButtonProps & { key?: string } => {
  const loadIconProps: ButtonProps = { icon: 'arrowSpin' as const };

  switch (variant) {
    case ButtonVariant.CONNECT:
      return {
        ...getPlatformIconProps(platform),
        ...customProps,
        tooltip: {
          title: `Connect to ${Platform.Config.get(platform).name}`,
          hotkey: HOTKEY_LABEL_MAP[Hotkey.UPLOAD_PROJECT],
          ...customProps.tooltip,
        },
      };
    case ButtonVariant.UPLOAD:
      return {
        ...getPlatformIconProps(platform),
        ...customProps,
        tooltip: {
          title: `Upload to ${Platform.Config.get(platform).name}`,
          hotkey: HOTKEY_LABEL_MAP[Hotkey.UPLOAD_PROJECT],
          ...customProps.tooltip,
        },
      };
    case ButtonVariant.SUCCESS:
      return {
        icon: 'checkSquare',
        iconProps: { size: 18, color: '#449127' },
        ...customProps,
        tooltip: {
          html: <span>Successfully Uploaded</span>,
          ...customProps.tooltip,
        },
      };
    case ButtonVariant.LOADING:
      return {
        ...loadIconProps,
        key: 'progress',
        ...customProps,
        iconProps: { spin: true, ...customProps.iconProps },
        tooltip: {
          ...(!customProps.tooltip && {
            html: (
              <div>
                Publishing:
                <Text ml="7px" color="rgba(255, 255, 255, 0.59)">
                  {progress || 0}%
                </Text>
              </div>
            ),
          }),
          ...customProps.tooltip,
        },
      };
    case ButtonVariant.ACTIVE:
    default:
      return {
        ...loadIconProps,
        ...customProps,
      };
  }
};

const ConnectButton: React.FC<ConnectButtonProps> = ({ onClick, ...props }) => {
  const platform = React.useContext(PlatformContext)!;
  const buttonProps = getButtonProps(platform, props);

  return (
    <TippyTooltip {...buttonProps.tooltip} disabled={!buttonProps.tooltip} position="bottom">
      <UIButton flat small variant={UIButtonVariant.SECONDARY} id={Identifier.UPLOAD} onClick={onClick} center {...buttonProps} />
    </TippyTooltip>
  );
};

export default ConnectButton;
