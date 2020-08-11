/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const MARKUP_ENABLED = process.env.FF_MARKUP === 'true';
export const CANVAS_EXPORT_ENABLED = process.env.FF_CANVAS_EXPORT === 'true';
export const TEMPLATES_ENABLED = process.env.FF_TEMPLATES === 'true';
export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const COMMENTING_ENABLED = process.env.FF_COMMENTING === 'true';
export const BULK_UPLOAD_ENABLED = process.env.FF_BULK_UPLOAD === 'true';
export const WORKSPACE_CREATION_ENABLED = process.env.FF_WORKSPACE_CREATION_FLOW === 'true';
export const INVITE_BY_LINK_ENABLED = process.env.FF_INVITE_BY_LINK === 'true';

export enum FeatureFlag {
  MARKUP = 'markup',
  CANVAS_EXPORT = 'canvas_export',
  TEMPLATES = 'templates',
  GADGETS = 'gadgets',
  COMMENTING = 'commenting',
  BULK_UPLOAD = 'bulk_upload',
  INVITE_BY_LINK = 'invite_by_link',
  WORKSPACE_CREATION_FLOW = 'workspace_creation_flow',

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
  [FeatureFlag.WORKSPACE_CREATION_FLOW]: WORKSPACE_CREATION_ENABLED,
  [FeatureFlag.INVITE_BY_LINK]: INVITE_BY_LINK_ENABLED,

  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
};
