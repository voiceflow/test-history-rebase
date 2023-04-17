import { ClickableText, preventDefault, Text } from '@voiceflow/ui';
import React from 'react';

import Container from './Container';

interface ASRContentProps {
  isMicrophoneAvailable?: boolean;
  listeningASR: boolean;
  processingTranscription: boolean;
  isMobile: boolean;
  onListen: () => void;
  onStop: () => void;
  onCheckMicrophonePermission?: () => void;
}

const ASRContent: React.FC<ASRContentProps> = ({
  isMicrophoneAvailable,
  onCheckMicrophonePermission,
  listeningASR,
  processingTranscription,
  isMobile,
  onListen,
  onStop,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  // we can't prevent default behavior for react touchstart/touchend events
  // https://github.com/facebook/react/issues/9809#issuecomment-414072263
  // TODO: replace with react touchstart/touchend events after updating to React@17.*
  React.useEffect(() => {
    if (isMobile) {
      const onPreventDefaultDebouncedStopListening = preventDefault(onStop);
      const onPreventDefaultDebouncedStartListening = preventDefault(onListen);

      containerRef.current?.addEventListener('touchend', onPreventDefaultDebouncedStopListening);
      containerRef.current?.addEventListener('touchstart', onPreventDefaultDebouncedStartListening);

      return () => {
        containerRef.current?.removeEventListener('touchend', onPreventDefaultDebouncedStopListening);
        containerRef.current?.removeEventListener('touchstart', onPreventDefaultDebouncedStartListening);
      };
    }
    return undefined;
  }, []);
  let content;
  if (!isMicrophoneAvailable) {
    content = (
      <>
        Please <ClickableText onClick={onCheckMicrophonePermission}>enable</ClickableText> microphone access
      </>
    );
  } else if (!listeningASR && !processingTranscription) {
    if (isMobile) {
      content = 'Hold down for Voice Input';
    } else {
      content = (
        <>
          Hold <Text color="#5d9df5"> spacebar </Text> for Voice Input
        </>
      );
    }
  } else if (listeningASR) {
    content = 'Listening...';
  } else if (processingTranscription) {
    content = <>Processing...</>;
  }
  return (
    <Container
      ref={containerRef}
      onMouseUp={isMobile ? undefined : preventDefault(onStop)}
      onMouseDown={isMobile ? undefined : preventDefault(onListen)}
    >
      {content}
    </Container>
  );
};

export default ASRContent;
