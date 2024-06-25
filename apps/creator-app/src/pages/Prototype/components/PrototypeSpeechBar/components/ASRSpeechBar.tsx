import { IS_MOBILE, useCache } from '@voiceflow/ui';
import React from 'react';

import { useDebouncedCallback, useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import ASRContent from '@/pages/Prototype/components/PrototypeSpeechBar/components/ASRContent';

interface ASRSpeechBarProps {
  listening: boolean;
  onStopListening: VoidFunction;
  onStartListening: VoidFunction;
  processingTranscription: boolean;
  onCheckMicrophonePermission?: () => void;
  isMicrophonePermissionGranted?: boolean;
}

const ASRSpeechBar: React.FC<ASRSpeechBarProps> = ({
  listening,
  onStopListening,
  onStartListening,
  processingTranscription,
  onCheckMicrophonePermission,
  isMicrophonePermissionGranted,
}) => {
  const cache = useCache({ onStopListening, onStartListening });

  const onDebouncedStopListening = useDebouncedCallback(100, () => cache.current.onStopListening(), [], {
    leading: true,
    trailing: false,
  });
  const onDebouncedStartListening = useDebouncedCallback(100, () => cache.current.onStartListening(), [], {
    leading: true,
    trailing: false,
  });

  useHotkey(Hotkey.USER_SPEECH, onDebouncedStopListening, { action: 'keyup', disable: IS_MOBILE });
  useHotkey(Hotkey.USER_SPEECH, onDebouncedStartListening, { action: 'keydown', disable: IS_MOBILE });

  return (
    <ASRContent
      onStop={onDebouncedStopListening}
      isMobile={IS_MOBILE}
      onListen={onDebouncedStartListening}
      listeningASR={listening}
      isMicrophoneAvailable={isMicrophonePermissionGranted}
      processingTranscription={processingTranscription}
      onCheckMicrophonePermission={onCheckMicrophonePermission}
    />
  );
};

export default ASRSpeechBar;
