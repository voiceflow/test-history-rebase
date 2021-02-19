import React from 'react';

import { isMobile as isMobileDevice } from '@/config';
import { useASR, useCache, useDebouncedCallback, useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import ASRContent from '@/pages/Prototype/components/PrototypeSpeechBar/components/ASRContent';

type ASRSpeechBarProps = {
  onTranscript: (text: string) => void;
  onCheckMicrophonePermission: () => void;
  isMicrophonePermissionGranted: boolean;
  locale: string;
};

const ASRSpeechBar: React.FC<ASRSpeechBarProps> = ({ onTranscript, isMicrophonePermissionGranted, onCheckMicrophonePermission, locale }) => {
  const { listening, onStopListening, onStartListening, processingTranscription } = useASR({ onTranscript, locale });

  const isMobile = isMobileDevice;

  const cache = useCache({ onStopListening, onStartListening });

  const onDebouncedStopListening = useDebouncedCallback(100, () => cache.current.onStopListening(), [], { leading: true, trailing: false });
  const onDebouncedStartListening = useDebouncedCallback(100, () => cache.current.onStartListening(), [], { leading: true, trailing: false });

  useHotKeys(Hotkey.USER_SPEECH, onDebouncedStopListening, { action: 'keyup', disable: isMobile });
  useHotKeys(Hotkey.USER_SPEECH, onDebouncedStartListening, { action: 'keydown', disable: isMobile });

  return (
    <ASRContent
      isMicrophoneAvailable={isMicrophonePermissionGranted}
      listeningASR={listening}
      processingTranscription={processingTranscription}
      isMobile={isMobile}
      onCheckMicrophonePermission={onCheckMicrophonePermission}
      onListen={onDebouncedStartListening}
      onStop={onDebouncedStopListening}
    />
  );
};

export default ASRSpeechBar;
