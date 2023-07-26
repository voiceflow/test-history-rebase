import { toast, useCache, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from 'react-speech-recognition';
import RecordRTC from 'recordrtc';
import { io, Socket } from 'socket.io-client';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import { BCP_LANGUAGE_CODE } from '@/constants';

import { useMicrophonePermission } from './microphone';

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
    resetTranscript();

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

  React.useEffect(() => {
    resetTranscript();

    return () => {
      SpeechRecognition.abortListening();
      resetTranscript();
    };
  }, []);

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

const TRANSCRIPTION_TIMEOUT = 3000;

export const useASR = ({ onTranscript, locale, enabled = true }: { onTranscript: (test: string) => void; locale: string; enabled?: boolean }) => {
  const [listeningASR, setListeningASR] = React.useState(false);
  const [processingTranscription, setProcessingTranscription] = React.useState(false);

  const streamRef = React.useRef<MediaStream | null>(null);
  const socketRef = React.useRef<Socket | null>(null);
  const recordRef = React.useRef<RecordRTC | null>(null);

  const persistedTranscript = usePersistFunction(onTranscript);

  React.useEffect(() => {
    const socket = io(GENERAL_SERVICE_ENDPOINT, {
      forceNew: true,
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('transcription', (transcriptData: { alternatives: { transcript: string }[]; isFinal: boolean }) => {
      const bestTranscription = transcriptData.alternatives[0]?.transcript;
      const { isFinal } = transcriptData;

      if (isFinal) {
        persistedTranscript(bestTranscription);
        setProcessingTranscription(false);
        onStop();
      }
    });

    socketRef.current = socket;

    return () => {
      socket.removeListener('transcription');
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let stream: MediaStream | null = null;

    (async () => {
      // to reuse single stream
      if (streamRef.current) {
        stream = streamRef.current;
        return;
      }

      try {
        stream = await window.navigator.mediaDevices.getUserMedia({ audio: true });

        const recordAudio = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/wav',
          timeSlice: 100,
          sampleRate: 44100,
          recorderType: RecordRTC.StereoAudioRecorder,
          desiredSampRate: 16000,
          ondataavailable: (blob) => socketRef.current?.emit('audioBlob', blob),
          numberOfAudioChannels: 1,
        });

        streamRef.current = stream;
        recordRef.current = recordAudio;
      } catch {
        toast.error('Error enabling microphone');
      }
    })();

    return () => {
      stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    };
  }, [enabled]);

  React.useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      recordRef.current?.stopRecording();
      recordRef.current?.destroy();
    },
    []
  );

  const onStart = React.useCallback(async () => {
    if (!enabled || listeningASR || !streamRef.current) {
      return;
    }

    setListeningASR(true);
    setProcessingTranscription(true);

    await socketRef.current?.emit('startTranscription', {
      languageCode: Object.values(BCP_LANGUAGE_CODE).includes(locale as BCP_LANGUAGE_CODE) ? locale : BCP_LANGUAGE_CODE.EN_US,
    });

    await recordRef.current?.startRecording();
  }, [locale, enabled, listeningASR]);

  const onStop = React.useCallback(async () => {
    if (!listeningASR) {
      return;
    }

    await socketRef.current?.emit('stopTranscription');
    await recordRef.current?.stopRecording();
    await recordRef.current?.reset();

    setListeningASR(false);

    // If there is no transcription, or if transcription takes too long, reset.
    if (processingTranscription) {
      setTimeout(() => setProcessingTranscription(false), TRANSCRIPTION_TIMEOUT);
    }
  }, [listeningASR, processingTranscription]);

  return {
    listening: listeningASR,
    onStopListening: onStop,
    onStartListening: onStart,
    processingTranscription,
  };
};
