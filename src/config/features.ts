/* eslint-disable no-process-env */

export const PRICING_REVISIONS_ENABLED = process.env.FF_PRICING_REVISIONS === 'true';
export const ONBOARDING_V2_ENABLED = process.env.FF_ONBOARDING_V2 === 'true';

export enum FeatureFlag {
  PRICING_REVISIONS = 'pricing_revisions',
  ONBOARDING_V2 = 'onboarding_v2',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.PRICING_REVISIONS]: PRICING_REVISIONS_ENABLED,
  [FeatureFlag.ONBOARDING_V2]: ONBOARDING_V2_ENABLED,
};
