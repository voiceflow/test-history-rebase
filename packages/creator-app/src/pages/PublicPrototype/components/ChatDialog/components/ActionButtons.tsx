import { Box, BoxFlexEnd, ButtonVariant, preventDefault, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import SoundToggle from '@/components/SoundToggle';
import { prototypeSelector } from '@/ducks/prototype';
import { useSelector, useTheme } from '@/hooks';

import ActionButton from './ActionButton';

export interface ActionButtonsProps {
  color?: string;
  onMute: () => void;
  onSend: () => void;
  onStart: () => void;
  isIdle?: boolean;
  noSend?: boolean;
  onReset: () => void;
  isMuted?: boolean;
  disabled?: boolean;
  testEnded?: boolean;
  isMobile?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  color,
  noSend = false,
  onMute,
  onSend,
  isIdle = false,
  onReset,
  onStart,
  isMuted = true,
  disabled,
  testEnded = false,
  isMobile,
}) => {
  const theme = useTheme();
  const { platform } = useSelector(prototypeSelector);

  return (
    <BoxFlexEnd ml={16}>
      {!testEnded && (
        <>
          <TippyTooltip title="Reset Test" disabled={disabled}>
            <ActionButton
              square
              isGray
              variant={ButtonVariant.TERTIARY}
              onClick={disabled ? undefined : onReset}
              disabled={disabled}
              isMobile={isMobile}
              squareRadius
            >
              <SvgIcon icon="restart" color="inherit" />
            </ActionButton>
          </TippyTooltip>

          <SoundToggle platform={platform!} isMuted={isMuted} preventButtonDefault onClick={onMute} />
        </>
      )}

      {!noSend && !testEnded && (
        <>
          <Box width={12} />
          <ActionButton
            color={color || '#3d82e2'}
            isMobile={isMobile}
            onClick={() => (isIdle ? onStart() : onSend())}
            onMouseDown={preventDefault()}
            squareRadius
          >
            <SvgIcon icon="send" color={theme?.backgrounds.white} />
          </ActionButton>
        </>
      )}

      {testEnded && (
        <>
          <Box width={12} />
          <ActionButton color={color || '#3d82e2'} onClick={onReset} isMobile={isMobile} squareRadius>
            <SvgIcon icon="restart" color={theme?.backgrounds.white} />
          </ActionButton>
        </>
      )}
    </BoxFlexEnd>
  );
};

export default ActionButtons;
