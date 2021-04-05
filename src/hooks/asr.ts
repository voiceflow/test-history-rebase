import { isChrome, isMobile, isTablet } from '@/config';
import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks/feature';

const DESKTOP_APP_USERAGENT = 'Chrome Desktop App';

// eslint-disable-next-line import/prefer-default-export
export const useCanASR = () => {
  const asrBypass = useFeature(FeatureFlag.ASR_BYPASS);
  const isDesktopApp = window.navigator.userAgent === DESKTOP_APP_USERAGENT;
  const canUseASR = !isChrome || asrBypass.isEnabled || isDesktopApp || (isChrome && (isMobile || isTablet));

  return [canUseASR];
};
