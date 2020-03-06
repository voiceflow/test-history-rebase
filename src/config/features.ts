/* eslint-disable no-process-env */

export const BLOCK_REDESIGN_ENABLED = process.env.FF_BLOCK_REDESIGN === 'true';

export enum FeatureFlag {
  BLOCK_REDESIGN = 'block_redesign',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.BLOCK_REDESIGN]: BLOCK_REDESIGN_ENABLED,
};
