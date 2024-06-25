import Box from '@ui/components/Box';
import TippyTooltip from '@ui/components/TippyTooltip';
import { swallowEvent } from '@ui/utils';
import React from 'react';

import {
  CloseButton,
  Container,
  DurationText,
  FileNameContainer,
  PausePlayButton,
  ProgressBar,
  TextContainer,
} from './components';
import useAudioPlayer from './useAudioPlayer';
import { formatTime } from './utils';

export interface AudioPlayerProps {
  link: string;
  title?: string;
  onClose: VoidFunction;
  autoplay?: boolean;
  className?: string;
  showDuration?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  link,
  title,
  onClose,
  autoplay = false,
  showDuration = false,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const audioPlayer = useAudioPlayer({ autoplay, audioURL: link });

  const jumpToTime = ({ clientX: xCoord }: { clientX: number }) => {
    if (!containerRef.current) return;

    const widthOfContainer = containerRef.current?.offsetWidth;
    const { x: containerXCoord } = containerRef.current.getBoundingClientRect();
    const xOfClick = xCoord - containerXCoord;
    const timePercent = xOfClick / widthOfContainer;

    audioPlayer.onSeek(timePercent * audioPlayer.duration);
  };

  return (
    <Container ref={containerRef} onClick={jumpToTime} className={className}>
      <ProgressBar percent={audioPlayer.percent} />

      <Box.Flex fullWidth>
        <PausePlayButton
          large
          onClick={swallowEvent(audioPlayer.onToggle)}
          icon={audioPlayer.playing ? 'pause' : 'playOutline'}
        />

        <TextContainer>
          <FileNameContainer>
            <TippyTooltip content={title} disabled={!title}>
              {title || 'Audio'}
            </TippyTooltip>
          </FileNameContainer>

          {showDuration && <DurationText>{formatTime(audioPlayer.duration)}</DurationText>}
        </TextContainer>
      </Box.Flex>

      {onClose && <CloseButton icon="close" size={10} onClick={swallowEvent(() => onClose())} />}
    </Container>
  );
};

export default Object.assign(AudioPlayer, {
  formatTime,
  ProgressBar,
  useAudioPlayer,
});
