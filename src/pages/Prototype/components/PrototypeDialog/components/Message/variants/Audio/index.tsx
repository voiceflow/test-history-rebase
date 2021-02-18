import React from 'react';

import { ProgressBar } from '@/components/AudioPlayer/components/index';
import { formatTime } from '@/components/AudioPlayer/index';
import Box from '@/components/Box';
import Flex from '@/components/Flex';
import useAudioPlayer from '@/hooks/audioPlayer';

import { Message } from '../../components';
import { MessageProps } from '../../components/Message';
import { RECTANGLE_CLASS_ARRAY, WAVE_COLOR } from './constants';
import { WaveContainer } from './styles';

type AudioProps = Omit<MessageProps, 'iconProps'> & {
  name: string;
  isCurrent: boolean;
  onPlay: () => void;
  audioSrc: string;
};

const Audio: React.FC<AudioProps> = ({ onPlay, audioSrc, name, isCurrent, ...props }) => {
  const { ref, curTime, playing, duration, setPlaying, restart } = useAudioPlayer({ autoplay: true });
  const audioRef: any = ref;

  const onClickHandler = () => {
    onPlay();
    restart();
    setPlaying(true);
  };

  const percent = (curTime! / duration!) * 100;

  return (
    <Message {...props} onClick={onClickHandler}>
      {playing && <ProgressBar percent={percent} style={{ backgroundColor: WAVE_COLOR, opacity: 0.12, top: 0 }} />}
      <Flex style={{ position: 'relative' }}>
        <WaveContainer playing={playing}>
          {RECTANGLE_CLASS_ARRAY.map((val, index) => {
            return <div key={index} className={`rectangle-${val}`} />;
          })}
        </WaveContainer>
        <Box color="#8f8e94" fontSize={14}>
          {formatTime(curTime)}
        </Box>
      </Flex>
      <audio ref={audioRef} muted={true}>
        <source src={audioSrc} type="audio/mpeg" />
      </audio>
    </Message>
  );
};

export default Audio;
