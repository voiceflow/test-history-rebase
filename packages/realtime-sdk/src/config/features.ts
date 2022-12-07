export enum FeatureFlag {
  GADGETS = 'gadgets',
  NATO_APCO = 'nato_apco',
  ASR_BYPASS = 'asr_bypass',
  MOTOROLA_SSO = 'motorola_sso',
  WAVENET_VOICES = 'wavenet_voices',

  // used by select private cloud instances to add a new role type
  OWNER_ROLE = 'owner_role',

  // permanent circuit breaker for ml-gateway integration
  ML_GATEWAY_INTEGRATION = 'ml_gateway_integration',

  // permanent circuit breaker for API/integration access
  DISABLE_INTEGRATION = 'disable_integration',

  ENTERPRISE_TRIAL = 'enterprise_trial',

  NLU_MANAGER = 'nlu_manager',
  NLU_MANAGER_CONFLICTS_VIEW = 'nlu_manager_conflicts_view',
  NLU_MANAGER_UNCLASSIFIED = 'nlu_manager_unclassified',
  NLU_MANAGER_CLUSTERING_VIEW = 'nlu_manager_clustering_view',

  CHAT_CARDS_CAROUSEL = 'chat_cards_carousel',
  CHAT_CARD_STEP = 'chat_card_step',
  CHAT_CAROUSEL_INTENT = 'chat_carousel_intent',
  CHAT_CHOICE_STEP = 'chat_choice_step',

  EXPERIMENTAL_SYNC_LINKS = 'experimental_sync_links',

  ASSISTANT_INTEGRATION = 'assistant_integration',

  PROMPT_STEP = 'prompt_step',

  DISABLE_CODE_EXPORTS = 'disable_code_exports',

  STICKERS_DROPDOWN = 'stickers_dropdown',

  // integrations
  DIALOGFLOW_CX = 'dialogflow_cx',

  WEBCHAT = 'webchat',

  WHATSAPP = 'whatsapp',

  MICROSOFT_TEAMS = 'teams',

  DASHBOARD_V2 = 'dashboard_V2',

  MVP_CUSTOM_BLOCK = 'mvp_custom_block',

  // canvas and editor updates
  CONDITIONS_BUILDER_V2 = 'conditions_builder_v2',

  ASSISTANT_IA = 'assistant_ia',

  CHAT_VOICE_PROJECT = 'chat_voice_project_type',

  // Identity service FFs
  IDENTITY_USER = 'identity_user',
  IDENTITY_WORKSPACE = 'identity_workspace',
  IDENTITY_WORKSPACE_INVITE = 'identity_workspace_invite',
  IDENTITY_WORKSPACE_MEMBER = 'identity_workspace_member',
  IDENTITY_ORGANIZATION = 'identity_organization',
  IDENTITY_SAML2_PROVIDER = 'identity_saml2_provider',

  GLOABL_NO_MATCH_NO_REPLY = 'global_no_match_no_reply',
  TLS_UPLOAD = 'tls_upload',
  BEAMER_APP = 'beamer_app',

  ANALYTICS_DASHBOARD = 'analytics_dashboard',
}
