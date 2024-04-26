import { toast, useCache, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from 'react-speech-recognition';
import RecordRTC from 'recordrtc';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';

import { useMicrophonePermission } from './microphone';

const BCP_LANGUAGE_CODE = {
  AR_SA: 'ar-SA',
  CS_CZ: 'cs-CZ',
  DA_DK: 'da-DK',
  DE_DE: 'de-DE',
  EL_GR: 'el-GR',
  EN_AU: 'en-AU',
  EN_GB: 'en-GB',
  EN_IE: 'en-IE',
  EN_US: 'en-US',
  EN_ZA: 'en-ZA',
  ES_ES: 'es-ES',
  ES_MX: 'es-MX',
  FI_FI: 'fi-FI',
  FR_CA: 'fr-CA',
  FR_FR: 'fr-FR',
  HE_IL: 'he-IL',
  HI_IN: 'hi-IN',
  HU_HU: 'hu-HU',
  ID_ID: 'id-ID',
  IT_IT: 'it-IT',
  JA_JP: 'ja-JP',
  KO_KR: 'ko-KR',
  NL_BE: 'nl-BE',
  NL_NL: 'nl-NL',
  NO_NO: 'no-NO',
  PL_PL: 'pl-PL',
  PT_BR: 'pt-BR',
  PT_PT: 'pt-PT',
  RO_RO: 'ro-RO',
  RU_RU: 'ru-RU',
  SK_SK: 'sk-SK',
  SV_SE: 'sv-SE',
  TH_TH: 'th-TH',
  TR_TR: 'tr-TR',
  ZH_CN: 'zh-CN',
  ZH_HK: 'zh-HK',
  ZH_TW: 'zh-TW',
} as const;

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

const TRANSCRIPTION_TIMEOUT = 3000;

export const useASR = ({
  onTranscript,
  locale,
  enabled = true,
}: {
  onTranscript: (test: string) => void;
  locale: string;
  enabled?: boolean;
}) => {
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
      languageCode: Object.values(BCP_LANGUAGE_CODE).includes(locale as any) ? locale : BCP_LANGUAGE_CODE.EN_US,
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
