import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import SoundToggle from '@/components/SoundToggle';
import { prototypeSelector } from '@/ducks/prototype';
import { useSelector } from '@/hooks';

import ActionButtonContainer from './ActionButtonContainer';

interface ActionButtons {
  onMute: () => void;
  isMuted: boolean;
  onReset: () => void;
  onFullScreen: () => void;
}

const ActionButtons: React.FC<ActionButtons> = ({ onMute, onReset, isMuted, onFullScreen }) => {
  const { projectType } = useSelector(prototypeSelector);
  const canSeeSoundToggle = Realtime.Utils.typeGuards.isChatProjectType(projectType);

  return (
    <>
      <ActionButtonContainer>
        <TippyTooltip content={<TippyTooltip.WithHotkey hotkey="F">Fullscreen</TippyTooltip.WithHotkey>}>
          <SvgIcon variant={SvgIcon.Variant.STANDARD} size={18} icon="fullscreen" clickable onClick={onFullScreen} />
        </TippyTooltip>
      </ActionButtonContainer>

      {canSeeSoundToggle && (
        <ActionButtonContainer>
          <SoundToggle projectType={projectType!} isMuted={isMuted} onClick={onMute} />
        </ActionButtonContainer>
      )}

      <ActionButtonContainer>
        <TippyTooltip content="Reset Test">
          <SvgIcon icon="randomLoop" size={18} variant={SvgIcon.Variant.STANDARD} onClick={onReset} clickable />
        </TippyTooltip>
      </ActionButtonContainer>
    </>
  );
};

export default ActionButtons;
