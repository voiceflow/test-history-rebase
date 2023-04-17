import { Box, ClickableText, preventDefault, Text, useCache } from '@voiceflow/ui';
import React from 'react';

import { useDebouncedCallback, useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import { Identifier } from '@/styles/constants';

import Container from './Container';

export interface UncontrolledSpeechBarProps {
  isMobile?: boolean;
  disabled?: boolean;
  isListening?: boolean;
  isSupported?: boolean;
  finalTranscript: string;
  onStopListening: () => void;
  onStartListening: () => void;
  interimTranscript: string;
  onCheckMicrophonePermission?: () => void;
  isMicrophonePermissionGranted?: boolean;
  colorScheme?: string;
}

const UncontrolledSpeechBar: React.FC<UncontrolledSpeechBarProps> = ({
  isMobile,
  disabled,
  isListening,
  isSupported,
  finalTranscript,
  onStopListening,
  onStartListening,
  interimTranscript,
  onCheckMicrophonePermission,
  isMicrophonePermissionGranted,
  colorScheme = '#5D9DF5',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cache = useCache({ onStopListening, onStartListening });

  const onDebouncedStopListening = useDebouncedCallback(100, () => cache.current.onStopListening(), [], { leading: true, trailing: false });
  const onDebouncedStartListening = useDebouncedCallback(100, () => cache.current.onStartListening(), [], { leading: true, trailing: false });

  useHotkey(Hotkey.USER_SPEECH, onDebouncedStopListening, { action: 'keyup', disable: isMobile || disabled });
  useHotkey(Hotkey.USER_SPEECH, onDebouncedStartListening, { action: 'keydown', disable: isMobile || disabled });

  if (!isSupported) {
    return (
      <Container cursor="default">
        <Text color="#8da2b5">{isMobile ? 'Speech recognition not available on mobile' : "Browser doesn't support speech recognition"}</Text>
      </Container>
    );
  }

  let text;
  if (!isMicrophonePermissionGranted) {
    text = (
      <>
        Please{' '}
        <ClickableText color={colorScheme} onClick={onCheckMicrophonePermission}>
          enable
        </ClickableText>{' '}
        microphone access
      </>
    );
  } else if (!isListening) {
    text = (
      <>
        Hold <Text color={colorScheme}>{isMobile ? 'here' : 'spacebar'}</Text> for Voice Input
      </>
    );
  } else if (finalTranscript || interimTranscript) {
    text = (
      <>
        <Box color="#132144" display="inline-block">
          {finalTranscript} {interimTranscript}
        </Box>
      </>
    );
  } else {
    text = 'Say something...';
  }

  return (
    <Container
      id={Identifier.SPEECH_BAR}
      ref={containerRef}
      disabled={disabled}
      onMouseUp={isMobile ? undefined : preventDefault(onDebouncedStopListening)}
      onTouchEnd={isMobile ? preventDefault(onDebouncedStopListening) : undefined}
      onMouseDown={isMobile ? undefined : preventDefault(onDebouncedStartListening)}
      onTouchStart={isMobile ? preventDefault(onDebouncedStartListening) : undefined}
    >
      <Text color="#8da2b5">{text}</Text>
    </Container>
  );
};

export default UncontrolledSpeechBar;
