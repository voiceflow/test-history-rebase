import { useEffect, useRef, useState } from 'react';

const NETWORK_NO_SOURCE = 3;

function useAudioPlayer({ autoplay = false }) {
  const ref = useRef();
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();
  const [playing, setPlaying] = useState(autoplay);
  const [clickedTime, setClickedTime] = useState();
  const [error, setError] = useState(null);

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

    const onError = (err) => {
      setError(err);
    };

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
  }, []);

  useEffect(() => {
    const audio = ref.current;

    if (!audio) {
      return;
    }

    playing ? audio.play() : audio.pause();
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

  return {
    ref,
    error,
    curTime,
    duration,
    playing,
    setPlaying,
    setClickedTime,
  };
}

export default useAudioPlayer;
