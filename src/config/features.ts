/* eslint-disable no-process-env */

export const TEST_TOOL_V2_ENABLED = process.env.FF_TEST_TOOL_V2 === 'true';

export enum FeatureFlag {
  TEST_TOOL_V2 = 'test_tool_v2',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.TEST_TOOL_V2]: TEST_TOOL_V2_ENABLED,
};
