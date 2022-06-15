import { stopPropagation, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import { PlayButtonContainer, PlayButtonIcon } from '../styles';

interface PlayButtonProps {
  content?: string | null;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}

const PlayButtonIcons: Record<string, SvgIconTypes.Icon> = {
  STOP: 'stopOutline',
  PLAY: 'playV2',
  AUDIO: 'audio',
};

const PlayButton: React.FC<PlayButtonProps> = ({ content, playing, onPlay, onStop }) => {
  const [playVersion, showPlayVersion] = React.useState(false);
  const hasContent = !!content;
  let icon = playVersion ? PlayButtonIcons.PLAY : PlayButtonIcons.AUDIO;

  if (playing) {
    icon = PlayButtonIcons.STOP;
  }

  const handleMouseEnter = () => {
    if (!hasContent) return;
    showPlayVersion(true);
  };

  const handleMouseLeave = () => {
    if (playing || !hasContent) return;
    showPlayVersion(false);
    onStop();
  };

  const handleClick = stopPropagation(() => {
    if (playing) {
      onStop();
    } else {
      onPlay();
    }
  });

  React.useLayoutEffect(() => {
    if (!playing) {
      showPlayVersion(false);
    }
  }, [playing]);

  return (
    <PlayButtonContainer
      $hasContent={hasContent}
      $playing={playing}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={hasContent ? handleClick : () => {}}
    >
      <PlayButtonIcon icon={icon} size={16} color="#62778c" />
    </PlayButtonContainer>
  );
};

export default PlayButton;
