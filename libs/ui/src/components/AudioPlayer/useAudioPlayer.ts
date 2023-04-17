import React from 'react';

const NETWORK_NO_SOURCE = 3;

interface AudioPlayerProps {
  audio?: HTMLAudioElement;
  autoplay?: boolean;
  audioURL?: string | null;
  trackOnly?: boolean;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function useAudioPlayer({ audio: audioProp, autoplay = false, audioURL, trackOnly }: AudioPlayerProps = {}) {
  const audio = React.useMemo(() => audioProp ?? new Audio(), [audioProp]);

  const [error, setError] = React.useState<Event | null | string>(null);
  const [playing, setPlaying] = React.useState(!audioProp ? false : !audioProp.paused);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);

  const onPlay = () => {
    if (trackOnly) return;

    audio.play();
  };

  const onPause = () => {
    if (trackOnly) return;

    audio.pause();
  };

  const onToggle = () => {
    if (trackOnly) return;

    if (playing) {
      onPause();
    } else {
      onPlay();
    }
  };

  const onSeek = (time: number) => {
    if (trackOnly) return;

    if (time && time !== currentTime) {
      audio.currentTime = time;
    }
  };

  const onRestart = () => {
    if (trackOnly) return;

    audio.currentTime = 0;
  };

  React.useEffect(() => {
    if (!trackOnly) {
      audio.currentTime = 0;
    }

    setError(null);
    setPlaying(false);
    setDuration(0);
    setCurrentTime(audio.currentTime);

    return onPause;
  }, [audio]);

  React.useEffect(() => {
    if (audioURL && !trackOnly) {
      audio.src = audioURL;
    }

    if (playing === !audio.paused) {
      setPlaying(!audio.paused);
    }

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    const onEnded = () => {
      audio.currentTime = 0;

      setPlaying(false);
      setCurrentTime(0);
    };

    const onLoadedData = () => {
      setError(null);
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const onError: EventListenerOrEventListenerObject = (err) => {
      onEnded();
      setError(err);
    };

    const onTimeUpdated = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('stalled', onError);
    audio.addEventListener('loadeddata', onLoadedData);
    audio.addEventListener('timeupdate', onTimeUpdated);

    if (audio.networkState === NETWORK_NO_SOURCE) setError('NETWORK_NO_SOURCE');

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('stalled', onError);
      audio.removeEventListener('loadeddata', onLoadedData);
      audio.removeEventListener('timeupdate', onTimeUpdated);
    };
  }, [audio, audioURL]);

  React.useEffect(() => {
    if (autoplay) onPlay();
  }, []);

  return {
    error,
    onPlay,
    onSeek,
    onPause,
    percent: (currentTime / duration) * 100,
    playing,
    duration,
    onToggle,
    onRestart,
    currentTime,
  };
}

export default useAudioPlayer;
