/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

export const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
export const CODE_EXPORT_ENABLED = process.env.FF_CODE_EXPORT === 'true';
export const GENERAL_PLATFORM_ENABLED = process.env.FF_GENERAL_PLATFORM === 'true';
export const GENERAL_PROTOTYPE_ENABLED = process.env.FF_GENERAL_PROTOTYPE === 'true';
export const VISUAL_PROTOTYPE_ENABLED = process.env.FF_VISUAL_PROTOTYPE === 'true';
export const WAVENET_VOICES_ENABLED = process.env.FF_WAVENET_VOICES === 'true';

export enum FeatureFlag {
  GADGETS = 'gadgets',
  CODE_EXPORT = 'code_export',
  VISUAL_PROTOTYPE = 'prototype_test',
  GENERAL_PLATFORM = 'general_platform',
  GENERAL_PROTOTYPE = 'general_prototype',
  WAVENET_VOICES = 'wavenet_voices',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
  [FeatureFlag.CODE_EXPORT]: CODE_EXPORT_ENABLED,
  [FeatureFlag.VISUAL_PROTOTYPE]: VISUAL_PROTOTYPE_ENABLED,
  [FeatureFlag.GENERAL_PLATFORM]: GENERAL_PLATFORM_ENABLED,
  [FeatureFlag.GENERAL_PROTOTYPE]: GENERAL_PROTOTYPE_ENABLED,
  [FeatureFlag.WAVENET_VOICES]: WAVENET_VOICES_ENABLED,
};
