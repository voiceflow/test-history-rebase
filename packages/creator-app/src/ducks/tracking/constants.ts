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
  CLONE_PROJECT = 'Clone Project',
  PROJECT_NEW_COMMENT_THREAD = 'New Comment Thread Created',
  PROJECT_NEW_THREAD_REPLY = 'New Thread Reply Created',
  PROJECT_PUBLISH_ATTEMPT = 'Publish Attempt',
  PROJECT_PUBLISH_SUCCESS = 'Publish Success',
  INTERACTION_MODEL_EXPORTED = 'Interaction Model Exported',
  PROJECT_TRAIN_ASSISTANT = 'Train Assistant',
  PROJECT_INVITATION_COPY = 'Copy Invitation Link',
  PROJECT_MOVE_TYPE_CHANGED = 'Move Type',
  PROJECT_DUPLICATE = 'Duplicate Project',
  PROJECT_DELETE = 'Delete Project',
  PROJECT_ALEXA_PUBLISH_PAGE = 'Alexa Publish Page',
  PROJECT_GOOGLE_PUBLISH_PAGE = 'Google Publish Page',
  PROJECT_API_PAGE = 'API Page',
  PROJECT_CODE_EXPORT_PAGE = 'Code Export Page',
  PROJECT_VERSION_PAGE = 'Version Page',
  SHARE_PROTOTYPE_LINK = 'Testable Link Button',

  PROTOTYPE_MANUAL_NAVIGATION = 'Manual Navigation',

  CANVAS_MENU_LOCK = 'Canvas Menu Lock',
  CANVAS_SPOTLIGHT_OPENED = 'Spotlight Opened',
  CANVAS_CONTROL_HELP_MENU = 'Canvas Control Help Menu',
  CANVAS_CONTROL_INTERACTION_MODEL = 'Canvas Control Interaction Model',
  CANVAS_MARKUP_TEXT = 'Text Markup',
  CANVAS_MARKUP_IMAGE = 'Image Markup',
  CANVAS_COMMENTING_OPENED = 'Canvas Commenting Opened',
  CANVAS_SHORTCUTS_MODAL_OPENED = 'Shortcuts Modal Opened',

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

  UPGRADE = 'Upgrade',
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
}
