import { Button, ButtonVariant, PrimaryButtonProps, SecondaryButtonProps, SvgIcon, SvgIconTypes, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { Identifier } from '@/styles/constants';

const StyledButton = styled(Button)<PrimaryButtonProps | SecondaryButtonProps>`
  svg {
    transform: scale(1.15);
  }
`;

interface RunButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  active?: boolean;
}

const RunButton: React.FC<RunButtonProps> = ({ variant = ButtonVariant.PRIMARY, loading = false, onClick, active = false }) => {
  const iconProps: SvgIconTypes.Props = { icon: 'play' };

  if (variant === ButtonVariant.SECONDARY) {
    iconProps.icon = 'playOutline';
  }
  if (loading) {
    iconProps.icon = 'arrowSpin';
    iconProps.spin = true;
  }

  const commonProps = {
    flat: true,
    squareRadius: true,
    variant,
    onClick,
    isActive: active,
    id: Identifier.TEST,
  };

  return (
    <TippyTooltip content={<TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.RUN_MODE]}>Run</TippyTooltip.WithHotkey>}>
      {variant === ButtonVariant.SECONDARY ? (
        <StyledButton {...commonProps} icon={iconProps.icon} iconProps={iconProps} />
      ) : (
        <StyledButton {...commonProps}>
          <SvgIcon width={16} height={16} {...iconProps} />
        </StyledButton>
      )}
    </TippyTooltip>
  );
};

export default RunButton;
