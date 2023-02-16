import React from 'react';

import { useCanASR, useSpeechRecognition } from '@/hooks';

import { ASRSpeechbar, UncontrolledSpeechBar } from './components';

export { ASRSpeechbar, UncontrolledSpeechBar } from './components';

export interface PrototypeSpeechBarProps {
  locale: string;
  onTranscript: (input: string) => void;
}

const PrototypeSpeechBar: React.FC<PrototypeSpeechBarProps> = ({ locale, onTranscript }) => {
  const [canUseASR] = useCanASR();

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

  if (canUseASR) {
    return (
      <ASRSpeechbar
        onTranscript={onTranscript}
        onCheckMicrophonePermission={onCheckMicrophonePermission}
        locale={locale}
        isMicrophonePermissionGranted={isMicrophonePermissionGranted}
      />
    );
  }

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
