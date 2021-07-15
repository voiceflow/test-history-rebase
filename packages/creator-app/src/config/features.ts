/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
const WAVENET_VOICES_ENABLED = process.env.FF_WAVENET_VOICES === 'true';
const OWNER_ROLE_ENABLED = process.env.FF_OWNER_ROLE === 'true';
const ASR_BYPASS_ENABLED = process.env.FF_ASR_BYPASS === 'true';
const NATO_APCO_ENABLED = process.env.FF_NATO_ACPO === 'true';
const MOTOROLA_SSO_ENABLED = process.env.FF_MOTOROLA_SSO === 'true';
const TEST_REPORTS_ENABLED = process.env.FF_TEST_REPORTS === 'true';
const ATOMIC_ACTIONS_ENABLED = process.env.FF_ATOMIC_ACTIONS === 'true';

export enum FeatureFlag {
  GADGETS = 'gadgets',
  WAVENET_VOICES = 'wavenet_voices',
  ASR_BYPASS = 'asr_bypass',
  NATO_APCO = 'nato_apco',
  MOTOROLA_SSO = 'motorola_sso',
  ATOMIC_ACTIONS = 'atomic_actions',

  // used by select private cloud instances to add a new role type
  OWNER_ROLE = 'owner_role',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',

  TEST_REPORTS = 'test_reports',
}

export const LOCAL_FEATURE_OVERRIDES: Partial<Record<FeatureFlag, boolean>> = {
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.WAVENET_VOICES]: WAVENET_VOICES_ENABLED,
  [FeatureFlag.OWNER_ROLE]: OWNER_ROLE_ENABLED,
  [FeatureFlag.ASR_BYPASS]: ASR_BYPASS_ENABLED,
  [FeatureFlag.NATO_APCO]: NATO_APCO_ENABLED,
  [FeatureFlag.MOTOROLA_SSO]: MOTOROLA_SSO_ENABLED,
  [FeatureFlag.TEST_REPORTS]: TEST_REPORTS_ENABLED,
  [FeatureFlag.ATOMIC_ACTIONS]: ATOMIC_ACTIONS_ENABLED,
};
