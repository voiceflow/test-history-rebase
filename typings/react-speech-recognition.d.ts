declare module 'react-speech-recognition' {
  import React from 'react';
  import { Subtract } from 'utility-types';

  export type ReactSpeechRecognitionProps = {
    listening: boolean;
    transcript: string;
    recognition: SpeechRecognition | null;
    stopListening: () => void;
    startListening: () => void;
    abortListening: () => void;
    resetTranscript: () => void;
    finalTranscript: string;
    interimTranscript: string;
    browserSupportsSpeechRecognition: boolean;
  };

  const withReactSpeechRecognition: (data: {
    autoStart?: boolean;
  }) => <P extends ReactSpeechRecognitionProps>(Component: React.ComponentType<P>) => React.ComponentType<Subtract<P, ReactSpeechRecognitionProps>>;

  export default withReactSpeechRecognition;
}
