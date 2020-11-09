/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const DATA_REFACTOR_ENABLED = process.env.FF_DATA_REFACTOR === 'true';
export const CODE_EXPORT_ENABLED = process.env.FF_CODE_EXPORT === 'true';
export const ACTIONS_ENV_ENABLED = process.env.FF_ACTIONS_ENV === 'true';
export const PROTOTYPE_TEST_ENABLED = process.env.FF_PROTOTYPE_TEST === 'true';
export const HEADER_REDESIGN_ENABLED = process.env.FF_HEADER_REDESIGN === 'true';
export const GENERAL_PLATFORM_ENABLED = process.env.FF_GENERAL_PLATFORM === 'true';

export enum FeatureFlag {
  GADGETS = 'gadgets',
  DATA_REFACTOR = 'data_refactor',
  CODE_EXPORT = 'code_export',
  ACTIONS_ENV = 'actions_env',
  PROTOTYPE_TEST = 'prototype_test',
  HEADER_REDESIGN = 'header_redesign',
  GENERAL_PLATFORM = 'general_platform',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.DATA_REFACTOR]: DATA_REFACTOR_ENABLED,
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
  [FeatureFlag.CODE_EXPORT]: CODE_EXPORT_ENABLED,
  [FeatureFlag.ACTIONS_ENV]: ACTIONS_ENV_ENABLED,
  [FeatureFlag.PROTOTYPE_TEST]: PROTOTYPE_TEST_ENABLED,
  [FeatureFlag.HEADER_REDESIGN]: HEADER_REDESIGN_ENABLED,
  [FeatureFlag.GENERAL_PLATFORM]: GENERAL_PLATFORM_ENABLED,
};
