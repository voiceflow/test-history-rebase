/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
const WAVENET_VOICES_ENABLED = process.env.FF_WAVENET_VOICES === 'true';
const OWNER_ROLE_ENABLED = process.env.FF_OWNER_ROLE === 'true';
const ASR_BYPASS_ENABLED = process.env.FF_ASR_BYPASS === 'true';
const NATO_APCO_ENABLED = process.env.FF_NATO_ACPO === 'true';

export enum FeatureFlag {
  GADGETS = 'gadgets',
  WAVENET_VOICES = 'wavenet_voices',
  OWNER_ROLE = 'owner_role',
  ASR_BYPASS = 'asr_bypass',
  NATO_APCO = 'nato_apco',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',
}

export const LOCAL_FEATURE_OVERRIDES = {
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.WAVENET_VOICES]: WAVENET_VOICES_ENABLED,
  [FeatureFlag.OWNER_ROLE]: OWNER_ROLE_ENABLED,
  [FeatureFlag.ASR_BYPASS]: ASR_BYPASS_ENABLED,
  [FeatureFlag.NATO_APCO]: NATO_APCO_ENABLED,
};
