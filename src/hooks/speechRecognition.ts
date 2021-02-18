import React from 'react';
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from 'react-speech-recognition';

import { useCache } from './cache';
import { useTeardown } from './lifecycle';
import { useMicrophonePermission } from './microphone';

// eslint-disable-next-line import/prefer-default-export
export const useSpeechRecognition = ({
  locale,
  askOnSetup,
  onTranscript,
}: {
  locale?: string;
  askOnSetup?: boolean;
  onTranscript: (text: string) => void;
}) => {
  const [microphonePermissionGranted, checkMicrophonePermission] = useMicrophonePermission({ askOnSetup });
  const { listening, transcript, interimTranscript, finalTranscript, resetTranscript } = useReactSpeechRecognition({ clearTranscriptOnListen: true });

  const cache = useCache({
    locale,
    listening,
    transcript,
    onTranscript,
    microphonePermissionGranted,
  });

  const onStartListening = React.useCallback(async () => {
    if (cache.current.listening) {
      return;
    }

    if (!cache.current.microphonePermissionGranted) {
      const isGranted = await checkMicrophonePermission();

      if (!isGranted) {
        return;
      }
    }

    await SpeechRecognition.startListening({ language: cache.current.locale?.length === 5 ? cache.current.locale : undefined, continuous: true });
  }, []);

  const onStopListening = React.useCallback(() => {
    const trimmedTranscript = cache.current.transcript?.trim();

    SpeechRecognition.abortListening();
    resetTranscript();

    if (trimmedTranscript.trim()) {
      cache.current.onTranscript(trimmedTranscript);
    }
  }, []);

  useTeardown(() => SpeechRecognition.abortListening());

  return {
    transcript,
    isListening: listening,
    isSupported: SpeechRecognition.browserSupportsSpeechRecognition(),
    finalTranscript,
    onStopListening,
    onStartListening,
    interimTranscript,
    onCheckMicrophonePermission: checkMicrophonePermission,
    isMicrophonePermissionGranted: microphonePermissionGranted,
  };
};
