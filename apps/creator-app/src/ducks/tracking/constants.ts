export const STATE_KEY = 'tracking';

export const TRACK_SESSION_BEGIN = 'TRACK:SESSION:BEGIN';
export const TRACK_SESSION_DURATION = 'TRACK:SESSION:DURATION';
export const TRACK_ONBOARDING_STAGE = 'TRACK:ONBOARDING:STAGE';
export const TRACK_ONBOARDING_CHOICE = 'TRACK:ONBOARDING:CHOICE';

export enum EventName {
  SESSION_BEGIN = 'Begin New Session',
  SESSION_DURATION = 'Creator Session Duration',

  WORKSPACE_DELETE = 'Delete Workspace',
  WORKSPACE_SESSION_BEGIN = 'Begin Workspace Session',

  INVITATION_ACCEPT = 'Accept Invitation',
  INVITATION_COPY_LINK = 'Copy Invitation Link',

  PROJECT_SESSION_BEGIN = 'Begin Project Session',
  PROJECT_SETTINGS_OPENED = 'Settings Opened',
  PROJECT_SESSION_DURATION = 'Project Session Duration',
  PROJECT_PROTOTYPE_TEST_START = 'Prototype Test Start',
  PROJECT_PROTOTYPE_TEST_CLICK = 'Test Button',
  PROJECT_SHARE_DOWNLOAD_LINK = 'Project Download Button',
  PROJECT_EXPORTED = 'Project Exported',
  PROJECT_CREATED = 'Project Created',

  PROJECT_NEW_COMMENT_THREAD = 'New Comment Thread Created',
  PROJECT_NEW_THREAD_REPLY = 'New Thread Reply Created',
  PROJECT_PUBLISH_ATTEMPT = 'Publish Attempt',
  INTERACTION_MODEL_EXPORTED = 'Interaction Model Exported',
  PROJECT_TRAIN_ASSISTANT = 'Train Assistant',
  PROJECT_MOVE_TYPE_CHANGED = 'Move Type',
  PROJECT_BLOCK_TEST_START = 'Start Test from Block',
  PROJECT_CANVAS_PROTOTYPE_END = 'Prototype Test Completed',
  PROJECT_DUPLICATE = 'Duplicate Project',
  PROJECT_DELETE = 'Delete Project',
  PROJECT_GOOGLE_PUBLISH_PAGE = 'Google Publish Page',
  PROJECT_API_PAGE = 'API Page',
  PROJECT_CODE_EXPORT_PAGE = 'Code Export Page',
  PROJECT_VERSION_PAGE = 'Version Page',
  PROJECT_EXIT = 'Project Exit',
  PROJECT_NEW_UTTERANCE_CREATED = 'New Utterance Created',
  PROJECT_UTTERANCE_BULK_IMPORT = 'Utterance Bulk Import',
  PROJECT_NEW_STEP_CREATED = 'New Step Created',
  PROJECT_NLU_IMPORT = 'NLU Imported',
  PROJECT_NLU_IMPORT_FAILED = 'NLU Import Failed',

  SHARE_PROTOTYPE_LINK = 'Testable Link Button',

  PROTOTYPE_MANUAL_NAVIGATION = 'Manual Navigation',

  PUBLIC_PROTOTYPE_VIEW = 'Share View Session',
  PUBLIC_PROTOTYPE_USED = 'Shared Prototype Used',

  CANVAS_SPOTLIGHT_OPENED = 'Spotlight Opened',
  CANVAS_CONTROL_HELP_MENU = 'Canvas Control Help Menu',
  CANVAS_CONTROL_INTERACTION_MODEL = 'Canvas Control Interaction Model',
  CANVAS_MARKUP_TEXT = 'Text Markup',
  CANVAS_MARKUP_IMAGE = 'Image Markup',
  CANVAS_COMMENTING_OPENED = 'Canvas Commenting Opened',
  CANVAS_SHORTCUTS_MODAL_OPENED = 'Shortcuts Modal Opened',

  CONVERSATIONS_SESSION_START = 'Conversations Page Opened',
  CONVERSATION_EXPORT = 'Conversation Exported',
  CONVERSATION_DELETE = 'Conversation Deleted',
  CONVERSATION_NOTES_UPDATED = 'Conversation Notes Updated',
  CONVERSATION_LIST_FILTERED = 'Conversation List Filtered',
  CONVERSATION_TAG_ADDED = 'Conversation Tag Added',
  CONVERSATION_TAG_DELETE = 'Conversation Tag Deleted',
  CONVERSATION_UTTERANCE_SAVE = 'Conversation Utterance Saved',

