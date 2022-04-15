import { IS_CHROME, IS_MOBILE, IS_TABLET } from '@voiceflow/ui';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks/feature';

const DESKTOP_APP_USERAGENT = 'Chrome Desktop App';

export const useCanASR = () => {
  const asrBypass = useFeature(FeatureFlag.ASR_BYPASS);
  const isDesktopApp = window.navigator.userAgent.includes(DESKTOP_APP_USERAGENT);
  const canUseASR = !IS_CHROME || asrBypass.isEnabled || isDesktopApp || (IS_CHROME && (IS_MOBILE || IS_TABLET));

  return [canUseASR];
};
