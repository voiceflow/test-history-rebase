/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const DATA_REFACTOR_ENABLED = process.env.FF_DATA_REFACTOR === 'true';
export const CODE_EXPORT_ENABLED = process.env.FF_CODE_EXPORT === 'true';

export enum FeatureFlag {
  GADGETS = 'gadgets',
  DATA_REFACTOR = 'data_refactor',
  CODE_EXPORT = 'code_export',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.DATA_REFACTOR]: DATA_REFACTOR_ENABLED,
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
  [FeatureFlag.CODE_EXPORT]: CODE_EXPORT_ENABLED,
};
