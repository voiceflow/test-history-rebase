import Bowser from 'bowser';
import React from 'react';

import { isChrome } from '@/config';
import { FeatureFlag } from '@/config/features';
import { useFeature, useSpeechRecognition } from '@/hooks';

import { ASRSpeechbar, UncontrolledSpeechBar } from './components';

export { UncontrolledSpeechBar } from './components';

export type PrototypeSpeechBarProps = {
  locale: string;
  onTranscript: (input: string) => void;
};

const PrototypeSpeechBar: React.FC<PrototypeSpeechBarProps> = ({ locale, onTranscript }) => {
  const isMobile = Bowser.parse(window.navigator.userAgent).platform.type === 'mobile';
  const isTablet = Bowser.parse(window.navigator.userAgent).platform.type === 'tablet';
  const googleASR = useFeature(FeatureFlag.GOOGLE_STT);
  const asrBypass = useFeature(FeatureFlag.ASR_BYPASS);
  // Let everyone who is not on web chrome and mobile/tablet devices use ASR (unless they are specifically FFed)
  const canUseASR = (!isMobile && !isTablet && !isChrome && googleASR.isEnabled) || asrBypass.isEnabled;

  const {
    isListening,
    isSupported,
    finalTranscript,
    onStopListening,
    onStartListening,
    interimTranscript,
    onCheckMicrophonePermission,
    isMicrophonePermissionGranted,
  } = useSpeechRecognition({
    locale,
    askOnSetup: true,
    onTranscript,
  });

  if (canUseASR) {
    return (
      <ASRSpeechbar
        onTranscript={onTranscript}
        onCheckMicrophonePermission={onCheckMicrophonePermission}
        locale={locale}
        isMicrophonePermissionGranted={isMicrophonePermissionGranted}
      />
    );
  }

  return (
    <UncontrolledSpeechBar
      isListening={isListening}
      isSupported={isSupported}
      finalTranscript={finalTranscript}
      onStopListening={onStopListening}
      onStartListening={onStartListening}
      interimTranscript={interimTranscript}
      onCheckMicrophonePermission={onCheckMicrophonePermission}
      isMicrophonePermissionGranted={isMicrophonePermissionGranted}
    />
  );
};

export default PrototypeSpeechBar;
