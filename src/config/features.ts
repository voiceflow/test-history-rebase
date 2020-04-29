/* eslint-disable no-process-env */

export const PRICING_REVISIONS_ENABLED = process.env.FF_PRICING_REVISIONS === 'true';

export enum FeatureFlag {
  PRICING_REVISIONS = 'pricing_revisions',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.PRICING_REVISIONS]: PRICING_REVISIONS_ENABLED,
};
