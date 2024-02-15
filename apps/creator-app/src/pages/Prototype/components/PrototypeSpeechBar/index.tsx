import React from 'react';

import { useASR, useCanASR, useSpeechRecognition } from '@/hooks';

import { ASRSpeechBar, UncontrolledSpeechBar } from './components';

export { ASRSpeechBar, UncontrolledSpeechBar } from './components';

export interface PrototypeSpeechBarProps {
  locale: string;
  onTranscript: (input: string) => void;
}

const PrototypeSpeechBar: React.FC<PrototypeSpeechBarProps> = ({ locale, onTranscript }) => {
  const asr = useASR({ locale, onTranscript });
  const canUseASR = useCanASR();
  const speechRecognition = useSpeechRecognition({ locale, askOnSetup: true, onTranscript });

  return canUseASR ? (
    <ASRSpeechBar
      listening={asr.listening}
      onStopListening={asr.onStopListening}
      onStartListening={asr.onStartListening}
      processingTranscription={asr.processingTranscription}
      onCheckMicrophonePermission={speechRecognition.onCheckMicrophonePermission}
      isMicrophonePermissionGranted={speechRecognition.isMicrophonePermissionGranted}
    />
  ) : (
    <UncontrolledSpeechBar
      isListening={speechRecognition.isListening}
      isSupported={speechRecognition.isSupported}
      finalTranscript={speechRecognition.finalTranscript}
      onStopListening={speechRecognition.onStopListening}
      onStartListening={speechRecognition.onStartListening}
      interimTranscript={speechRecognition.interimTranscript}
      onCheckMicrophonePermission={speechRecognition.onCheckMicrophonePermission}
      isMicrophonePermissionGranted={speechRecognition.isMicrophonePermissionGranted}
    />
  );
};

export default PrototypeSpeechBar;