  ONBOARDING_PAY = 'Onboarding - Pay',
  ONBOARDING_JOIN = 'Onboarding - Join',
  ONBOARDING_SELECT_CHANNEL = 'Onboarding - Select Channel',
  ONBOARDING_CREATE = 'Onboarding - Create',
  ONBOARDING_COMPLETE = 'Onboarding - Complete',
  ONBOARDING_PERSONALIZE = 'Onboarding - Personalize',
  ONBOARDING_COLLABORATORS = 'Onboarding - Collaborators',

  REFERRAL_SIGNUP = 'Referral Signup',

  EXPORT_BUTTON_CLICK = 'Export Button Click',
  UPGRADE_PROMPT = 'Upgrade Prompt',
  UPGRADE_MODAL = 'Upgrade Modal',
  CONTACT_SALES = 'Contact Sales',

  UPGRADE = 'Upgrade',

  IMM_NAVIGATION = 'IMM Navigation',
  PROJECT_RESTORE = 'Project Restore',
  VERSION_PREVIEW = 'Version Preview',
  INTENTS_EDIT = 'Intents Edit',
  INTENT_CREATED = 'Intents Created',
  NLU_ENTITIES_EDIT = 'NLU Entity Edited',

  ENTITY_CREATED = 'Entity Created',
  VERSION_MANUALLY_CREATED = 'Version Manually Created',
  VARIABLE_CREATED = 'Variable Created',

  DEVELOPER_ACCOUNT_CONNECTED = 'Developer Account Connected',

  TOPIC_CREATED = 'Topic Created',
  TOPIC_DELETED = 'Topic Deleted',
  TOPIC_CONVERSION = 'Topic Conversion',
  TOPIC_MOVED_DOMAIN = 'Topic Moved Domain',
  SUBTOPIC_CREATED = 'Subtopic Created',
  SUBTOPIC_MOVED = 'Subtopic Moved',

  COMPONENT_CREATED = 'Component Created',
  COMPONENT_DELETED = 'Component Deleted',

  NO_MATCH_CREATED = 'No Match Created',
  NO_REPLY_CREATED = 'No Reply Created',

  DOMAIN_CONVERT = 'Convert to Domain',
  DOMAIN_CREATED = 'Domain Created',
  DOMAIN_DELETED = 'Domain Deleted',
  DOMAIN_DUPLICATED = 'Domain Duplicated',
  DOMAIN_STATUS_CHANGED = 'Domain Status Changed',

  PROFILE_NAME_CHANGED = 'Profile Name Changed',
  PROFILE_EMAIL_CHANGED = 'Profile Email Changed',
  PROFILE_PASSWORD_CHANGED = 'Profile Password Changed',

  VARIABLE_STATE_CREATED = 'Variable State Created',
  VARIABLE_STATE_EDITED = 'Variable State Edited',
  VARIABLE_STATE_DELETED = 'Variable State Deleted',
  VARIABLE_STATE_APPLIED = 'Variable State Applied',

  SUBSCRIPTION_CREATED = 'Subscription Created',

  SEARCH_BAR_QUERY = 'Search Bar Query',
  SEARCH_BAR_RESULT_SELECTED = 'Search Bar Result Selected',

  ACTION_ADDED = 'Action Added',
  ACTION_DELETED = 'Action Deleted',

  // NLU Manager
  CONFLICTS_VIEWED = 'Conflicts Viewed',
  CONFLICT_VIEW_CHANGES_APPLIED = 'Conflict View Changes Applied',
  NLU_MANAGER_OPENED = 'NLU Manager Opened',
  NLU_MANAGER_NAVIGATION = 'NLU Manager Navigation',
  NLU_NOTIFICATIONS_OPENED = 'NLU Notifications Opened',

  // Block Template
  BLOCK_TEMPLATE_CREATED = 'Block Template Created',
  BLOCK_TEMPLATE_USED = 'Block Template Used',

  // BEGIN FIXME: MVP - Custom blocks
  NEW_CUSTOM_BLOCK_CREATED = 'New custom block created',
  CUSTOM_BLOCK_POINTER_CREATED = 'Custom block pointer created',
  CUSTOM_BLOCK_PROTOTYPED = 'Custom block prototyped',
  // END FIXME: MVP - Custom blocks

