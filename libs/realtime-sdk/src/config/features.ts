export enum FeatureFlag {
  NATO_APCO = 'nato_apco',
  ASR_BYPASS = 'asr_bypass',
  MOTOROLA_SSO = 'motorola_sso',

  // permanent circuit breaker for API/integration access
  DISABLE_INTEGRATION = 'disable_integration',

  ENTERPRISE_TRIAL = 'enterprise_trial',
  PRO_REVERSE_TRIAL = 'pro_reverse_trial',

  NLU_MANAGER = 'nlu_manager',
  NLU_MANAGER_CONFLICTS_VIEW = 'nlu_manager_conflicts_view',
  NLU_MANAGER_UNCLASSIFIED = 'nlu_manager_unclassified',
  NLU_MANAGER_CLUSTERING_VIEW = 'nlu_manager_clustering_view',

  CHAT_CAROUSEL_INTENT = 'chat_carousel_intent',

  EXPERIMENTAL_SYNC_LINKS = 'experimental_sync_links',

  ASSISTANT_INTEGRATION = 'assistant_integration',

  DISABLE_CODE_EXPORTS = 'disable_code_exports',

  // integrations
  ORG_GENERAL_SETTINGS = 'org_general_settings',

  MVP_CUSTOM_BLOCK = 'mvp_custom_block',

  ASSISTANT_IA = 'assistant_ia',

  CHAT_VOICE_PROJECT = 'chat_voice_project_type',

  PROJECT_API_IMPROVEMENTS = 'project_api_improvements',

  // Identity service FFs
  IDENTITY_USER = 'identity_user',
  IDENTITY_API_KEY = 'identity_api_key',
  IDENTITY_ORGANIZATION = 'identity_organization',
  IDENTITY_SAML2_PROVIDER = 'identity_saml2_provider',

  TLS_UPLOAD = 'tls_upload',

  ANALYTICS_DASHBOARD_MOCK_DATA = 'analytics_dashboard_mock_data',

  KNOWLEDGE_BASE = 'knowledge_base',

  ASSISTANT_AI = 'assistant_ai',

  DEPRECATE_WS_KEYS = 'deprecate_ws_keys',

  SUBTOPICS = 'subtopics',

  CHANGE_TOPIC_DOMAIN = 'change_topic_domain',

  DISABLE_API_KEY = 'disable_api_key_ui',
  ORGANIZATION_MEMBERS = 'organization_members',

  ONBOARDING_DASHBOARD_DROP = 'onboarding_dashboard_drop',

  SUNSET_DFES = 'sunset_dfes',

  ALLOW_VIEWER_APIKEY_ACCESS = 'allow_viewer_apikey_access',
  DISABLE_SSO_CONFIGURATION_PAGE = 'disable_sso_configuration_page',
}
