import React from 'react';
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from 'react-speech-recognition';
import RecordRTC from 'recordrtc';
import io from 'socket.io-client';

import { GENERAL_SERVICE_ENDPOINT } from '@/config';
import { BCP_LANGUAGE_CODE } from '@/constants';

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

const TRANSCRIPTION_TIMEOUT = 3000;

export const useASR = ({ onTranscript, locale }: { onTranscript: (test: string) => void; locale: string }) => {
  const [recordAudio, setRecordAudio] = React.useState<RecordRTC | null>(null);
  const [listeningASR, setListeningASR] = React.useState(false);
  const [asrStream, setAsrStream] = React.useState<MediaStream | null>(null);
  const [ASRSocket, setASRSocket] = React.useState<any>();
  const [processingTranscription, setProcessingTranscription] = React.useState(false);

  React.useEffect(() => {
    const socket = io(GENERAL_SERVICE_ENDPOINT, {
      transports: ['websocket'],
      forceNew: true,
      autoConnect: true,
    });

    setASRSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    ASRSocket?.on('transcription', (transcriptData: { alternatives: { transcript: string }[]; isFinal: boolean }) => {
      const bestTranscription = transcriptData.alternatives[0]?.transcript;
      const { isFinal } = transcriptData;
      if (isFinal) {
        onTranscript(bestTranscription);
        setProcessingTranscription(false);
        onStop();
      }
    });

    return () => {
      ASRSocket?.removeListener('transcription');
    };
  }, [ASRSocket, listeningASR, asrStream]);

  React.useEffect(() => {
    if (!listeningASR) {
      recordAudio?.stopRecording();
      recordAudio?.destroy();
    }
  }, [listeningASR, recordAudio]);

  const handleStream = React.useCallback(
    (stream) => {
      setListeningASR(true);
      setAsrStream(stream);
      setProcessingTranscription(true);

      const newRecordAudio = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        sampleRate: 44100,
        desiredSampRate: 16000,
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        timeSlice: 100,
        ondataavailable: (blob: any) => {
          ASRSocket?.emit('audioBlob', blob);
        },
      });
      setRecordAudio(newRecordAudio);
      newRecordAudio.startRecording();
    },
    [setListeningASR, ASRSocket, listeningASR]
  );

  const onListen = React.useCallback(async () => {
    if (listeningASR) {
      return;
    }
    const options = {
      languageCode: Object.values(BCP_LANGUAGE_CODE).includes(locale as BCP_LANGUAGE_CODE) ? locale : BCP_LANGUAGE_CODE.EN_US,
    };
    ASRSocket?.emit('startTranscription', options);

    navigator?.mediaDevices
      .getUserMedia({ audio: true })
      .then(handleStream)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }, [setListeningASR, ASRSocket, listeningASR]);

  const onStop = React.useCallback(() => {
    ASRSocket?.emit('stopTranscription');
    setListeningASR(false);

    // If there is no transcription, or if transcription takes too long, reset.
    setTimeout(() => {
      if (processingTranscription) {
        setProcessingTranscription(false);
      }
    }, TRANSCRIPTION_TIMEOUT);
  }, [ASRSocket, setListeningASR, processingTranscription]);

  return {
    listening: listeningASR,
    onStopListening: onStop,
    onStartListening: onListen,
    processingTranscription,
  };
};
