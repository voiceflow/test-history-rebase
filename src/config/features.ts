/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const MARKUP_ENABLED = process.env.FF_MARKUP === 'true';
export const CANVAS_EXPORT_ENABLED = process.env.FF_CANVAS_EXPORT === 'true';
export const TEMPLATES_ENABLED = process.env.FF_TEMPLATES === 'true';
export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const COMMENTING_ENABLED = process.env.FF_COMMENTING === 'true';
export const BULK_UPLOAD_ENABLED = process.env.FF_BULK_UPLOAD === 'true';

export enum FeatureFlag {
  MARKUP = 'markup',
  CANVAS_EXPORT = 'canvas_export',
  TEMPLATES = 'templates',
  GADGETS = 'gadgets',
  COMMENTING = 'commenting',
  BULK_UPLOAD = 'bulk_upload',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.MARKUP]: MARKUP_ENABLED,
  [FeatureFlag.CANVAS_EXPORT]: CANVAS_EXPORT_ENABLED,
  [FeatureFlag.TEMPLATES]: TEMPLATES_ENABLED,
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.COMMENTING]: COMMENTING_ENABLED,
  [FeatureFlag.BULK_UPLOAD]: BULK_UPLOAD_ENABLED,

  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
};
