import { stopPropagation, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface PlayButtonProps {
  content?: string | null;
  playing: boolean;
  onToggle: VoidFunction;
}

const PlayButton: React.FC<PlayButtonProps> = ({ content, playing, onToggle }) => {
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

  let icon: SvgIconTypes.Icon = hovered ? 'playOutline' : 'audio';

  if (playing) {
    icon = 'pause';
  }

  return (
    <S.Container
      onClick={stopPropagation(hasContent ? onToggle : null)}
      $playing={playing}
      $hasContent={hasContent}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <S.Icon icon={icon} size={16} color="#62778c" />
    </S.Container>
  );
};

export default PlayButton;
