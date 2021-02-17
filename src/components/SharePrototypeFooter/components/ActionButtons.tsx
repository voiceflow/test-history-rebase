import React from 'react';
import { Tooltip } from 'react-tippy';

import { ActionButtonContainer } from '@/components/SharePrototypeFooter/components/index';
import SvgIcon, { IconVariant } from '@/components/SvgIcon';
import { noop } from '@/utils/functional';

type ActionButtons = {
  isMuted: boolean;
  canRestart: boolean;
  resetTest: () => void;
  goFullscreen: () => void;
};

const ActionButtons: React.FC<ActionButtons> = ({ canRestart, resetTest, isMuted, goFullscreen }) => {
  return (
    <>
      <ActionButtonContainer>
        <Tooltip title="Fullscreen F">
          <SvgIcon variant={IconVariant.STANDARD} size={18} icon="fullscreen" clickable onClick={goFullscreen} />
        </Tooltip>
      </ActionButtonContainer>

      <ActionButtonContainer>
        <Tooltip title={isMuted ? 'Unmute Dialog Audio' : 'Mute Dialog Audio'}>
          <SvgIcon variant={IconVariant.STANDARD} icon={isMuted ? 'soundOff' : 'sound'} clickable size={18} onClick={noop} />
        </Tooltip>
      </ActionButtonContainer>
      <ActionButtonContainer>
        <Tooltip title="Reset Test">
          <SvgIcon
            variant={IconVariant.STANDARD}
            icon="restart"
            size={18}
            color={canRestart ? undefined : '#BECEDC'}
            clickable={canRestart}
            onClick={() => (canRestart ? resetTest() : null)}
          />
        </Tooltip>
      </ActionButtonContainer>
    </>
  );
};

export default ActionButtons;
