import Flex from '@ui/components/Flex';
import { swallowEvent } from '@ui/utils';
import React from 'react';
import { Tooltip } from 'react-tippy';

import { CloseButton, Container, DurationText, FileNameContainer, PausePlayButton, ProgressBar } from './components';
import useAudioPlayer from './useAudioPlayer';
import { formatTime } from './utils';

export interface AudioPlayerProps {
  link: string;
  title?: string;
  onClose: VoidFunction;
  autoplay?: boolean;
  showDuration?: boolean;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ link, title, onClose, autoplay = false, showDuration = false, className }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const { ref: audioElementRef, curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer({ autoplay });

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

      <Flex fullWidth>
        <PausePlayButton large onClick={swallowEvent(() => setPlaying(!playing))} icon={playing ? 'pause' : 'play'} />

        <FileNameContainer>
          <Tooltip title={title}>{title || 'Audio'}</Tooltip>
        </FileNameContainer>
      </Flex>

      {showDuration && (
        <DurationText>
          {formatTime(curTime)} | {formatTime(duration)}
        </DurationText>
      )}
      {onClose && <CloseButton icon="close" size={10} onClick={swallowEvent(() => onClose())} />}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioElementRef}>
        <source src={link} type="audio/mpeg" />
      </audio>
    </Container>
  );
};

export default Object.assign(AudioPlayer, {
  ProgressBar,
  formatTime,
  useAudioPlayer,
});
