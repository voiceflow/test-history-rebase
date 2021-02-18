import React from 'react';
import withSpeechRecognition, { ReactSpeechRecognitionProps } from 'react-speech-recognition';

import { ClickableText } from '@/components/Text/components/ClickableText';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

import { BlueText, Container, SpeechText, SpokenText } from './components';
import { askMicrophonePermissions, checkMicrophonePermission } from './utils';

export type PrototypeSpeechBarProps = {
  locale: string;
  isPublic?: boolean;
  onTranscript: (input: string) => void;
  className?: string;
};

const PrototypeSpeechBar: React.FC<ReactSpeechRecognitionProps & PrototypeSpeechBarProps> = ({
  locale,
  listening,
  transcript,
  className,
  recognition,
  onTranscript,
  stopListening,
  startListening,
  finalTranscript,
  resetTranscript,
  interimTranscript,
  browserSupportsSpeechRecognition,
}) => {
  const [isMicrophoneAvailable, setMicrophoneAvailable] = React.useState(false);
  // TODO: use platform device type logic from CORE-5029 by Evgeny
  const isMobile = false;

  const dataCache = React.useRef({
    locale,
    listening,
    transcript,
    recognition,
    className,
    onTranscript,
    finalTranscript,
    stopListening,
    startListening,
    resetTranscript,
    interimTranscript,
    isMicrophoneAvailable,
  });

  dataCache.current = {
    locale,
    listening,
    transcript,
    recognition,
    className,
    onTranscript,
    stopListening,
    startListening,
    resetTranscript,
    finalTranscript,
    interimTranscript,
    isMicrophoneAvailable,
  };

  const onListen = React.useCallback(async () => {
    if (listening) {
      return;
    }

    if (!dataCache.current.isMicrophoneAvailable) {
      const isGranted = await askMicrophonePermissions();

      setMicrophoneAvailable(isGranted);

      if (!isGranted) {
        return;
      }
    }

    if (dataCache.current.locale && dataCache.current.locale.length === 5) {
      dataCache.current.recognition!.lang = locale;
    }

    dataCache.current.startListening();
  }, []);

  const onStop = React.useCallback(() => {
    const { transcript } = dataCache.current;

    dataCache.current.resetTranscript();
    dataCache.current.stopListening();

    if (transcript.trim()) {
      dataCache.current.onTranscript(transcript);
    }
  }, []);

  useHotKeys(Hotkey.USER_SPEECH, onStop, { action: 'keyup' });
  useHotKeys(Hotkey.USER_SPEECH, onListen, { action: 'keydown' });

  React.useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    checkMicrophonePermission().then(setMicrophoneAvailable);
    return () => stopListening();
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <Container cursor="default" className={className}>
        <SpeechText> Browser doesn't support speech recognition</SpeechText>
      </Container>
    );
  }

  let text;
  if (!isMicrophoneAvailable) {
    text = (
      <>
        Please <ClickableText onClick={askMicrophonePermissions}>enable</ClickableText> microphone access
      </>
    );
  } else if (!listening) {
    text = (
      <>
        Hold <BlueText>{isMobile ? 'here' : 'spacebar'}</BlueText> for Voice Input
      </>
    );
  } else if (listening) {
    if (finalTranscript || interimTranscript) {
      text = (
        <>
          <SpokenText>
            {finalTranscript} {interimTranscript}
          </SpokenText>
        </>
      );
    } else {
      text = 'Say something...';
    }
  }

  return (
    <Container onMouseDown={onListen} onMouseUp={onStop} className={className}>
      <SpeechText>{text}</SpeechText>
    </Container>
  );
};

export default withSpeechRecognition({ autoStart: false })(PrototypeSpeechBar);
