export enum FeatureFlag {
  GADGETS = 'gadgets',
  NATO_APCO = 'nato_apco',
  ASR_BYPASS = 'asr_bypass',
  MOTOROLA_SSO = 'motorola_sso',

  // permanent circuit breaker for ml-gateway integration
  ML_GATEWAY_INTEGRATION = 'ml_gateway_integration',

  // permanent circuit breaker for API/integration access
  DISABLE_INTEGRATION = 'disable_integration',

  ENTERPRISE_TRIAL = 'enterprise_trial',

  NLU_MANAGER = 'nlu_manager',
  NLU_MANAGER_CONFLICTS_VIEW = 'nlu_manager_conflicts_view',
  NLU_MANAGER_UNCLASSIFIED = 'nlu_manager_unclassified',
  NLU_MANAGER_CLUSTERING_VIEW = 'nlu_manager_clustering_view',

  CHAT_CAROUSEL_INTENT = 'chat_carousel_intent',

  EXPERIMENTAL_SYNC_LINKS = 'experimental_sync_links',

  ASSISTANT_INTEGRATION = 'assistant_integration',

  PROMPT_STEP = 'prompt_step',

  DISABLE_CODE_EXPORTS = 'disable_code_exports',

  // integrations
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

  TLS_UPLOAD = 'tls_upload',
  BEAMER_APP = 'beamer_app',

  ANALYTICS_DASHBOARD = 'analytics_dashboard',
  GPT_GENERATIVE_RESPONSE = 'gpt_generative_response',

  ASSISTANT_AI = 'assistant_ai',

  DEPRECATE_WS_KEYS = 'deprecate_ws_keys',

  SUBTOPICS = 'subtopics',
}
