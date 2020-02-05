import React from 'react';
import { Tooltip } from 'react-tippy';

import client from '@/client';
import SvgIcon from '@/components/SvgIcon';
import { useEnableDisable } from '@/hooks/toggle';

import SpeakerWrapper from './SpeakerWrapper';

function Speaker({ voice, setError, getSSMLToPlay }) {
  const audio = React.useMemo(() => new Audio(), []);
  const cashedSSML = React.useRef();
  const [loading, enableLoading, disableLoading] = useEnableDisable(false);
  const [playing, enablePlaying, disablePlaying] = useEnableDisable(false);

  const onSpeak = async () => {
    if (playing) {
      audio.pause();
      disablePlaying();
      return;
    }

    const ssml = getSSMLToPlay();

    if (!ssml.trim()) return;

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
      const src = await client.testing.getSpeakAudio({ ssml, voice: voice === 'Alexa' ? '_DEFAULT' : voice });

      enablePlaying();

      cashedSSML.current = ssmlToSpeak;

      audio.src = src;
      audio.play();
    } catch (err) {
      setError?.('Unable to play SSML');
    }

    disableLoading();
  };

  React.useEffect(() => {
    audio.onended = () => disablePlaying();

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
      <SpeakerWrapper>
        <SvgIcon onClick={onSpeak} icon={icon} size={loading || !playing ? 14 : 16} />
      </SpeakerWrapper>
    </Tooltip>
  );
}

export default React.memo(Speaker);
