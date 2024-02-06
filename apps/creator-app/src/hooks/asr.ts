// import * as Realtime from '@voiceflow/realtime-sdk';
// import { IS_BRAVE, IS_CHROME, IS_MOBILE, IS_TABLET } from '@voiceflow/ui';

// import { useFeature } from '@/hooks/feature';

// const DESKTOP_APP_USERAGENT = 'Chrome Desktop App';

export const useCanASR = () => {
  // const asrBypass = useFeature(Realtime.FeatureFlag.ASR_BYPASS);
  // const isDesktopApp = window.navigator.userAgent.includes(DESKTOP_APP_USERAGENT);
  const canUseASR = false;

  return [canUseASR];
};
