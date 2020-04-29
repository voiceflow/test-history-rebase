/* eslint-disable no-process-env */

export enum FeatureFlag {
  EXAMPLE = 'example',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.EXAMPLE]: false,
};
