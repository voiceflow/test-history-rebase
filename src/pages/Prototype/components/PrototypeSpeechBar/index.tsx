import React from 'react';

import { ClickableText } from '@/components/Text/components/ClickableText';
import { useHotKeys, useSpeechRecognition } from '@/hooks';
import { Hotkey } from '@/keymap';

import { BlueText, Container, SpeechText, SpokenText } from './components';

export type PrototypeSpeechBarProps = {
  locale: string;
  onTranscript: (input: string) => void;
  className?: string;
};

const PrototypeSpeechBar: React.FC<PrototypeSpeechBarProps> = ({ locale, onTranscript, className }) => {
  // TODO: use platform device type logic from CORE-5029 by Evgeny
  const isMobile = false;

  const {
    isListening,
    isSupported,
    finalTranscript,
    onStopListening,
    onStartListening,
    interimTranscript,
    onCheckMicrophonePermission,
    isMicrophonePermissionGranted,
  } = useSpeechRecognition({
    locale,
    onTranscript,
  });

  useHotKeys(Hotkey.USER_SPEECH, onStopListening, { action: 'keyup' });
  useHotKeys(Hotkey.USER_SPEECH, onStartListening, { action: 'keydown' });

  if (!isSupported) {
    return (
      <Container cursor="default" className={className}>
        <SpeechText>Browser doesn't support speech recognition</SpeechText>
      </Container>
    );
  }

  let text;
  if (!isMicrophonePermissionGranted) {
    text = (
      <>
        Please <ClickableText onClick={onCheckMicrophonePermission}>enable</ClickableText> microphone access
      </>
    );
  } else if (!isListening) {
    text = (
      <>
        Hold <BlueText>{isMobile ? 'here' : 'spacebar'}</BlueText> for Voice Input
      </>
    );
  } else {
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
    <Container onMouseDown={onStartListening} onMouseUp={onStopListening} className={className}>
      <SpeechText>{text}</SpeechText>
    </Container>
  );
};

export default PrototypeSpeechBar;
