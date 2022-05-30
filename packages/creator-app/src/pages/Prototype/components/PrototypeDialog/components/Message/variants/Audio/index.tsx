import { AudioPlayer, Box, Flex } from '@voiceflow/ui';
import React from 'react';

import { Message } from '../../components';
import { MessageProps } from '../../components/Message';
import { RECTANGLE_CLASS_ARRAY, WAVE_COLOR } from './constants';
import { WaveContainer } from './styles';

type AudioProps = Omit<MessageProps, 'iconProps'> & {
  name: string;
  isCurrent: boolean;
  onPlay: () => void;
  audioSrc: string;
  allowPause?: boolean;
  autoplay?: boolean;
};

const Audio: React.FC<AudioProps> = ({ onPlay, audioSrc, autoplay = true, name, isCurrent, allowPause, ...props }) => {
  const { curTime, playing, duration, setPlaying, restart } = AudioPlayer.useAudioPlayer({ autoplay, audioURL: audioSrc });

  const onClickHandler = () => {
    if (allowPause) {
      setPlaying(!playing);
      return;
    }

    onPlay();
    restart();
    setPlaying(true);
  };

  const percent = (curTime! / duration!) * 100;

  return (
    <Message {...props} onClick={onClickHandler}>
      {(playing || allowPause) && <AudioPlayer.ProgressBar percent={percent} style={{ backgroundColor: WAVE_COLOR, opacity: 0.12, top: 0 }} />}
      <Flex style={{ position: 'relative' }}>
        <WaveContainer playing={playing}>
          {RECTANGLE_CLASS_ARRAY.map((val, index) => (
            <div key={index} className={`rectangle-${val}`} />
          ))}
        </WaveContainer>
        <Box color="#8f8e94" fontSize={14}>
          {AudioPlayer.formatTime(curTime)}
        </Box>
      </Flex>
    </Message>
  );
};

export default Audio;
