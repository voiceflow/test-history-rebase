import { BoxFlexEnd, IconVariant, preventDefault, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { useTheme } from '@/hooks';

import ButtonWrapper from './ButtonWrapper';

export type ActionButtonsProps = {
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
};

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

  return (
    <BoxFlexEnd flex={1}>
      {!testEnded && (
        <>
          <TippyTooltip title="Reset Test" disabled={disabled}>
            <ButtonWrapper disabled={disabled} onClick={disabled ? undefined : onReset}>
              <SvgIcon icon="restart" variant={disabled ? IconVariant.TERTIARY : IconVariant.STANDARD} clickable={!disabled} />
            </ButtonWrapper>
          </TippyTooltip>
          <TippyTooltip title={isMuted ? 'Unmute Dialog Audio' : 'Mute Dialog Audio'}>
            <ButtonWrapper onMouseDown={preventDefault()} onClick={onMute}>
              <SvgIcon icon={isMuted ? 'soundOff' : 'sound'} variant={IconVariant.STANDARD} clickable={!disabled} />
            </ButtonWrapper>
          </TippyTooltip>
        </>
      )}

      {!noSend && !testEnded && (
        <ButtonWrapper
          color={color || theme?.colors.blue}
          onClick={() => (isIdle ? onStart() : onSend())}
          isMobile={isMobile}
          onMouseDown={preventDefault()}
        >
          <SvgIcon icon="send" color={theme?.backgrounds.white} />
        </ButtonWrapper>
      )}

      {testEnded && (
        <ButtonWrapper color={color || theme?.colors.blue} onClick={onReset} isMobile={isMobile}>
          <SvgIcon icon="restart" color={theme?.backgrounds.white} />
        </ButtonWrapper>
      )}
    </BoxFlexEnd>
  );
};

export default ActionButtons;
