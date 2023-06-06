import { AlexaNode } from '@voiceflow/alexa-types';
import { BaseNode } from '@voiceflow/base-types';
import { BillingPeriod, PlanType } from '@voiceflow/internal';
import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';

import { Pair } from '@/types';

export * from './file';
export * from './links';
export * from './plans';
export * from './roles';
export * from './subscription';
export type { MarkupBlockType, RootOrMarkupBlockType } from '@voiceflow/realtime-sdk';
export { BlockType, CUSTOM_SLOT_TYPE, DialogType, LEGACY_CUSTOM_SLOT_TYPE } from '@voiceflow/realtime-sdk';

export const ACTIVE_PAID_PLAN = PlanType.PRO;

export const ROOT_DIAGRAM_NAME = 'ROOT';
export const ROOT_DIAGRAM_LABEL = 'Home';
export const DIAGRAM_ID_SEPARATOR = '::';

export const PREFILLED_UTTERANCE_PARAM = 'utterance';

export const CLIPBOARD_DATA_KEY = 'vf-cp-data';

export const HOVER_THROTTLE_TIMEOUT = 24;

export const EDITOR_DEFAULT_LIMIT = 3;

export const VIEWERS_DEFAULT_LIMIT = 100;

export const PROJECTS_DEFAULT_LIMIT = 3;

export const ZERO_VECTOR: Pair<number> = [0, 0];

export enum BlockCategory {
  USER_INPUT = 'user input',
  RESPONSE = 'response',
  LOGIC = 'logic',
  INTEGRATION = 'integration',
  CHANNEL = 'channel',
}

export enum DragItem {
  COMPONENTS = 'components',
  BLOCK_MENU = 'blockMenu',
  LIBRARY = 'library',
}

export enum SessionType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  BASIC_AUTH = 'session',
  SIGN_UP = 'user',
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

export const PERMISSIONS_WITH_VARIABLE_MAPS = PERMISSIONS.filter(({ variableMap }) => variableMap).map(({ value }) => value);

export const PERMISSION_LABELS: Record<AlexaNode.PermissionType, string> = PERMISSIONS.reduce<Record<string, string>>(
  (acc, permission) => Object.assign(acc, { [permission.value]: permission.name }),
  {}
);

export const ReminderType = {
  TIMER: 'timer',
  SCHEDULED: 'scheduled',
};

export enum VoiceType {
  ALEXA = 'Alexa',
}

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

export const AV_FILE_FORMATS = [
  'audio/pcm',
  'audio/aiff',
  'audio/aac',
  'audio/x-wav',
  'audio/x-aiff',
  'audio/alac',
  'audio/mpeg',
  'audio/mp2',
  'audio/mp3',
  'audio/aa',
  'audio/flac',
  'audio/x-flac',
  'audio/x-wav',
  'audio/vnd.wave',
  'audio/wav',
  'audio/wave',
  'audio/x-pn-wav',
  'audio/ogg',
];

export const AV_FORMATS_STREAMING = [...AV_FILE_FORMATS, 'audio/x-mpegurl', 'application/vnd.apple.mpegurl'];

export const SLOT_COLORS = [
  '#4F9ED1',
  '#4FA9B3',
  '#A086C4',
  '#E26D5A',
  '#E04F78',
  '#BF395B',
  '#5C6BC0',
  '#3A5999',
  '#457A53',
  '#3A7685',
  '#BF9677',
  '#4C4C4C',
];

export type HSLShades = COLOR_PICKER_CONSTANTS.HSLShades;

export const SPACE_REGEXP = / /g;

export const NEW_LINE_REGEX = /\n/g;
export const SSML_TAG_REGEX = /<\/?[^>]+(>|$)/g;

