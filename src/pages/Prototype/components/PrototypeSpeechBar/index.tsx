import React from 'react';
import withSpeechRecognition, { ReactSpeechRecognitionProps } from 'react-speech-recognition';

import Portal from '@/components/Portal';
import SvgIcon from '@/components/SvgIcon';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

import { Container, Content, IconContainer } from './components';
import { askMicrophonePermissions, checkMicrophonePermission } from './utils';

export type PrototypeSpeechBarProps = {
  locale: string;
  isPublic?: boolean;
  onTranscript: (input: string) => void;
  onToggleListening: (value: boolean) => void;
};

const PrototypeSpeechBar: React.FC<ReactSpeechRecognitionProps & PrototypeSpeechBarProps> = ({
  locale,
  isPublic,
  listening,
  transcript,
  recognition,
  onTranscript,
  stopListening,
  startListening,
  finalTranscript,
  resetTranscript,
  onToggleListening,
  interimTranscript,
  browserSupportsSpeechRecognition,
}) => {
  const [isMicrophoneAvailable, setMicrophoneAvailable] = React.useState(false);

  const dataCache = React.useRef({
    locale,
    listening,
    transcript,
    recognition,
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
    onTranscript,
    stopListening,
    startListening,
    resetTranscript,
    finalTranscript,
    interimTranscript,
    isMicrophoneAvailable,
  };

  const onListen = React.useCallback(async () => {
    if (dataCache.current.listening) {
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

  useHotKeys(Hotkey.USER_SPEECH, () => {
    onListen();
  });

  React.useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    checkMicrophonePermission().then(setMicrophoneAvailable);

    return () => stopListening();
  }, []);

  React.useEffect(() => {
    onToggleListening(listening);
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  let text;

  if (!isMicrophoneAvailable) {
    text = <span>Please enable Voiceflow access to the microphone</span>;
  } else if (!listening) {
    text = 'Hold Spacebar for Voice Input';
  } else if (listening) {
    if (finalTranscript || interimTranscript) {
      text = (
        <>
          <span>{finalTranscript}</span> {interimTranscript}
        </>
      );
    } else {
      text = 'Say Something...';
    }
  }

  return (
    <Portal portalNode={document.body}>
      <Container isPublic={isPublic}>
        <Content onMouseDown={onListen} onMouseUp={onStop} isListening={listening}>
          <IconContainer isListening={listening}>
            <SvgIcon icon="microphone" color="#fff" size={16} />
          </IconContainer>

          {text}
        </Content>
      </Container>
    </Portal>
  );
};

export default withSpeechRecognition({ autoStart: false })(PrototypeSpeechBar);
