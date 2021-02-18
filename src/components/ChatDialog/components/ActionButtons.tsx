import React from 'react';

import { Flex } from '@/components/Box';
import SvgIcon from '@/components/SvgIcon';
import Tooltip from '@/components/TippyTooltip';
import { useTheme } from '@/hooks';

import ButtonWrapper from './ButtonWrapper';

export type ActionButtonsProps = {
  color?: string;
  canRestart?: boolean;
  testEnded?: boolean;
  isMute?: boolean;
  noSend?: boolean;
  onReset: () => void;
  onMute: () => void;
  onSend: () => void;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  color,
  canRestart = false,
  testEnded = false,
  isMute = false,
  noSend = false,
  onReset,
  onMute,
  onSend,
}) => {
  const theme = useTheme();

  return (
    <Flex>
      {!testEnded && (
        <>
          <Tooltip title="Reset Test">
            <ButtonWrapper disabled={!canRestart} onClick={onReset}>
              <SvgIcon icon="restart" color={canRestart ? theme?.iconColors.active : theme?.iconColors.disabled} />
            </ButtonWrapper>
          </Tooltip>
          <Tooltip title="Mute Dialog Audio">
            <ButtonWrapper onClick={onMute}>
              <SvgIcon icon={isMute ? 'soundOff' : 'sound'} color={theme?.iconColors.active} />
            </ButtonWrapper>
          </Tooltip>
        </>
      )}
      {!noSend && !testEnded && (
        <ButtonWrapper color={color || theme?.colors.blue} onClick={onSend}>
          <SvgIcon icon="send" color={theme?.backgrounds.white} />
        </ButtonWrapper>
      )}
      {testEnded && (
        <ButtonWrapper color={color || theme?.colors.blue} onClick={onReset}>
          <SvgIcon icon="restart" color={theme?.backgrounds.white} />
        </ButtonWrapper>
      )}
    </Flex>
  );
};

export default ActionButtons;
