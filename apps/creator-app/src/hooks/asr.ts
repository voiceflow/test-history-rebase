import * as Realtime from '@voiceflow/realtime-sdk';
import SpeachRecognition from 'react-speech-recognition';

import { useFeature } from '@/hooks/feature';

export const useCanASR = () => {
  const asrBypass = useFeature(Realtime.FeatureFlag.ASR_BYPASS);

  return asrBypass.isEnabled || !SpeachRecognition.browserSupportsSpeechRecognition();
};
