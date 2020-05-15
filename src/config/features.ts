/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const MARKUP_ENABLED = process.env.FF_MARKUP === 'true';
export const CANVAS_EXPORT_ENABLED = process.env.FF_CANVAS_EXPORT === 'true';

export enum FeatureFlag {
  MARKUP = 'markup',
  CANVAS_EXPORT = 'canvas_export',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.MARKUP]: MARKUP_ENABLED,
  [FeatureFlag.CANVAS_EXPORT]: CANVAS_EXPORT_ENABLED,

  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
};
