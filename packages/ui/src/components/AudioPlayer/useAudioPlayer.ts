import { useEffect, useRef, useState } from 'react';

const NETWORK_NO_SOURCE = 3;

interface AudioPlayerProps {
  autoplay?: boolean;
  audioURL?: string;
  isUsingDOMElement?: boolean;
}

function useAudioPlayer({ autoplay = false, audioURL, isUsingDOMElement = false }: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [curTime, setCurTime] = useState<number>(0);
  const [playing, setPlaying] = useState(autoplay);
  const [clickedTime, setClickedTime] = useState<null | number>(null);
  const [error, setError] = useState<Event | null | string>(null);

  const resetState = () => {
    ref.current = null;
    setDuration(0);
    setPlaying(false);
    setClickedTime(null);
    setError(null);
  };

  useEffect(() => {
    if (isUsingDOMElement) return;
    if (audioURL) {
      ref.current = new Audio(audioURL);
    } else {
      resetState();
    }
  }, [audioURL]);

  useEffect(() => {
    const audio = ref.current;

    if (!audio) return;

    const stopAudio = () => {
      setPlaying(false);
      setCurTime(0);
    };

    const setAudioData = () => {
      setError(null);
      setDuration(audio.duration);
      setCurTime(audio.currentTime);
    };

    const onError: EventListenerOrEventListenerObject = (err) => setError(err);

    const setAudioTime = () => setCurTime(audio.currentTime);

    audio.addEventListener('error', onError);
    audio.addEventListener('suspend', onError);
    audio.addEventListener('stalled', onError);
    audio.addEventListener('ended', stopAudio);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    if (audio.networkState === NETWORK_NO_SOURCE) {
      setError('NETWORK_NO_SOURCE');
    }
    // eslint-disable-next-line consistent-return
    return () => {
      audio.removeEventListener('error', onError);
      audio.removeEventListener('suspend', onError);
      audio.removeEventListener('stalled', onError);
      audio.removeEventListener('ended', stopAudio);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [audioURL]);

  useEffect(() => {
    const audio = ref.current;

    if (!audio) {
      return;
    }

    if (playing) audio.play();
    else audio.pause();
  }, [playing]);

  useEffect(() => {
    const audio = ref.current;

    if (!audio) {
      return;
    }

    if (clickedTime && clickedTime !== curTime) {
      audio.currentTime = clickedTime;
      setClickedTime(null);
    }
  }, [clickedTime, curTime]);

  const restart = () => {
    if (!ref.current) return;

    const audio = ref.current;
    audio.currentTime = 0;
  };

  return {
    ref,
    error,
    curTime,
    duration,
    playing,
    setPlaying,
    setClickedTime,
    restart,
  };
}

export default useAudioPlayer;
