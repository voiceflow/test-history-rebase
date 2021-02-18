import React from 'react';

import { useSpeechRecognition } from '@/hooks';

import { UncontrolledSpeechBar } from './components';

export { UncontrolledSpeechBar } from './components';

export type PrototypeSpeechBarProps = {
  locale: string;
  onTranscript: (input: string) => void;
};

const PrototypeSpeechBar: React.FC<PrototypeSpeechBarProps> = ({ locale, onTranscript }) => {
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
    askOnSetup: true,
    onTranscript,
  });

  return (
    <UncontrolledSpeechBar
      isListening={isListening}
      isSupported={isSupported}
      finalTranscript={finalTranscript}
      onStopListening={onStopListening}
      onStartListening={onStartListening}
      interimTranscript={interimTranscript}
      onCheckMicrophonePermission={onCheckMicrophonePermission}
      isMicrophonePermissionGranted={isMicrophonePermissionGranted}
    />
  );
};

export default PrototypeSpeechBar;
