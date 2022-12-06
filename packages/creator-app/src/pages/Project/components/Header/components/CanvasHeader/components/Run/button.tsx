import { Button, ButtonVariant, PrimaryButtonProps, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { Identifier } from '@/styles/constants';

const StyledButton = styled(Button)<PrimaryButtonProps>`
  svg {
    transform: scale(1.15);
  }
`;

const RunButton: React.FC<{ variant?: ButtonVariant; loading?: boolean; onClick?: VoidFunction; active?: boolean }> = ({
  variant = ButtonVariant.PRIMARY,
  loading,
  onClick,
  active,
}) => {
  let iconProps: React.ComponentProps<typeof SvgIcon> = { icon: 'play' };

  if (variant === ButtonVariant.SECONDARY) {
    iconProps = { icon: 'playOutline', color: active ? '#132144' : '#6E849AD9' };
  }

  if (loading) {
    iconProps = { icon: 'arrowSpin', spin: true, color: '#6E849AD9' };
  }

  return (
    <TippyTooltip title="Run" hotkey={HOTKEY_LABEL_MAP[Hotkey.RUN_MODE]}>
      <StyledButton flat squareRadius onClick={onClick} id={Identifier.TEST} variant={variant} isActive={active}>
        <SvgIcon width={16} height={16} {...iconProps} />
      </StyledButton>
    </TippyTooltip>
  );
};

export default RunButton;
