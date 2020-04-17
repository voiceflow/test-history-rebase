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
}

export enum OnboardingStage {
  TEAM = 'team',
  USAGE = 'usage',
  WELCOME = 'welcome',
  COMPLETE = 'complete',
  EXPERIENCE = 'experience',
}

export enum OnboardingChoice {
  TEAM = 'onboarding_team',
  USAGE = 'onboarding_usage',
  EXPERIENCE = 'onboarding_experience',
}

export enum OnboardingTeam {
  PERSONAL = 'personal',
  PROFESSIONAL = 'professional',
}

export enum OnboardingUsage {
  BUILD_AND_PUBLISH = 'build_and_publish',
  DESIGN_AND_PROTOTYPE = 'design_and_prototype',
}

export enum OnboardingExperience {
  EXPERT = 'expert',
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
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
