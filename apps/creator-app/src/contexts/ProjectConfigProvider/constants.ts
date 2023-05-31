import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

interface FeatureFlagOverrides {
  featureFlag: Realtime.FeatureFlag.PROJECT_API_IMPROVEMENTS;
  platform: Platform.Constants.PlatformType;
  config: Partial<Platform.Base.Config>;
}

// temporary overrides to validate platform config with feature flag. Once ff is validated, remove it and push default config to platform config library
export const FEATURE_FLAGS_OVERRIDES: FeatureFlagOverrides[] = [
  {
    featureFlag: Realtime.FeatureFlag.PROJECT_API_IMPROVEMENTS,
    platform: Platform.Constants.PlatformType.DIALOGFLOW_CX,
    config: {
      withThirdPartyUpload: false,
    },
  },
];
