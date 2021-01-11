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
  PROJECT_SHARE_TESTABLE_LINK = 'Testable Link Button',
  PROJECT_SHARE_DOWNLOAD_LINK = 'Project Download Button',
  CLONE_PROJECT = 'Clone Project',
  PROJECT_NEW_COMMENT_THREAD = 'New Comment Thread Created',
  PROJECT_NEW_THREAD_REPLY = 'New Thread Reply Created',
  PROJECT_PUBLISH_ATTEMPT = 'Publish Attempt',
  PROJECT_PUBLISH_SUCCESS = 'Publish Success',
  PROJECT_TRAIN_ASSISTANT = 'Train Assistant',

  PROTOTYPE_MANUAL_NAVIGATION = 'Manual Navigation',

  CANVAS_MENU_LOCK = 'Canvas Menu Lock',
  CANVAS_SPOTLIGHT_OPENED = 'Spotlight Opened',
  CANVAS_CONTROL_HELP_MENU = 'Canvas Control Help Menu',
  CANVAS_CONTROL_INTERACTION_MODEL = 'Canvas Control Interaction Model',
  CANVAS_MARKUP_OPENED = 'Canvas Markup Opened',
  CANVAS_MARKUP_DURATION = 'Markup Session Duration',
  CANVAS_COMMENTING_OPENED = 'Canvas Commenting Opened',

  ONBOARDING_PAY = 'Onboarding - Pay',
  ONBOARDING_JOIN = 'Onboarding - Join',
  ONBOARDING_CREATE = 'Onboarding - Create',
  ONBOARDING_COMPLETE = 'Onboarding - Complete',
  ONBOARDING_PERSONALIZE = 'Onboarding - Personalize',
  ONBOARDING_COLLABORATORS = 'Onboarding - Collaborators',

  REFERRAL_SIGNUP = 'Referral Signup',

  EXPORT_BUTTON_CLICK = 'Export Button Click',

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
