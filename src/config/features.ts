/* eslint-disable no-process-env */

export const BLOCK_REDESIGN_ENABLED = process.env.FF_BLOCK_REDESIGN === 'true';
export const TEST_TOOL_V2_ENABLED = process.env.FF_TEST_TOOL_V2 === 'true';

export enum FeatureFlag {
  BLOCK_REDESIGN = 'block_redesign',
  BLOCK_REDESIGN_BETA = 'block_redesign_beta',
  TEST_TOOL_V2 = 'test_tool_v2',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.BLOCK_REDESIGN]: BLOCK_REDESIGN_ENABLED,
  [FeatureFlag.TEST_TOOL_V2]: TEST_TOOL_V2_ENABLED,
};
