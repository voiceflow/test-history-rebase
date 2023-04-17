import { AudioPlayer, Box, Flex } from '@voiceflow/ui';
import React from 'react';

import BaseMessage, { BaseMessageProps } from '../../Base';
import { RECTANGLE_CLASS_ARRAY, WAVE_COLOR } from './constants';
import * as S from './styles';

interface AudioProps extends Omit<BaseMessageProps, 'iconProps'> {
  name: string;
  audio?: HTMLAudioElement;
  onPause?: VoidFunction;
  audioSrc: string;
  isCurrent: boolean;
  trackOnly?: boolean;
  allowPause?: boolean;
  onContinue?: VoidFunction;
}

const Audio: React.FC<AudioProps> = ({ audio, onPause, onContinue, audioSrc, name, isCurrent, trackOnly, allowPause, ...props }) => {
  const audioPlayer = AudioPlayer.useAudioPlayer({ audio: trackOnly ? audio : undefined, audioURL: audioSrc, trackOnly });

  const onTogglePlay = () => {
    if (trackOnly) return;

    audioPlayer.onToggle();
  };

  React.useEffect(() => {
    if (trackOnly) return undefined;

    if (audioPlayer.playing) {
      onPause?.();
    }

    const forcePause = () => audioPlayer.onPause();

    audio?.addEventListener('play', forcePause);

    return () => {
      audio?.removeEventListener('play', forcePause);
    };
  }, [trackOnly, audioPlayer.playing, audio]);

  return (
    <BaseMessage {...props} onClick={onTogglePlay}>
      <AudioPlayer.ProgressBar percent={audioPlayer.percent} style={{ backgroundColor: WAVE_COLOR, opacity: 0.12, top: 0 }} />

      <Flex style={{ position: 'relative' }}>
        <S.WaveContainer playing={audioPlayer.playing}>
          {RECTANGLE_CLASS_ARRAY.map((val, index) => (
            <div key={index} className={`rectangle-${val}`} />
          ))}
        </S.WaveContainer>

        <Box color="#8f8e94" fontSize={14}>
          {AudioPlayer.formatTime(audioPlayer.currentTime)}
        </Box>
      </Flex>
    </BaseMessage>
  );
};

export default Audio;
