/* eslint-disable no-process-env */

import { INTERCOM_ENABLED } from '.';

const GADGETS_ENABLED = process.env.FF_GADGETS === 'true';
const NATO_APCO_ENABLED = process.env.FF_NATO_ACPO === 'true';
const CAPTURE_V2_ENABLED = process.env.FF_CAPTURE_V2 === 'true';
const OWNER_ROLE_ENABLED = process.env.FF_OWNER_ROLE === 'true';
const ASR_BYPASS_ENABLED = process.env.FF_ASR_BYPASS === 'true';
const MOTOROLA_SSO_ENABLED = process.env.FF_MOTOROLA_SSO === 'true';
const WAVENET_VOICES_ENABLED = process.env.FF_WAVENET_VOICES === 'true';
const ENTERPRISE_TRIAL_ENABLED = process.env.FF_ENTERPRISE_TRIAL_ENABLED === 'true';
const TOPICS_AND_COMPONENTS_ENABLED = process.env.FF_TOPICS_AND_COMPONENTS === 'true';
const VARIABLE_STATES_ENABLED = process.env.FF_VARIABLE_STATES === 'true';
const IMM_MODALS_V2 = process.env.FF_IMM_MODALS_V2 === 'true';
const NLU_MANAGER_ENABLED = process.env.FF_NLU_MANAGER === 'true';
const PROJECT_CREATE_ENABLED = process.env.FF_PROJECT_CREATE === 'true';

export enum FeatureFlag {
  GADGETS = 'gadgets',
  NATO_APCO = 'nato_apco',
  CAPTURE_V2 = 'capture_v2',
  ASR_BYPASS = 'asr_bypass',
  MOTOROLA_SSO = 'motorola_sso',
  WAVENET_VOICES = 'wavenet_voices',
  TOPICS_AND_COMPONENTS = 'topics_and_components',

  // atomic actions
  ATOMIC_ACTIONS_PHASE_2 = 'atomic_actions_phase_2',
  ATOMIC_ACTIONS_AWARENESS = 'atomic_actions_awareness',

  // used by select private cloud instances to add a new role type
  OWNER_ROLE = 'owner_role',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',

  ENTERPRISE_TRIAL = 'enterprise_trial',

  VARIABLE_STATES = 'variable_states',

  IMM_MODALS_V2 = 'imm_modals_v2',
  NLU_MANAGER = 'nlu_manager',

  PROJECT_CREATE = 'project_create',
}

export const LOCAL_FEATURE_OVERRIDES: Partial<Record<FeatureFlag, boolean>> = {
  [FeatureFlag.GADGETS]: GADGETS_ENABLED,
  [FeatureFlag.NATO_APCO]: NATO_APCO_ENABLED,
  [FeatureFlag.CAPTURE_V2]: CAPTURE_V2_ENABLED,
  [FeatureFlag.OWNER_ROLE]: OWNER_ROLE_ENABLED,
  [FeatureFlag.ASR_BYPASS]: ASR_BYPASS_ENABLED,
  [FeatureFlag.MOTOROLA_SSO]: MOTOROLA_SSO_ENABLED,
  [FeatureFlag.WAVENET_VOICES]: WAVENET_VOICES_ENABLED,
  [FeatureFlag.ENTERPRISE_TRIAL]: ENTERPRISE_TRIAL_ENABLED,
  [FeatureFlag.INTERCOM_INTEGRATION]: INTERCOM_ENABLED,
  [FeatureFlag.TOPICS_AND_COMPONENTS]: TOPICS_AND_COMPONENTS_ENABLED,
  [FeatureFlag.VARIABLE_STATES]: VARIABLE_STATES_ENABLED,
  [FeatureFlag.IMM_MODALS_V2]: IMM_MODALS_V2,
  [FeatureFlag.NLU_MANAGER]: NLU_MANAGER_ENABLED,
  [FeatureFlag.PROJECT_CREATE]: PROJECT_CREATE_ENABLED,
};
