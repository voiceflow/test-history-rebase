/* eslint-disable no-process-env */

export const MARKUP_ENABLED = process.env.FF_MARKUP === 'true';

export enum FeatureFlag {
  MARKUP = 'markup',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.MARKUP]: MARKUP_ENABLED,
};
