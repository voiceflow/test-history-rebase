/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const TEMPLATES_ENABLED = process.env.FF_TEMPLATES === 'true';
export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const COMMENTING_ENABLED = process.env.FF_COMMENTING === 'true';
export const WORKSPACE_CREATION_ENABLED = process.env.FF_WORKSPACE_CREATION_FLOW === 'true';
export const INVITE_BY_LINK_ENABLED = process.env.FF_INVITE_BY_LINK === 'true';

export enum FeatureFlag {
  TEMPLATES = 'templates',
  GADGETS = 'gadgets',
  COMMENTING = 'commenting',
  INVITE_BY_LINK = 'invite_by_link',
  WORKSPACE_CREATION_FLOW = 'workspace_creation_flow',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.TEMPLATES]: TEMPLATES_ENABLED,
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.COMMENTING]: COMMENTING_ENABLED,
  [FeatureFlag.WORKSPACE_CREATION_FLOW]: WORKSPACE_CREATION_ENABLED,
  [FeatureFlag.INVITE_BY_LINK]: INVITE_BY_LINK_ENABLED,

  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
};
