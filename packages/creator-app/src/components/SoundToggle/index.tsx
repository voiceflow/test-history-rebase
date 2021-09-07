import { PlatformType } from '@voiceflow/internal';
import { IconVariant, preventDefault, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { canUseSoundToggle } from '@/utils/prototype';

import ButtonWrapper from '../../pages/PublicPrototype/components/ChatDialog/components/ButtonWrapper';

interface SoundToggleProps {
  isMuted: boolean;
  size?: number;
  onClick: VoidFunction;
  preventButtonDefault?: boolean;
  clickable?: boolean;
  platform: PlatformType;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ platform, isMuted, size = 16, onClick, preventButtonDefault = false, clickable = true }) => {
  const canSeeToggle = canUseSoundToggle(platform);

  if (!canSeeToggle) return null;

  return (
    <TippyTooltip title={isMuted ? 'Unmute Dialog Audio' : 'Mute Dialog Audio'}>
      <ButtonWrapper onMouseDown={() => preventButtonDefault && preventDefault()} onClick={onClick}>
        <SvgIcon icon={isMuted ? 'soundOff' : 'sound'} size={size} variant={IconVariant.STANDARD} clickable={clickable} />
      </ButtonWrapper>
    </TippyTooltip>
  );
};

export default SoundToggle;
