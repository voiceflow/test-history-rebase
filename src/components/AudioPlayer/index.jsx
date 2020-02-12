import _ from 'lodash';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Flex from '@/components/Flex';
import useAudioPlayer from '@/hooks/audioPlayer';
import { getAudioTitle } from '@/utils/audio';
import { swallowEvent } from '@/utils/dom';

import { CloseButton, Container, DurationText, FileNameContainer, PausePlayButton, ProgressBar } from './components';

const formatDigit = (number) => {
  const flooredNumber = Math.floor(number);
  return `0${flooredNumber}`.slice(-2);
};

const formatTime = (num) => {
  if (!_.isNumber(num)) {
    return '00:00';
  }
  const minutes = formatDigit(Math.floor(num / 60 / 60));
  const seconds = formatDigit(num % 60);
  return `${minutes}:${seconds}`;
};

function AudioPlayer({ link, onClose, autoplay = false, showDuration = false }) {
  const containerRef = React.useRef();

  const { ref: audioElementRef, curTime, duration, playing, setPlaying, setClickedTime } = useAudioPlayer({ autoplay });

  const jumpToTime = ({ clientX: xCoord }) => {
    const widthOfContainer = containerRef.current.offsetWidth;
    const { x: containerXCoord } = containerRef.current.getBoundingClientRect();
    const xOfClick = xCoord - containerXCoord;
    const timePercent = xOfClick / widthOfContainer;
    setClickedTime(timePercent * duration);
  };

  const audioDuration = React.useMemo(() => {
    return duration;
  }, [duration]);

  const percent = (curTime / audioDuration) * 100;

  return (
    <Container ref={containerRef} onClick={jumpToTime}>
      <ProgressBar percent={percent} />

      <Flex fullWidth>
        <PausePlayButton large onClick={swallowEvent(() => setPlaying(!playing))} icon={playing ? 'pause' : 'play'} />

        <FileNameContainer>
          <Tooltip title={link}>{getAudioTitle(link)}</Tooltip>
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
}

export default AudioPlayer;
