/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
const WAVENET_VOICES_ENABLED = process.env.FF_WAVENET_VOICES === 'true';
const OWNER_ROLE_ENABLED = process.env.FF_OWNER_ROLE === 'true';
const ASR_BYPASS_ENABLED = process.env.FF_ASR_BYPASS === 'true';
const NATO_APCO_ENABLED = process.env.FF_NATO_ACPO === 'true';
const MOTOROLA_SSO_ENABLED = process.env.FF_MOTOROLA_SSO === 'true';
const ATOMIC_ACTIONS_ENABLED = process.env.FF_ATOMIC_ACTIONS === 'true';
const GOOGLE_CREATE_ENABLED = process.env.FF_GOOGLE_CREATE === 'true';
const DIALOGFLOW_ENABLED = process.env.FF_DIALOGFLOW === 'true';
const TOPICS_AND_COMPONENTS_ENABLED = process.env.FF_TOPICS_AND_COMPONENTS === 'true';
const ACCOUNT_PAGE_REDESIGN_ENABLED = process.env.FF_ACCOUNT_PAGE_REDESIGN === 'true';
const ENTERPRISE_TRIAL_ENABLED = process.env.FF_ENTERPRISE_TRIAL_ENABLED === 'true';

export enum FeatureFlag {
  GADGETS = 'gadgets',
  WAVENET_VOICES = 'wavenet_voices',
  ASR_BYPASS = 'asr_bypass',
  NATO_APCO = 'nato_apco',
  MOTOROLA_SSO = 'motorola_sso',
  TOPICS_AND_COMPONENTS = 'topics_and_components',

  // atomic actions
  REALTIME_CONNECTION = 'realtime_connection',
  ATOMIC_ACTIONS = 'atomic_actions',
  ATOMIC_ACTIONS_AWARENESS = 'atomic_actions_awareness',
  ATOMIC_ACTIONS_PHASE_2 = 'atomic_actions_phase_2',

  // used by select private cloud instances to add a new role type
  OWNER_ROLE = 'owner_role',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',

  DIALOGFLOW = 'dialogflow',
  GOOGLE_CREATE = 'google_create',

  ACCOUNT_PAGE_REDESIGN = 'account_page_redesign',

  ENTERPRISE_TRIAL = 'enterprise_trial',
}

export const LOCAL_FEATURE_OVERRIDES: Partial<Record<FeatureFlag, boolean>> = {
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.WAVENET_VOICES]: WAVENET_VOICES_ENABLED,
  [FeatureFlag.OWNER_ROLE]: OWNER_ROLE_ENABLED,
  [FeatureFlag.ASR_BYPASS]: ASR_BYPASS_ENABLED,
  [FeatureFlag.NATO_APCO]: NATO_APCO_ENABLED,
  [FeatureFlag.MOTOROLA_SSO]: MOTOROLA_SSO_ENABLED,
  [FeatureFlag.ATOMIC_ACTIONS]: ATOMIC_ACTIONS_ENABLED,
  [FeatureFlag.DIALOGFLOW]: DIALOGFLOW_ENABLED,
  [FeatureFlag.GOOGLE_CREATE]: GOOGLE_CREATE_ENABLED,
  [FeatureFlag.TOPICS_AND_COMPONENTS]: TOPICS_AND_COMPONENTS_ENABLED,
  [FeatureFlag.ACCOUNT_PAGE_REDESIGN]: ACCOUNT_PAGE_REDESIGN_ENABLED,
  [FeatureFlag.ENTERPRISE_TRIAL]: ENTERPRISE_TRIAL_ENABLED,
};
