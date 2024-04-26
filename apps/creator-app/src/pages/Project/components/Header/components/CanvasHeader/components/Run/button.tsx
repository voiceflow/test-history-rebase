import * as Realtime from '@voiceflow/realtime-sdk';
import type { PrimaryButtonProps, SecondaryButtonProps, SvgIconTypes } from '@voiceflow/ui';
import { Button, ButtonVariant, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import { Header, TooltipWithKeys } from '@voiceflow/ui-next';
import React from 'react';

import { styled } from '@/hocs/styled';
import { useFeature } from '@/hooks/feature';
import { getHotkeyLabel, Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { Identifier } from '@/styles/constants';

const StyledButton = styled(Button)<PrimaryButtonProps | SecondaryButtonProps>`
  svg {
    transform: scale(1.15);
  }
`;

interface RunButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  loading?: boolean;

  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is removed
   */
  variant?: ButtonVariant;
}

const RunButton: React.FC<RunButtonProps> = ({
  variant = ButtonVariant.PRIMARY,
  loading = false,
  onClick,
  active = false,
}) => {
  const cmsWorkflows = useFeature(Realtime.FeatureFlag.CMS_WORKFLOWS);

  if (cmsWorkflows.isEnabled) {
    return (
      <TooltipWithKeys
        text="Run"
        hotkeys={[{ label: getHotkeyLabel(Hotkey.RUN_MODE) }]}
        placement="bottom"
        referenceElement={({ ref, onOpen, onClose }) => (
          <div ref={ref}>
            <Header.Button.Primary
              label="Run"
              onClick={onClick}
              iconName="PlayS"
              isActive={active}
              isLoading={loading}
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
            />
          </div>
        )}
      />
    );
  }

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
    <TippyTooltip
      content={<TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.RUN_MODE]}>Run</TippyTooltip.WithHotkey>}
    >
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
