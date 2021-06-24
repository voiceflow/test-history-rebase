import { Box, ClickableText, preventDefault, Text, useCache } from '@voiceflow/ui';
import React from 'react';

import { useDebouncedCallback, useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { Identifier } from '@/styles/constants';

import Container from './Container';

export type UncontrolledSpeechBarProps = {
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
};

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

  useHotKeys(Hotkey.USER_SPEECH, onDebouncedStopListening, { action: 'keyup', disable: isMobile || disabled });
  useHotKeys(Hotkey.USER_SPEECH, onDebouncedStartListening, { action: 'keydown', disable: isMobile || disabled });

  // we can't prevent default behavior for react touchstart/touchend events
  // https://github.com/facebook/react/issues/9809#issuecomment-414072263
  // TODO: replace with react touchstart/touchend events after updating to React@17.*
  React.useEffect(() => {
    if (isMobile) {
      const onPreventDefaultDebouncedStopListening = preventDefault(onDebouncedStopListening);
      const onPreventDefaultDebouncedStartListening = preventDefault(onDebouncedStartListening);

      containerRef.current?.addEventListener('touchend', onPreventDefaultDebouncedStopListening);
      containerRef.current?.addEventListener('touchstart', onPreventDefaultDebouncedStartListening);

      return () => {
        containerRef.current?.removeEventListener('touchend', onPreventDefaultDebouncedStopListening);
        containerRef.current?.removeEventListener('touchstart', onPreventDefaultDebouncedStartListening);
      };
    }

    return () => {
      // to fix react error
    };
  }, []);

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
      onMouseDown={isMobile ? undefined : preventDefault(onDebouncedStartListening)}
    >
      <Text color="#8da2b5">{text}</Text>
    </Container>
  );
};

export default UncontrolledSpeechBar;
