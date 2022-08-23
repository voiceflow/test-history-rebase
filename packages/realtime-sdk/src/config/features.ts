export enum FeatureFlag {
  GADGETS = 'gadgets',
  NATO_APCO = 'nato_apco',
  ASR_BYPASS = 'asr_bypass',
  MOTOROLA_SSO = 'motorola_sso',
  WAVENET_VOICES = 'wavenet_voices',

  // atomic actions
  ATOMIC_ACTIONS_COMMENTING = 'atomic_actions_commenting',

  // used by select private cloud instances to add a new role type
  OWNER_ROLE = 'owner_role',

  // permanent circuit breakers for vendor integrations
  INTERCOM_INTEGRATION = 'intercom_integration',

  // permanent circuit breaker for ml-gateway integration
  ML_GATEWAY_INTEGRATION = 'ml_gateway_integration',

  ENTERPRISE_TRIAL = 'enterprise_trial',

  NLU_MANAGER = 'nlu_manager',
  NLU_MANAGER_CONFLICTS_VIEW = 'nlu_manager_conflicts_view',

  CHAT_CARDS_CAROUSEL = 'chat_cards_carousel',
  CHAT_CARD_STEP = 'chat_card_step',
  CHAT_CAROUSEL_INTENT = 'chat_carousel_intent',

  EXPERIMENTAL_SYNC_LINKS = 'experimental_sync_links',

  ASSISTANT_INTEGRATION = 'assistant_integration',

  PROMPT_STEP = 'prompt_step',

  DISABLE_CODE_EXPORTS = 'disable_code_exports',

  PRODUCTION_VERSION_MANAGEMENT = 'production_version_management',

  STICKERS_DROPDOWN = 'stickers_dropdown',

  BLOCK_TEMPLATE = 'block_template',

  // canvas and editor updates
  INTEGRATION_STEP_CLEANUP = 'integration_step_cleanup',
  CODE_STEP_CLEANUP = 'code_step_cleanup',
  SPEAK_STEP_CLEANUP = 'speak_step_cleanup',
  TEXT_STEP_CLEANUP = 'text_step_cleanup',
  SET_STEP_CLEANUP = 'set_step_cleanup',
  IF_STEP_CLEANUP = 'if_step_cleanup',
  FLOW_STEP_CLEANUP = 'flow_step_cleanup',
  IMAGE_STEP_CLEANUP = 'image_step_cleanup',
  CONDITIONS_BUILDER_V2 = 'conditions_builder_v2',
  NEW_EDITORS_PART_2 = 'new_editors_part_2',

  ASSISTANT_IA = 'assistant_ia',

  CHAT_VOICE_PROJECT = 'chat_voice_project_type',

  DEFAULT_STEP_COLORS = 'default_step_colors',

  BLOCK_VIA_LINK = 'block_via_link',
}
