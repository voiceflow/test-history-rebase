import { AlexaNode } from '@voiceflow/alexa-types';
import { BaseNode } from '@voiceflow/base-types';
import { BillingPeriod, PlanType } from '@voiceflow/internal';
import type { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';

export * from './file';
export * from './payment';
export * from './plans';
export * from './roles';
export * from './subscription';
export { BlockType } from '@voiceflow/realtime-sdk';

export const ACTIVE_PAID_PLAN = PlanType.PRO;

export const ROOT_DIAGRAM_NAME = 'ROOT';
export const ROOT_DIAGRAM_LABEL = 'Home';

export const CLIPBOARD_DATA_KEY = 'vf-cp-data';

export const ALL_PERSONA_ID = 'c69b48463ec274b68fbd9341980ca657';

export const HOVER_THROTTLE_TIMEOUT = 24;

export const VIEWERS_DEFAULT_LIMIT = 100;

export const PROJECTS_DEFAULT_LIMIT = 3;

export enum BlockCategory {
  USER_INPUT = 'user input',
  RESPONSE = 'response',
  LOGIC = 'logic',
  INTEGRATION = 'integration',
  CHANNEL = 'channel',
}

export enum DragItem {
  TOPICS = 'topics',
  COMPONENTS = 'components',
  BLOCK_MENU = 'blockMenu',
  TOPIC_MENU_ITEMS = 'topicMenuItems',
  LIBRARY = 'library',
}

export const PERMISSIONS = [
  {
    name: 'User Email',
    value: AlexaNode.PermissionType.ALEXA_PROFILE_EMAIL_READ,
    variableMap: true,
  },
  {
    name: 'User Name',
    value: AlexaNode.PermissionType.ALEXA_PROFILE_NAME_READ,
    variableMap: true,
  },
  {
    name: 'User Phone Number',
    value: AlexaNode.PermissionType.ALEXA_PROFILE_MOBILE_NUMBER_READ,
    variableMap: true,
  },
  {
    name: 'Location Services',
    value: AlexaNode.PermissionType.ALEXA_DEVICES_ALL_GEOLOCATION_READ,
    variableMap: true,
  },
  {
    name: 'Reminders',
    value: AlexaNode.PermissionType.ALEXA_ALERTS_REMINDERS_SKILL_READ_WRITE,
  },
  {
    name: 'Lists Read',
    value: AlexaNode.PermissionType.ALEXA_HOUSEHOLD_LISTS_READ,
  },
  {
    name: 'Lists Write',
    value: AlexaNode.PermissionType.ALEXA_HOUSEHOLD_LISTS_WRITE,
  },
  {
    name: 'Notifications',
    value: AlexaNode.PermissionType.ALEXA_DEVICES_ALL_NOTIFICATIONS_WRITE,
  },
  {
    name: 'Skill Personalization',
    value: AlexaNode.PermissionType.ALEXA_PERSON_ID_READ,
    variableMap: true,
  },
  {
    name: 'Account Linking',
    value: AlexaNode.PermissionType.UNOFFICIAL_ACCOUNT_LINKING,
    variableMap: true,
  },
  {
    name: 'Product',
    value: AlexaNode.PermissionType.UNOFFICIAL_PRODUCT,
  },
  {
    name: 'ISP',
    value: AlexaNode.PermissionType.UNOFFICIAL_ISP,
  },
  {
    name: 'Amazon Pay',
    value: AlexaNode.PermissionType.PAYMENTS_AUTO_PAY_CONSENT,
  },
];

export const PERMISSIONS_WITH_VARIABLE_MAPS = PERMISSIONS.filter(({ variableMap }) => variableMap).map(
  ({ value }) => value
);

export const PERMISSION_LABELS: Record<AlexaNode.PermissionType, string> = PERMISSIONS.reduce<Record<string, string>>(
  (acc, permission) => Object.assign(acc, { [permission.value]: permission.name }),
  {}
);

export const ReminderType = {
  TIMER: 'timer',
  SCHEDULED: 'scheduled',
};

export const RESPONSE_COLOR_CODES = {
  GREEN: '#349d51',
  YELLOW: '#e1d40b',
  RED: '#e91e63',
};

export const PERIOD_NAME = {
  [BillingPeriod.MONTHLY]: 'Monthly',
  [BillingPeriod.ANNUALLY]: 'Annually',
};

export const NUMBERS_ONLY_REGEXP = /^\d+$/;
export const VALID_VARIABLE_NAME = /^[A-Z_a-z]\w{0,64}$/;

export type HSLShades = COLOR_PICKER_CONSTANTS.HSLShades;

export const UNLIMITED_EDITORS_CONST = 100;

export enum ExportFormat {
  PNG = 'png',
  PDF = 'pdf',
  JSON = 'json',
  DIALOGS = 'dialogs',
  VF = 'vf',
}

export enum ExportType {
  CANVAS = 'canvas',
  MODEL = 'model',
}

export enum JobStatus {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
}

export enum JobBuiltinStageType {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
}

export enum VariableType {
  LOCAL = 'local',
  GLOBAL = 'global',
  BUILT_IN = 'built-in',
}

export enum GooglePromptType {
  CONSENT = 'consent',
  SELECT_ACCOUNT = 'select_account',
}

export const DEVICE_LABEL_MAP: Record<BaseNode.Visual.DeviceType, string> = {
  [BaseNode.Visual.DeviceType.MOBILE]: 'Mobile',
  [BaseNode.Visual.DeviceType.TABLET]: 'Tablet',
  [BaseNode.Visual.DeviceType.DESKTOP]: 'Desktop',
  [BaseNode.Visual.DeviceType.SMART_WATCH]: 'Smart Watch',
  [BaseNode.Visual.DeviceType.TELEVISION]: 'Television',
  [BaseNode.Visual.DeviceType.IN_CAR_DISPLAY]: 'In-Car Display',
  [BaseNode.Visual.DeviceType.ECHO_SPOT]: 'Echo Spot',
  [BaseNode.Visual.DeviceType.ECHO_SHOW_8]: 'Echo Show 8',
  [BaseNode.Visual.DeviceType.ECHO_SHOW_10]: 'Echo Show 10',
  [BaseNode.Visual.DeviceType.FIRE_HD_8]: 'Fire HD 8',
  [BaseNode.Visual.DeviceType.FIRE_HD_10]: 'Fire HD 10',
  [BaseNode.Visual.DeviceType.FIRE_TV_CUBE]: 'Fire TV Cube',
  [BaseNode.Visual.DeviceType.GOOGLE_NEST_HUB]: 'Google Nest Hub',
};

export const MAX_ALEXA_REPROMPTS = 3;

export const MAX_SYSTEM_MESSAGES_COUNT = 22;

export const CANVAS_ZOOM_DELTA = 15;

export enum PageProgressBar {
  CANVAS_LOADING = 'CANVAS_LOADING',
  TOPIC_CREATING = 'TOPIC_CREATING',
  DOMAIN_CREATING = 'DOMAIN_CREATING',
  DOMAIN_DELETING = 'DOMAIN_DELETING',
  SUBTOPIC_CREATING = 'SUBTOPIC_CREATING',
  DOMAIN_DUPLICATING = 'DOMAIN_DUPLICATING',
  COMPONENT_CREATING = 'COMPONENT_CREATING',
  NLU_MODEL_TRAINNING = 'NLU_MODEL_TRAINNING',
  ASSISTANT_DUPLICATING = 'ASSISTANT_DUPLICATING',
  IMPORT_VF_FILE = 'IMPORT_VF_FILE',
}

export enum NLUImportOrigin {
  PROJECT = 'Assistant Create',
}

export const ALEXA_SUNSET_PROJECT_ID = '62e424a61f2f9a0006572066';

export enum StepMenuType {
  LINK = 'link',
  TOPIC = 'topic',
  SIDEBAR = 'sidebar',
}

export const DASHBOARD_V2_RELEASE_DATE = '2023-03-16T17:00:00.000Z';
