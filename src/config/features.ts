/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const VISUAL_PROTOTYPE_ENABLED = process.env.FF_VISUAL_PROTOTYPE === 'true';
export const VISUAL_STEP_ENABLED = process.env.FF_VISUAL_STEP === 'true';
export const STRAIGHT_LINES_ENABLED = process.env.FF_STRAIGHT_LINES === 'true';
export const WAVENET_VOICES_ENABLED = process.env.FF_WAVENET_VOICES === 'true';
export const OWNER_ROLE_ENABLED = process.env.FF_OWNER_ROLE === 'true';

export enum FeatureFlag {
  GADGETS = 'gadgets',
  VISUAL_PROTOTYPE = 'prototype_test',
  VISUAL_STEP = 'visual_step',
  WAVENET_VOICES = 'wavenet_voices',
  OWNER_ROLE = 'owner_role',
  STRAIGHT_LINES = 'straight_lines',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.VISUAL_PROTOTYPE]: VISUAL_PROTOTYPE_ENABLED,
  [FeatureFlag.VISUAL_STEP]: VISUAL_STEP_ENABLED,
  [FeatureFlag.WAVENET_VOICES]: WAVENET_VOICES_ENABLED,
  [FeatureFlag.OWNER_ROLE]: OWNER_ROLE_ENABLED,
  [FeatureFlag.STRAIGHT_LINES]: STRAIGHT_LINES_ENABLED,
};
