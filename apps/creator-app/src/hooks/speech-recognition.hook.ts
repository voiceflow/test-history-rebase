import * as Realtime from '@voiceflow/realtime-sdk';
import { toast, useCache, usePersistFunction } from '@voiceflow/ui';
import { useCreateConst } from '@voiceflow/ui-next';
import React from 'react';
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from 'react-speech-recognition';
import RecordRTC from 'recordrtc';
import { io, Socket } from 'socket.io-client';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';

import { useFeature } from './feature';
import { useMicrophonePermission } from './microphone';

export const useCanASR = () => {
  const asrBypass = useFeature(Realtime.FeatureFlag.ASR_BYPASS);

  return asrBypass.isEnabled || !SpeechRecognition.browserSupportsSpeechRecognition();
};

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
  const {
    listening,
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useReactSpeechRecognition({
    clearTranscriptOnListen: true,
  });

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

    await SpeechRecognition.startListening({
      language: cache.current.locale?.length === 5 ? cache.current.locale : undefined,
      continuous: true,
    });
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
    isSupported: browserSupportsSpeechRecognition,
    finalTranscript,
    onStopListening,
    onStartListening,
    interimTranscript,
    onCheckMicrophonePermission: checkMicrophonePermission,
    isMicrophonePermissionGranted: microphonePermissionGranted,
  };
};

export const useASR = ({
  locale,
  enabled = true,
  onTranscript,
}: {
  locale: string;
  enabled?: boolean;
  onTranscript: (test: string) => void;
}) => {
  const LANGUAGE_CODES = useCreateConst(
    () =>
      new Set([
        'ar-SA',
        'cs-CZ',
        'da-DK',
        'de-DE',
        'el-GR',
        'en-AU',
        'en-GB',
        'en-IE',
        'en-US',
        'en-ZA',
        'es-ES',
        'es-MX',
        'fi-FI',
        'fr-CA',
        'fr-FR',
        'he-IL',
        'hi-IN',
        'hu-HU',
        'id-ID',
        'it-IT',
        'ja-JP',
        'ko-KR',
        'nl-BE',
        'nl-NL',
        'no-NO',
        'pl-PL',
        'pt-BR',
        'pt-PT',
        'ro-RO',
        'ru-RU',
        'sk-SK',
        'sv-SE',
        'th-TH',
        'tr-TR',
        'zh-CN',
        'zh-HK',
        'zh-TW',
      ])
  );
  const DEFAULT_LANGUAGE_CODE = 'en-US';

  const [listeningASR, setListeningASR] = React.useState(false);
  const [processingTranscription, setProcessingTranscription] = React.useState(false);

  const streamRef = React.useRef<MediaStream | null>(null);
  const socketRef = React.useRef<Socket | null>(null);
  const recordRef = React.useRef<RecordRTC | null>(null);

  const persistedTranscript = usePersistFunction(onTranscript);

  const onStart = React.useCallback(async () => {
    if (!enabled || listeningASR || !streamRef.current) {
      return;
    }

    setListeningASR(true);
    setProcessingTranscription(true);

    await socketRef.current?.emit('startTranscription', {
      languageCode: LANGUAGE_CODES.has(locale) ? locale : DEFAULT_LANGUAGE_CODE,
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
      setTimeout(() => setProcessingTranscription(false), 3000);
    }
  }, [listeningASR, processingTranscription]);

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const transcriptionHandler = (transcriptData: { alternatives: { transcript: string }[]; isFinal: boolean }) => {
      const bestTranscription = transcriptData.alternatives[0]?.transcript;
      const { isFinal } = transcriptData;

      if (isFinal) {
        persistedTranscript(bestTranscription);
        setProcessingTranscription(false);
        onStop();
      }
    };

    const socket = io(GENERAL_SERVICE_ENDPOINT, {
      forceNew: true,
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('transcription', transcriptionHandler);

    socketRef.current = socket;

    let stream: MediaStream | null = null;
    let prevented = false;
    let recordAudio: RecordRTC | null = null;

    (async () => {
      try {
        stream = await window.navigator.mediaDevices.getUserMedia({ audio: true });

        if (prevented) return;

        recordAudio = new RecordRTC(stream, {
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
      prevented = true;

      stream?.getTracks().forEach((track) => track.stop());
      recordAudio?.stopRecording();
      recordAudio?.destroy();

      socket.removeListener('transcription', transcriptionHandler);
      socket.disconnect();
    };
  }, [enabled]);

  return {
    listening: listeningASR,
    onStopListening: onStop,
    onStartListening: onStart,
    processingTranscription,
  };
};