export const URL_REGEX = /(((https?:)?\/\/)?(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,10}\b([\w#%&+./:=?@~-]*))/;
export const URL_ONLY_REGEX = /^(((https?:)?\/\/)?(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,10}\b([\w#%&+./:=?@~-]*))$/;
export const ALL_URLS_REGEX = RegExp(URL_REGEX, 'g');
export const HTTPS_URL_REGEX = /https:\/\/(www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,10}\b([\w#%&+./:=?@~-]*)/;
export const LINK_ABOUT_ONLY_REGEX = /^about:[\w#%+.:=@~-]{2,256}\b([\w#%&+./:=?@~-]*)$/;
export const LINK_BITCOIN_ONLY_REGEX = /^bitcoin:[\dA-Za-z]{26,35}([\w#%&+./:=?@~-]*)$/;
export const LINK_CALLTO_ONLY_REGEX = /^callto:[+\d-\s()]+$/;
export const LINK_TEL_ONLY_REGEX = /^tel:[+\d-\s()]+$/;
export const LINK_SMS_ONLY_REGEX = /^sms:[+\d-\s()]+$/;
export const LINK_MAILTO_ONLY_REGEX = /^mailto:([^\s?]+)\b([\w#%&+./:=?@~-]*)$/;
export const LINK_IM_ONLY_REGEX = /^im:([^\s?]+)\b([\w#%&+./:=?@~-]*)$/;
export const LINK_FACETIME_ONLY_REGEX = /^facetime(-(audio|group))?:([^\s?]+|([+\d-()]+))$/;
export const LINK_SKYPE_ONLY_REGEX = /^skype:(\S+)\b$/;
export const LINK_WEBCALL_ONLY_REGEX = /^webcal:(\S+)\b$/;

export const STRICT_LINKS_REGEXS = [
  LINK_ABOUT_ONLY_REGEX,
  LINK_BITCOIN_ONLY_REGEX,
  LINK_CALLTO_ONLY_REGEX,
  LINK_TEL_ONLY_REGEX,
  LINK_SMS_ONLY_REGEX,
  LINK_MAILTO_ONLY_REGEX,
  LINK_IM_ONLY_REGEX,
  LINK_FACETIME_ONLY_REGEX,
  LINK_SKYPE_ONLY_REGEX,
  LINK_WEBCALL_ONLY_REGEX,
];

export const VALID_LINKS_REGEXS = [URL_ONLY_REGEX, ...STRICT_LINKS_REGEXS];

export const FILTERED_AMAZON_INTENTS = [
  'ScrollUpIntent',
  'ScrollRightIntent',
  'ScrollLeftIntent',
  'ScrollDownIntent',
  'PageUpIntent',
  'PageDownIntent',
  'NavigateSettingsIntent',
  'NavigateHomeIntent',
];

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

export enum DiagramState {
  IDLE = 'IDLE',
  CHANGED = 'CHANGED',
  SAVING = 'SAVING',
  SAVED = 'SAVED',
}

export enum InteractionModelTabType {
  SLOTS = 'entities',
  INTENTS = 'intents',
  VARIABLES = 'variables',
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

export enum BCP_LANGUAGE_CODE {
  AR_SA = 'ar-SA',
  CS_CZ = 'cs-CZ',
  DA_DK = 'da-DK',
  DE_DE = 'de-DE',
  EL_GR = 'el-GR',
  EN_AU = 'en-AU',
  EN_GB = 'en-GB',
  EN_IE = 'en-IE',
  EN_US = 'en-US',
  EN_ZA = 'en-ZA',
  ES_ES = 'es-ES',
  ES_MX = 'es-MX',
  FI_FI = 'fi-FI',
  FR_CA = 'fr-CA',
  FR_FR = 'fr-FR',
  HE_IL = 'he-IL',
  HI_IN = 'hi-IN',
  HU_HU = 'hu-HU',
  ID_ID = 'id-ID',
  IT_IT = 'it-IT',
  JA_JP = 'ja-JP',
  KO_KR = 'ko-KR',
  NL_BE = 'nl-BE',
  NL_NL = 'nl-NL',
  NO_NO = 'no-NO',
  PL_PL = 'pl-PL',
  PT_BR = 'pt-BR',
  PT_PT = 'pt-PT',
  RO_RO = 'ro-RO',
  RU_RU = 'ru-RU',
  SK_SK = 'sk-SK',
  SV_SE = 'sv-SE',
  TH_TH = 'th-TH',
  TR_TR = 'tr-TR',
  ZH_CN = 'zh-CN',
  ZH_HK = 'zh-HK',
  ZH_TW = 'zh-TW',
}

export const CUSTOMIZABLE_INTENT_PREFIXS = ['AMAZON', 'VF', 'actions'];

export const MAX_ALEXA_REPROMPTS = 3;

export const MAX_SYSTEM_MESSAGES_COUNT = 22;

export const CANVAS_ZOOM_DELTA = 15;

export const RESERVED_JS_WORDS = [
  'abstract',
  'arguments',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'let',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield',
];

export enum PageProgressBar {
  CANVAS_LOADING = 'CANVAS_LOADING',
  COMPONENT_CREATING = 'COMPONENT_CREATING',
  NLU_MODEL_TRAINNING = 'NLU_MODEL_TRAINNING',
  ASSISTANT_DUPLICATING = 'ASSISTANT_DUPLICATING',
  NLU_UNCLASSIFIED = 'NLU_UNCLASSIFIED',
  IMPORT_VF_FILE = 'IMPORT_VF_FILE',
}

export enum NLUImportOrigin {
  PROJECT = 'Assistant Create',
  NLU_MANAGER = 'NLU Manager',
}

export const ALEXA_SUNSET_PROJECT_ID = '62e424a61f2f9a0006572066';

export enum StepMenuType {
  LINK = 'link',
  SIDEBAR = 'sidebar',
}

export const DASHBOARD_V2_RELEASE_DATE = '2023-03-16T17:00:00.000Z';
