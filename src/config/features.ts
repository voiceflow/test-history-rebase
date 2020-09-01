/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const DATA_REFACTOR_ENABLED = process.env.FF_DATA_REFACTOR === 'true';
export const PROJECT_SPLITTING_ENABLED = process.env.FF_PROJECT_SPLITTING === 'true';
export const PROJECT_CREATION_ENABLED = process.env.FF_PROJECT_CREATION_FLOW === 'true';

export enum FeatureFlag {
  GADGETS = 'gadgets',
  DATA_REFACTOR = 'data_refactor',
  PROJECT_SPLITTING = 'project_splitting',
  PROJECT_CREATION_FLOW = 'project_creation_flow',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.DATA_REFACTOR]: DATA_REFACTOR_ENABLED,
  [FeatureFlag.PROJECT_SPLITTING]: PROJECT_SPLITTING_ENABLED,
  [FeatureFlag.PROJECT_CREATION_FLOW]: PROJECT_CREATION_ENABLED,
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
};
