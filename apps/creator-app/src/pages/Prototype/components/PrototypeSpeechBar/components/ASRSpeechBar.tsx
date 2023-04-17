import { IS_MOBILE, useCache } from '@voiceflow/ui';
import React from 'react';

import { useASR, useDebouncedCallback, useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import ASRContent from '@/pages/Prototype/components/PrototypeSpeechBar/components/ASRContent';

interface ASRSpeechBarProps {
  onTranscript: (text: string) => void;
  onCheckMicrophonePermission?: () => void;
  isMicrophonePermissionGranted?: boolean;
  locale: string;
}

const ASRSpeechBar: React.FC<ASRSpeechBarProps> = ({ onTranscript, isMicrophonePermissionGranted, onCheckMicrophonePermission, locale }) => {
  const { listening, onStopListening, onStartListening, processingTranscription } = useASR({ onTranscript, locale });

  const cache = useCache({ onStopListening, onStartListening });

  const onDebouncedStopListening = useDebouncedCallback(100, () => cache.current.onStopListening(), [], { leading: true, trailing: false });
  const onDebouncedStartListening = useDebouncedCallback(100, () => cache.current.onStartListening(), [], { leading: true, trailing: false });

  useHotkey(Hotkey.USER_SPEECH, onDebouncedStopListening, { action: 'keyup', disable: IS_MOBILE });
  useHotkey(Hotkey.USER_SPEECH, onDebouncedStartListening, { action: 'keydown', disable: IS_MOBILE });

  return (
    <ASRContent
      isMicrophoneAvailable={isMicrophonePermissionGranted}
      listeningASR={listening}
      processingTranscription={processingTranscription}
      isMobile={IS_MOBILE}
      onCheckMicrophonePermission={onCheckMicrophonePermission}
      onListen={onDebouncedStartListening}
      onStop={onDebouncedStopListening}
    />
  );
};

export default ASRSpeechBar;
