import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import { ButtonVariant, preventDefault, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import ActionButton from '../../pages/PublicPrototype/components/ChatDialog/components/ActionButton';

interface SoundToggleProps {
  size?: number;
  isMuted: boolean;
  onClick: VoidFunction;
  isMobile?: boolean;
  projectType: Platform.Constants.ProjectType;
  preventButtonDefault?: boolean;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ projectType, isMuted, size = 16, onClick, preventButtonDefault = false, isMobile }) => {
  const canSeeToggle = Utils.typeGuards.isVoiceProjectType(projectType);

  if (!canSeeToggle) return null;

  return (
    <TippyTooltip content={isMuted ? 'Unmute Dialog Audio' : 'Mute Dialog Audio'}>
      <ActionButton
        square
        isGray
        onClick={onClick}
        variant={ButtonVariant.TERTIARY}
        isMobile={isMobile}
        squareRadius
        onMouseDown={() => preventButtonDefault && preventDefault()}
      >
        <SvgIcon icon={isMuted ? 'soundOff' : 'sound'} size={size} />
      </ActionButton>
    </TippyTooltip>
  );
};

export default SoundToggle;
