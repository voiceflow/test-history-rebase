import { Button, ButtonVariant, PrimaryButtonProps, SecondaryButtonProps, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { Identifier } from '@/styles/constants';

const StyledButton = styled(Button)<PrimaryButtonProps | SecondaryButtonProps>`
  svg {
    transform: scale(1.15);
  }
`;

interface RunButtonProps {
  variant?: ButtonVariant;
  loading?: boolean;
  onClick?: VoidFunction;
  active?: boolean;
}

const RunButton: React.FC<RunButtonProps> = ({ variant = ButtonVariant.PRIMARY, loading = false, onClick, active = false }) => {
  return (
    <TippyTooltip title="Run" hotkey={HOTKEY_LABEL_MAP[Hotkey.RUN_MODE]}>
      {variant === ButtonVariant.SECONDARY ? (
        <StyledButton
          flat
          squareRadius
          onClick={onClick}
          id={Identifier.TEST}
          variant={ButtonVariant.SECONDARY}
          isActive={active}
          icon="playOutline"
          isLoading={loading}
        />
      ) : (
        <StyledButton flat squareRadius onClick={onClick} id={Identifier.TEST} variant={variant} isActive={active}>
          <SvgIcon width={16} height={16} icon={loading ? 'arrowSpin' : 'play'} spin={loading} />
        </StyledButton>
      )}
    </TippyTooltip>
  );
};

export default RunButton;
