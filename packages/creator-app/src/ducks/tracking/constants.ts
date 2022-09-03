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

  INVITATION_CANCEL = 'Cancel Invitation',
  INVITATION_ACCEPT = 'Accept Invitation',
  INVITATION_SEND_EMAIL = 'Send Invitation Email',

  PROJECT_SESSION_BEGIN = 'Begin Project Session',
  PROJECT_SETTINGS_OPENED = 'Settings Opened',
  PROJECT_SESSION_DURATION = 'Project Session Duration',
  PROJECT_PROTOTYPE_TEST_START = 'Prototype Test Start',
  PROJECT_PROTOTYPE_TEST_CLICK = 'Test Button',
  PROJECT_SHARE_DOWNLOAD_LINK = 'Project Download Button',
  PROJECT_EXPORTED = 'Project Exported',

  CLONE_PROJECT = 'Clone Project',
  PROJECT_NEW_COMMENT_THREAD = 'New Comment Thread Created',
  PROJECT_NEW_THREAD_REPLY = 'New Thread Reply Created',
  PROJECT_PUBLISH_ATTEMPT = 'Publish Attempt',
  PROJECT_PUBLISH_SUCCESS = 'Publish Success',
  INTERACTION_MODEL_EXPORTED = 'Interaction Model Exported',
  PROJECT_TRAIN_ASSISTANT = 'Train Assistant',
  PROJECT_INVITATION_COPY = 'Copy Invitation Link',
  PROJECT_MOVE_TYPE_CHANGED = 'Move Type',
  PROJECT_BLOCK_TEST_START = 'Start Test from Block',
  PROJECT_DUPLICATE = 'Duplicate Project',
  PROJECT_DELETE = 'Delete Project',
  PROJECT_ALEXA_PUBLISH_PAGE = 'Alexa Publish Page',
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

  CANVAS_MENU_LOCK = 'Canvas Menu Lock',
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
  ENTITIES_EDIT = 'Entities Edit',

  ENTITY_CREATED = 'Entity Created',
  VERSION_MANUALLY_CREATED = 'Version Manually Created',
  VARIABLE_CREATED = 'Variable Created',

  DEVELOPER_ACCOUNT_CONNECTED = 'Developer Account Connected',

  TOPIC_CREATED = 'Topic Created',
  TOPIC_DELETED = 'Topic Deleted',
  TOPIC_CONVERSION = 'Topic Conversion',

  COMPONENT_CREATED = 'Component Created',
  COMPONENT_DELETED = 'Component Deleted',

  DOMAIN_CONVERT = 'Convert to Domain',
  DOMAIN_CREATED = 'Domain Created',
  DOMAIN_DELETED = 'Domain Deleted',
  DOMAIN_DUPLICATED = 'Domain Duplicated',

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
  UTTERANCE_RECOMMENDATION_OPENED = 'Utterance Recommendation Opened',
  UTTERANCE_RECOMMENDATION_ACCEPTED = 'Utterance Recommendation Accepted',
  UTTERANCE_RECOMMENDATION_REJECTED = 'Utterance Recommendation Rejected',
  UTTERANCE_RECOMMENDATION_REFRESHED = 'Utterance Recommendation Refreshed',
  NLU_MANAGER_OPENED = 'NLU Manager Opened',
  NLU_MANAGER_NAVIGATION = 'NLU Manager Navigation',
  NLU_NOTIFICATIONS_OPENED = 'NLU Notifications Opened',
  NLU_NOTIFICATIONS_CLICKED = 'NLU Notifications Clicked',

  BLOCK_TEMPLATE_CREATED = 'Block Template Created',
}

export enum IntentEditType {
  EDITOR = 'editor',
  IMM = 'imm',
}

export enum VariableType {
  COMPONENT = 'component',
  GLOBAL = 'global',
}

export enum CanvasCreationType {
  EDITOR = 'editor',
  IMM = 'imm',
  PASTE = 'paste',
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

export enum CanvasMenuLockState {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
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
  WORKSPACE_LIMIT = 'Workspace Limit',
  EXPORT_CSV_NLU = 'Export NLU as CSV',
  EXPORT_NLU = 'Export NLU',
  IMPORT_NLU = 'Import NLU',
  SUPPORTED_NLUS = 'Supported NLUs',
  EXPORT_PROJECT = 'Export Project as PNG or PDF',
  EXPORT_PROJECT_CSV = 'Export Project as CSV',
  TRANSCRIPTS = 'Transcripts',
  VARIABLE_STATES_LIMIT = 'Variable States Limit',
  DOMAINS = 'Domains',
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