  // BEGIN Web Chat Configuration
  WEBCHAT_CONFIGURATION_SNIPPET_COPIED = 'Web Chat Configuration - Snippet Copied',
  WEBCHAT_CONFIGURATION_STATUS_CHANGED = 'Web Chat Configuration - Status Changed',
  WEBCHAT_CONFIGURATION_CUSTOMIZATION = 'Web Chat Configuration - Customization',
  // END Web Chat Configuration

  // GPT Events
  AI_FEATURE_TOGGLED = 'AI Feature Toggled',
  AI_QUOTA_CHECK = 'AI Quota Check',
  AI_QUOTA_DEPLETED = 'AI Quota Depleted',
  NON_AI_NO_MATCH_GENERATE = 'Non AI No Match Generate',
  AI_RESULT_JUDGEMENT = 'AI Result Judgement',
  GENERATE_NO_MATCH_DISCLAIMER_ACCEPTED = 'Generate No Match disclaimer accepted',
  GENERATE_STEP_DISCLAIMER_ACCEPTED = 'Generate Step disclaimer accepted',

  // Dashboard
  DASHBOARD_LINK_CLICKED = 'Dashboard Link Clicked',
  DASHBOARD_STYLE_CHANGED = 'Dashboard Style Changed',

  // Seats and payment
  PLAN_CHANGED = 'Plan Changed',
  SEATS_CHANGE = 'Seat Change',
}

export enum IntentEditType {
  EDITOR = 'editor',
  IMM = 'imm',
  NLU_MANAGER = 'nlu manager',
  QUICKVIEW = 'quickview',
}

export enum VariableType {
  COMPONENT = 'component',
  GLOBAL = 'global',
}

export enum CanvasCreationType {
  EDITOR = 'editor',
  IMM = 'imm',
  PASTE = 'paste',
  QUICKVIEW = 'quickview',
  NLU_MANAGER = 'nlu manager',
  UTTERANCE_UPLOAD = 'utterance upload',
  RECOMMENDATION = 'recommendation',
  PROJECT_CREATE = 'project create',
}

export enum NLUEntityCreationType {
  NLU_MANAGER = 'nlu manager',
  NLU_QUICKVIEW = 'quickview',
  IMM = 'imm',
}

export enum NLUManagerOpenedOrigin {
  LEFT_NAV = 'left-nav',
  QUICKVIEW = 'quickview',
}

export enum UploadType {
  BULK = 'bulk',
  SINGLE = 'single',
}

export enum OnboardingChoice {
  TEAM = 'onboarding_team',
  USAGE = 'onboarding_usage',
  EXPERIENCE = 'onboarding_experience',
}

export enum CanvasControlHelpMenuResource {
  DOCS = 'Docs',
  TUTORIALS = 'Tutorials',
  TEMPLATES = 'Templates',
  COMMUNITY = 'Community',
  SHORTCUTS = 'Shortcuts',
}

export enum UpgradePrompt {
  REAL_TIME_COLLABORATION = 'Real Time Collaboration',
  PROJECT_LIMIT = 'Project Limit',
  EDITOR_SEATS = 'Editor seats',
  VIEWER_SEATS = 'Viewer seats',
  WORKSPACE_LIMIT = 'Workspace Limit',
  EXPORT_CSV_NLU = 'Export NLU as CSV',
  EXPORT_NLU = 'Export NLU',
  IMPORT_NLU = 'Import NLU',
  NLU_CONFLICTS = 'NLU Conflicts',
  SUPPORTED_NLUS = 'Supported NLUs',
  EXPORT_PROJECT = 'Export Project as PNG or PDF',
  TRANSCRIPTS = 'Transcripts',
  VARIABLE_STATES_LIMIT = 'Variable States Limit',
  DOMAINS = 'Domains',
  LOCKED_STEPS = 'Locked Steps',
}

export enum SourceType {
  ACCOUNT_PAGE = 'Account Page',
  PROJECT = 'Project',
  STEP = 'Step',
}

export enum VariableStateAppliedType {
  LOCAL = 'Local',
  SHAREABLE_LINK = 'Shareable Link',
}

export enum AssistantOriginType {
  NLU_MANAGER = 'NLU Manager',
  TEST_TOOL = 'Test Tool',
}

export enum ModelExportOriginType {
  NLU_MANAGER = 'NLU Manager',
  SHARE_MENU = 'Share Menu',
}

export enum NoMatchCreationType {
  GLOBAL = 'global',
  STEP = 'step',
}

export enum ProjectSourceType {
  NEW = 'new',
  CLONE_LINK = 'clone_link',
  DUPLICATE = 'duplicate',
  IMPORT = 'import',
}
