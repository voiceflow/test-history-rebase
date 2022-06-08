export enum FeatureFlag {
  GADGETS = 'gadgets',
  NATO_APCO = 'nato_apco',
  ASR_BYPASS = 'asr_bypass',
  MOTOROLA_SSO = 'motorola_sso',
  WAVENET_VOICES = 'wavenet_voices',
  TOPICS_AND_COMPONENTS = 'topics_and_components',

  // atomic actions
  ATOMIC_ACTIONS_PHASE_2 = 'atomic_actions_phase_2',
  ATOMIC_ACTIONS_AWARENESS = 'atomic_actions_awareness',
  MIGRATION_SYSTEM = 'migration_system',

  // used by select private cloud instances to add a new role type
  OWNER_ROLE = 'owner_role',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',

  // permanent circuit breaker for ml-gateway integration
  ML_GATEWAY_INTEGRATION = 'ml_gateway_integration',

  ENTERPRISE_TRIAL = 'enterprise_trial',

  // variable states
  VARIABLE_STATES = 'variable_states',
  VARIABLE_STATES_STARTING_BLOCKS = 'variable_states_starting_blocks',

  IMM_MODALS_V2 = 'imm_modals_v2',
  NLU_MANAGER = 'nlu_manager',

  PROJECT_CREATE = 'project_create',

  CHAT_CARDS_CAROUSEL = 'chat_cards_carousel',
  CHAT_CAROUSEL_INTENT = 'chat_carousel_intent',

  EXPERIMENTAL_SYNC_LINKS = 'experimental_sync_links',

  ASSISTANT_INTEGRATION = 'assistant_integration',

  REVISED_CREATOR_ENTITLEMENTS = 'revised_creator_entitlement',

  DISABLE_CODE_EXPORTS = 'disable_code_exports',
  // canvas and editor updates
  INTEGRATION_STEP_CLEANUP = 'integration_step_cleanup',
  CODE_STEP_CLEANUP = 'code_step_cleanup',
  SPEAK_STEP_CLEANUP = 'speak_step_cleanup',
  TEXT_STEP_CLEANUP = 'text_step_cleanup',
  SET_STEP_CLEANUP = 'set_step_cleanup',
  IF_STEP_CLEANUP = 'if_step_cleanup',
}
