import { IconVariant, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import ActionButtonContainer from './ActionButtonContainer';

interface ActionButtons {
  onMute: () => void;
  isMuted: boolean;
  onReset: () => void;
  onFullScreen: () => void;
}

const ActionButtons: React.FC<ActionButtons> = ({ onMute, onReset, isMuted, onFullScreen }) => (
  <>
    <ActionButtonContainer>
      <TippyTooltip title="Fullscreen" hotkey="F">
        <SvgIcon variant={IconVariant.STANDARD} size={18} icon="fullscreen" clickable onClick={onFullScreen} />
      </TippyTooltip>
    </ActionButtonContainer>

    <ActionButtonContainer>
      <TippyTooltip title={isMuted ? 'Unmute Dialog Audio' : 'Mute Dialog Audio'}>
        <SvgIcon variant={IconVariant.STANDARD} icon={isMuted ? 'soundOff' : 'sound'} clickable size={18} onClick={onMute} />
      </TippyTooltip>
    </ActionButtonContainer>

    <ActionButtonContainer>
      <TippyTooltip title="Reset Test">
        <SvgIcon icon="restart" size={18} variant={IconVariant.STANDARD} onClick={onReset} clickable />
      </TippyTooltip>
    </ActionButtonContainer>
  </>
);

export default ActionButtons;
