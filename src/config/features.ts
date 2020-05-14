/* eslint-disable no-process-env */

export const MARKUP_ENABLED = process.env.FF_MARKUP === 'true';

export enum FeatureFlag {
  MARKUP = 'markup',
  SIMPLE_USERFLOW_ONBOARDING = 'simple_userflow_onboarding',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.MARKUP]: MARKUP_ENABLED,
  [FeatureFlag.SIMPLE_USERFLOW_ONBOARDING]: false,
};
