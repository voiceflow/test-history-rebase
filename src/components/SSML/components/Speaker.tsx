import React from 'react';
import { Tooltip } from 'react-tippy';

import client from '@/client';
import SvgIcon from '@/components/SvgIcon';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { useFeature } from '@/hooks';
import { useEnableDisable } from '@/hooks/toggle';
import { ClassName } from '@/styles/constants';

import SpeakerWrapper from './SpeakerWrapper';

type SpeakerProps = {
  voice: string;
  platform?: PlatformType;
  setError?: (error?: string) => void;
  getSSMLToPlay: () => string;
};

const Speaker: React.FC<SpeakerProps> = ({ voice, platform, setError, getSSMLToPlay }) => {
  const audio = React.useMemo(() => new Audio(), []);
  const [audioArray, setAudioArray] = React.useState<string[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = React.useState<number>(0);
  const cashedSSML = React.useRef('');
  const [loading, enableLoading, disableLoading] = useEnableDisable(false);
  const [playing, enablePlaying, disablePlaying] = useEnableDisable(false);
  const ttsVoices = useFeature(FeatureFlag.TTS_VOICES);

  const onSpeak = async () => {
    if (playing) {
      audio.pause();
      disablePlaying();
      return;
    }

    const ssml = getSSMLToPlay();

    if (!ssml.trim()) {
      return;
    }

    const ssmlToSpeak = voice + ssml;

    // if nothing has changed in the text ssml don't make the call but instead just replay the current audio
    if (cashedSSML.current === ssmlToSpeak) {
      try {
        audio.currentTime = 0;
        audio.play();

        disableLoading();
        enablePlaying();
        return;
      } catch (err) {
        console.error(err);
      }
    }

    enableLoading();

    try {
      let src;

      if (ttsVoices.isEnabled) {
        const audioDataArray = await client.platform.general.tts.convert({ ssml, voiceID: voice, platform });
        const audioSrcArray: string[] = [];

        audioDataArray?.forEach((data) => {
          if (data?.src) {
            audioSrcArray.push(data.src);
          }
        });

        setAudioArray(audioSrcArray);
        audio.src = audioSrcArray[currentAudioIndex];
      } else {
        src = await client.prototype.getSpeakAudio({ ssml, voice: voice === 'Alexa' ? '_DEFAULT' : voice });
        audio.src = src;
      }

      enablePlaying();

      audio.play();
      cashedSSML.current = ssmlToSpeak;
    } catch (err) {
      setError?.('Unable to play SSML');
    }

    disableLoading();
  };

  React.useEffect(() => {
    audio.onended = () => {
      if (currentAudioIndex >= audioArray.length - 1) {
        setCurrentAudioIndex(0);
        setAudioArray([]);
        disablePlaying();
      } else {
        setCurrentAudioIndex(currentAudioIndex + 1);
        audio.src = audioArray[currentAudioIndex + 1];
        audio.play();
      }
    };
  }, [audioArray, currentAudioIndex]);

  React.useEffect(() => {
    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  }, [audio, disablePlaying]);

  // eslint-disable-next-line no-nested-ternary
  const icon = loading ? 'loader' : playing ? 'stopCircle' : 'sound';

  return (
    <Tooltip title={playing ? 'Stop' : 'Play'} position="top">
      <SpeakerWrapper isPlaying={playing}>
        <SvgIcon className={ClassName.SSML_PLAY_AUDIO} onClick={onSpeak} icon={icon} size={loading || !playing ? 14 : 16} />
      </SpeakerWrapper>
    </Tooltip>
  );
};

export default React.memo(Speaker);
