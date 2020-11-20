/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const CODE_EXPORT_ENABLED = process.env.FF_CODE_EXPORT === 'true';
export const HEADER_REDESIGN_ENABLED = process.env.FF_HEADER_REDESIGN === 'true';
export const GENERAL_PLATFORM_ENABLED = process.env.FF_GENERAL_PLATFORM === 'true';
export const PROTOTYPE_TEST_ENABLED = process.env.FF_PROTOTYPE_TEST === 'true';
export enum FeatureFlag {
  GADGETS = 'gadgets',
  CODE_EXPORT = 'code_export',
  PROTOTYPE_TEST = 'prototype_test',
  HEADER_REDESIGN = 'header_redesign',
  GENERAL_PLATFORM = 'general_platform',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
  [FeatureFlag.CODE_EXPORT]: CODE_EXPORT_ENABLED,
  [FeatureFlag.PROTOTYPE_TEST]: PROTOTYPE_TEST_ENABLED,
  [FeatureFlag.HEADER_REDESIGN]: HEADER_REDESIGN_ENABLED,
  [FeatureFlag.GENERAL_PLATFORM]: GENERAL_PLATFORM_ENABLED,
};
