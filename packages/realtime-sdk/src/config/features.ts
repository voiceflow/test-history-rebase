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

  ENTERPRISE_TRIAL = 'enterprise_trial',

  // variable states
  VARIABLE_STATES = 'variable_states',
  VARIABLE_STATES_STARTING_BLOCKS = 'variable_states_starting_blocks',

  IMM_MODALS_V2 = 'imm_modals_v2',
  NLU_MANAGER = 'nlu_manager',

  PROJECT_CREATE = 'project_create',

  CHAT_CARDS_CAROUSEL = 'chat_cards_carousel',

  EXPERIMENTAL_SYNC_LINKS = 'experimental_sync_links',

  REVISED_CREATOR_ENTITLEMENTS = 'revised_creator_entitlement',
  CANVAS_PREVIEW = 'step_editor_update',
  STEP_EDITOR_UPDATES = 'step_editor_update',
}
