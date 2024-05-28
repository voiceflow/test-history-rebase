export enum FeatureFlag {
  ASR_BYPASS = 'asr_bypass',

  // permanent circuit breaker for API/integration access
  DISABLE_INTEGRATION = 'disable_integration',

  PRO_REVERSE_TRIAL = 'pro_reverse_trial',

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

  KNOWLEDGE_BASE_INTEGRATIONS = 'kb_platform_integration',

  ASSISTANT_AI = 'assistant_ai',

  ORGANIZATION_MEMBERS = 'organization_members',

  ALLOW_VIEWER_APIKEY_ACCESS = 'allow_viewer_apikey_access',
  DISABLE_SSO_CONFIGURATION_PAGE = 'disable_sso_configuration_page',

  CHAT_UI_FEEDBAK_BUTTONS = 'chat_ui_feedback_buttons',

  PARTIAL_IMPORT = 'partial_import',

  // This is a legacy FF specifically for JPMC, the logic evolved to something that the name doesn't represent anymore
  // This FF essentially just hides the SHARE prototype feature, the intention here is to rip this FF out soon since it's
  // not good practice to have 1 off FFs for specific customers
  HIDE_EXPORTS = 'hide_exports',

  ALEXA_DEPRECATED = 'alexa_deprecated',
  CHARGEBEE_SWITCHOVER = 'chargebee_switchover',
  CHARGEBEE_TOKENS = 'chargebee_tokens',

  CMS_FUNCTIONS = 'cms_functions',

  VERSIONED_KB_SETTINGS = 'versioned_kb_settings',

  // LLM/AI
  HYBRID_CLASSIFY = 'hybrid_classify',

  AI_CAPTURE = 'ai_capture',

  INTENT_CLASSIFICATION = 'intent_classification',

  VF_CHUNKS_VARIABLE = 'vf_chunks_variable',

  UNLIMITED_KB_DOCS_FF = 'unlimited_kb_docs_ff',

  KB_EMBEDDING_MODEL_SETTING = 'kb_embedding_model_setting',

  // functions
  FUNCTION_LISTEN = 'function_listen',

  TEAMS_PLAN_SELF_SERVE = 'teams_plan_self_serve',

  DISABLE_CHECKOUT = 'disable_checkout',
  RUN_MIGRATION_ON_IMPORT = 'run_migration_on_import',

  // CMS
  CMS_RESPONSES = 'cms_response',

  TRIGGER_STEP = 'trigger_step',

  // Export
  EXPORT_SPECIFIC_OBJECT = 'export_specific_object',

  HTTP_LOAD_ENVIRONMENT = 'http_load_environment',
  NEW_ORGANIZATION_MEMBERS = 'new_organization_members',
  NEW_WORKSPACE_MEMBERS = 'new_workspace_members',
  NEW_PROJECT_MEMBERS = 'new_project_members',
}
