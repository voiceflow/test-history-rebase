import { stopPropagation, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import { PlayButtonContainer, PlayButtonIcon } from '../styles';

interface PlayButtonProps {
  content?: string | null;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ content, playing, onPlay, onStop }) => {
  const [hovered, setHovered] = React.useState(false);
  const hasContent = !!content;

  const handleMouseEnter = () => {
    if (!hasContent) return;

    setHovered(true);
  };

  const handleMouseLeave = () => {
    if (!hasContent) return;

    setHovered(false);
  };

  const handleClick = () => {
    if (playing) {
      onStop();
    } else {
      onPlay();
    }
  };

  let icon: SvgIconTypes.Icon = hovered ? 'playOutline' : 'audio';

  if (playing) {
    icon = 'pause';
  }

  return (
    <PlayButtonContainer
      $playing={playing}
      $hasContent={hasContent}
      onClick={stopPropagation(hasContent ? handleClick : null)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <PlayButtonIcon icon={icon} size={16} color="#62778c" />
    </PlayButtonContainer>
  );
};

export default PlayButton;
