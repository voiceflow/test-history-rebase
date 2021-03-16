import React from 'react';

import { FlexEnd } from '@/components/Box';
import SvgIcon from '@/components/SvgIcon';
import Tooltip from '@/components/TippyTooltip';
import { IconVariant } from '@/constants';
import { useTheme } from '@/hooks';
import { preventDefault } from '@/utils/dom';

import ButtonWrapper from './ButtonWrapper';

export type ActionButtonsProps = {
  color?: string;
  onMute: () => void;
  onSend: () => void;
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
  onReset,
  isMuted = false,
  disabled,
  testEnded = false,
  isMobile,
}) => {
  const theme = useTheme();

  return (
    <FlexEnd flex={1}>
      {!testEnded && (
        <>
          <Tooltip title="Reset Test" disabled={disabled}>
            <ButtonWrapper disabled={disabled} onClick={disabled ? undefined : onReset}>
              <SvgIcon icon="restart" variant={disabled ? IconVariant.TERTIARY : IconVariant.STANDARD} clickable={!disabled} />
            </ButtonWrapper>
          </Tooltip>

          <Tooltip title="Mute Dialog Audio" disabled={disabled}>
            <ButtonWrapper onMouseDown={preventDefault()} onClick={disabled ? undefined : onMute} disabled={disabled}>
              <SvgIcon icon={isMuted ? 'soundOff' : 'sound'} variant={disabled ? IconVariant.TERTIARY : IconVariant.STANDARD} clickable={!disabled} />
            </ButtonWrapper>
          </Tooltip>
        </>
      )}

      {!noSend && !testEnded && (
        <ButtonWrapper
          color={disabled ? theme?.iconColors.disabled : color || theme?.colors.blue}
          onMouseDown={preventDefault()}
          onClick={() => !disabled && onSend()}
          disabled={disabled}
          isMobile={isMobile}
        >
          <SvgIcon icon="send" color={theme?.backgrounds.white} />
        </ButtonWrapper>
      )}

      {testEnded && (
        <ButtonWrapper color={color || theme?.colors.blue} onClick={onReset} isMobile={isMobile}>
          <SvgIcon icon="restart" color={theme?.backgrounds.white} />
        </ButtonWrapper>
      )}
    </FlexEnd>
  );
};

export default ActionButtons;
