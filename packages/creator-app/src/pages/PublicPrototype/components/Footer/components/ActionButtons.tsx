import { IconVariant, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import SoundToggle from '@/components/SoundToggle';
import { prototypeSelector } from '@/ducks/prototype';
import { useSelector } from '@/hooks';
import { canUseSoundToggle } from '@/utils/prototype';

import ActionButtonContainer from './ActionButtonContainer';

interface ActionButtons {
  onMute: () => void;
  isMuted: boolean;
  onReset: () => void;
  onFullScreen: () => void;
}

const ActionButtons: React.FC<ActionButtons> = ({ onMute, onReset, isMuted, onFullScreen }) => {
  const { platform } = useSelector(prototypeSelector);
  const canSeeSoundToggle = canUseSoundToggle(platform!);

  return (
    <>
      <ActionButtonContainer>
        <TippyTooltip title="Fullscreen" hotkey="F">
          <SvgIcon variant={IconVariant.STANDARD} size={18} icon="fullscreen" clickable onClick={onFullScreen} />
        </TippyTooltip>
      </ActionButtonContainer>

      {canSeeSoundToggle && (
        <ActionButtonContainer>
          <SoundToggle platform={platform!} isMuted={isMuted} onClick={onMute} />
        </ActionButtonContainer>
      )}

      <ActionButtonContainer>
        <TippyTooltip title="Reset Test">
          <SvgIcon icon="restart" size={18} variant={IconVariant.STANDARD} onClick={onReset} clickable />
        </TippyTooltip>
      </ActionButtonContainer>
    </>
  );
};

export default ActionButtons;
