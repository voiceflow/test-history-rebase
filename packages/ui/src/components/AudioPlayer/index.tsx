import Box from '@ui/components/Box';
import TippyTooltip from '@ui/components/TippyTooltip';
import { swallowEvent } from '@ui/utils';
import React from 'react';

import { CloseButton, Container, DurationText, FileNameContainer, PausePlayButton, ProgressBar, TextContainer } from './components';
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

const AudioPlayer: React.FC<AudioPlayerProps> = ({ link, title, onClose, autoplay = false, showDuration = false, className }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const { curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer({ autoplay, audioURL: link });

  const jumpToTime = ({ clientX: xCoord }: { clientX: number }) => {
    if (!containerRef.current) return;

    const widthOfContainer = containerRef.current?.offsetWidth;
    const { x: containerXCoord } = containerRef.current.getBoundingClientRect();
    const xOfClick = xCoord - containerXCoord;
    const timePercent = xOfClick / widthOfContainer;
    setClickedTime(timePercent * duration);
  };

  const percent = (curTime / duration) * 100;

  return (
    <Container ref={containerRef} onClick={jumpToTime} className={className}>
      <ProgressBar percent={percent} />

      <Box.Flex fullWidth>
        <PausePlayButton large onClick={swallowEvent(() => setPlaying(!playing))} icon={playing ? 'pause' : 'playOutline'} />

        <TextContainer>
          <FileNameContainer>
            <TippyTooltip title={title} disabled={!title}>
              {title || 'Audio'}
            </TippyTooltip>
          </FileNameContainer>

          {showDuration && <DurationText>{formatTime(duration)}</DurationText>}
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
