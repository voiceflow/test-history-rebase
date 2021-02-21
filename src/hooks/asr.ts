import { isChrome, isMobile, isTablet } from '@/config';
import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks/feature';

// eslint-disable-next-line import/prefer-default-export
export const useCanASR = () => {
  const googleASR = useFeature(FeatureFlag.GOOGLE_STT);
  const asrBypass = useFeature(FeatureFlag.ASR_BYPASS);
  const canUseASR = (!isMobile && !isTablet && !isChrome && googleASR.isEnabled) || asrBypass.isEnabled;

  return [canUseASR];
};
