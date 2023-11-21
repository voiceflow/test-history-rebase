export enum FeatureFlag {
  ASR_BYPASS = 'asr_bypass',

  // permanent circuit breaker for API/integration access
  DISABLE_INTEGRATION = 'disable_integration',

  PRO_REVERSE_TRIAL = 'pro_reverse_trial',

  NLU_MANAGER = 'nlu_manager',
  NLU_MANAGER_CONFLICTS_VIEW = 'nlu_manager_conflicts_view',
  NLU_MANAGER_UNCLASSIFIED = 'nlu_manager_unclassified',
  NLU_MANAGER_CLUSTERING_VIEW = 'nlu_manager_clustering_view',

  CHAT_CAROUSEL_INTENT = 'chat_carousel_intent',

  EXPERIMENTAL_SYNC_LINKS = 'experimental_sync_links',

  DISABLE_CODE_EXPORTS = 'disable_code_exports',

  // integrations
  ORG_GENERAL_SETTINGS = 'org_general_settings',

  MVP_CUSTOM_BLOCK = 'mvp_custom_block',

  // Identity service FFs
  IDENTITY_API_KEY = 'identity_api_key',

  ANALYTICS_DASHBOARD_MOCK_DATA = 'analytics_dashboard_mock_data',

  KNOWLEDGE_BASE = 'knowledge_base',

  ASSISTANT_AI = 'assistant_ai',

  ORGANIZATION_MEMBERS = 'organization_members',

  ALLOW_VIEWER_APIKEY_ACCESS = 'allow_viewer_apikey_access',
  DISABLE_SSO_CONFIGURATION_PAGE = 'disable_sso_configuration_page',

  CHAT_UI_FEEDBAK_BUTTONS = 'chat_ui_feedback_buttons',

  PARTIAL_IMPORT = 'partial_import',

  HIDE_EXPORTS = 'hide_exports',

  ALEXA_DEPRECATED = 'alexa_deprecated',
  CHARGEBEE_SWITCHOVER = 'chargebee_switchover',
  CHARGEBEE_TOKENS = 'chargebee_tokens',

  V2_CMS = 'v2_cms',
  CMS_KB = 'cms_kb',
  CMS_FUNCTIONS = 'cms_functions',

  VERSIONED_KB_SETTINGS = 'versioned_kb_settings',

  REALTIME_VF_FILE_IMPORT = 'realtime_vf_file_import',
  THREAD_COMMENTS = 'thread_comments',
  BACKUPS = 'backups',
  REALTIME_PROJECT_EXPORT = 'realtime_project_export',
}
