export const STATE_KEY = 'tracking';

export const TRACK_SESSION_BEGIN = 'TRACK:SESSION:BEGIN';
export const TRACK_SESSION_DURATION = 'TRACK:SESSION:DURATION';
export const TRACK_ONBOARDING_STAGE = 'TRACK:ONBOARDING:STAGE';
export const TRACK_ONBOARDING_CHOICE = 'TRACK:ONBOARDING:CHOICE';

export enum EventName {
  SESSION_BEGIN = 'Begin New Session',
  SESSION_DURATION = 'Creator Session Duration',

  INVITATION_CANCEL = 'Cancel Invitation',
  INVITATION_ACCEPT = 'Accept Invitation',
  INVITATION_SEND_EMAIL = 'Send Invitation Email',

  PROJECT_SESSION_BEGIN = 'Begin Project Session',
  PROJECT_SETTINGS_OPENED = 'Settings Opened',
  PROJECT_SESSION_DURATION = 'Project Session Duration',
  PROJECT_PROTOTYPE_TEST_START = 'Prototype Test Start',

  CANVAS_MENU_LOCK = 'Canvas Menu Lock',
  CANVAS_SPOTLIGHT_OPENED = 'Spotlight Opened',
  CANVAS_CONTROL_HELP_MENU = 'Canvas Control Help Menu',
  CANVAS_CONTROL_INTERACTION_MODEL = 'Canvas Control Interaction Model',

  ONBOARDING_PAY = 'Onboarding - Pay',
  ONBOARDING_JOIN = 'Onboarding - Join',
  ONBOARDING_CREATE = 'Onboarding - Create',
  ONBOARDING_COMPLETE = 'Onboarding - Complete',
  ONBOARDING_PERSONALIZE = 'Onboarding - Personalize',
  ONBOARDING_COLLABORATORS = 'Onboarding - Collaborators',

  EXPORT_BUTTON_CLICK = 'Export Button Click',
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
