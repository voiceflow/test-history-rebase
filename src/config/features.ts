/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const MARKUP_ENABLED = process.env.FF_MARKUP === 'true';
export const CANVAS_EXPORT_ENABLED = process.env.FF_CANVAS_EXPORT === 'true';
export const REPROMPT_EDITOR_ENABLED = process.env.FF_REPROMPT_EDITOR === 'true';
export const TEMPLATES_ENABLED = process.env.FF_TEMPLATES === 'true';
export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const PROMPT_EDITOR_ENABLED = process.env.FF_PROMPT_EDITOR === 'true';
export const COMMENTING_ENABLED = process.env.FF_COMMENTING === 'true';

export enum FeatureFlag {
  MARKUP = 'markup',
  CANVAS_EXPORT = 'canvas_export',
  REPROMPT_EDITOR = 'reprompt_editor',
  TEMPLATES = 'templates',
  GADGETS = 'gadgets',
  PROMPT_EDITOR = 'prompt_editor',
  COMMENTING = 'commenting',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.MARKUP]: MARKUP_ENABLED,
  [FeatureFlag.CANVAS_EXPORT]: CANVAS_EXPORT_ENABLED,
  [FeatureFlag.REPROMPT_EDITOR]: REPROMPT_EDITOR_ENABLED,
  [FeatureFlag.TEMPLATES]: TEMPLATES_ENABLED,
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.PROMPT_EDITOR]: PROMPT_EDITOR_ENABLED,
  [FeatureFlag.COMMENTING]: COMMENTING_ENABLED,

  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
};
