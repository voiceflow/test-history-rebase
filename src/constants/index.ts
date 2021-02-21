/* eslint-disable camelcase */
import { PermissionType, Voice as AlexaVoices } from '@voiceflow/alexa-types';
import { DeviceType, IntegrationType, Voice as GeneralVoices } from '@voiceflow/general-types';
import { APIActionType, APIBodyType } from '@voiceflow/general-types/build/nodes/api';
import { ZapierActionType } from '@voiceflow/general-types/build/nodes/zapier';
import { Voice as GoogleVoices } from '@voiceflow/google-types';

import { NodeData } from '@/models';
import { Pair } from '@/types';

export { IntegrationType } from '@voiceflow/general-types';

export const USER_INFO_SCOPE = 'https://www.googleapis.com/auth/userinfo.profile';
export const ACTION_BUILDER_SCOPE = 'https://www.googleapis.com/auth/actions.builder';
export const CLOUD_RESOURCE_SCOPE = 'https://www.googleapis.com/auth/cloudplatformprojects.readonly';
export const GOOGLE_OAUTH_SCOPES = [CLOUD_RESOURCE_SCOPE, ACTION_BUILDER_SCOPE, USER_INFO_SCOPE];

export const CUSTOM_SLOT_TYPE = 'Custom';
export const LEGACY_CUSTOM_SLOT_TYPE = 'CUSTOM';

export const ROOT_DIAGRAM_NAME = 'ROOT';
export const DIAGRAM_ID_SEPARATOR = '::';

export const NEW_PRODUCT_ID = 'new';
export const DEFAULT_PRODUCT_PHRASE = 'Alexa, ';

export const CLIPBOARD_DATA_KEY = 'vf-cp-data';

export const HOVER_THROTTLE_TIMEOUT = 24;

export const WORKSPACES_LIMIT = 3;

export const ZERO_VECTOR: Pair<number> = [0, 0];

export enum BlockCategory {
  USER_INPUT = 'user input',
  RESPONSE = 'response',
  LOGIC = 'logic',
  INTEGRATION = 'integration',
  CHANNEL = 'channel',
}

export enum DragItem {
  BLOCK_MENU = 'blockMenu',
}

export enum SessionType {
  SSO = 'sso',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  BASIC_AUTH = 'session',
  SIGN_UP = 'user',
}

export enum PlatformType {
  ALEXA = 'alexa',
  GOOGLE = 'google',
  GENERAL = 'general',
}

export enum ChannelType {
  ALEXA_ASSISTANT = 'alexa_assistant',
  GOOGLE_ASSISTANT = 'google_assistant',
  CUSTOM_ASSISTANT = 'custom_assistant',
  IVR = 'ivr',
  CHATBOT = 'chatbot',
  MOBILE_APP = 'mobile_app',
}

export const DefaultVoice = {
  [PlatformType.ALEXA]: AlexaVoices.ALEXA,
  [PlatformType.GOOGLE]: GoogleVoices.DEFAULT,
  [PlatformType.GENERAL]: GeneralVoices.DEFAULT,
};

export const PLATFORMS = [PlatformType.ALEXA, PlatformType.GOOGLE, PlatformType.GENERAL];

export const PLATFORM_APP_NAME: Record<PlatformType, string> = {
  [PlatformType.ALEXA]: 'Alexa Skill',
  [PlatformType.GOOGLE]: 'Google Action',
  [PlatformType.GENERAL]: 'General Project',
};

export const BuiltInVariable = {
  SESSIONS: 'sessions',
  USER_ID: 'user_id',
  TIMESTAMP: 'timestamp',
  PLATFORM: 'platform',
  LOCALE: 'locale',
};

export const BUILT_IN_VARIABLES = [
  BuiltInVariable.SESSIONS,
  BuiltInVariable.USER_ID,
  BuiltInVariable.TIMESTAMP,
  BuiltInVariable.PLATFORM,
  BuiltInVariable.LOCALE,
];

export enum BlockType {
  // internal
  START = 'start',
  COMBINED = 'combined',
  COMMAND = 'command',
  COMMENT = 'comment',

  // basic
  SPEAK = 'speak',
  CHOICE_OLD = 'choice',
  // logic
  SET = 'set',
  IF = 'if',
  CAPTURE = 'capture',
  RANDOM = 'random',
  // advanced
  CHOICE = 'interaction',
  INTENT = 'intent',
  STREAM = 'stream',
  INTEGRATION = 'integration',
  FLOW = 'flow',
  CODE = 'code',
  EXIT = 'exit',
  PROMPT = 'prompt',
  // visuals
  CARD = 'card',
  VISUAL = 'visual',
  DISPLAY = 'display',
  // user
  PERMISSION = 'permission',
  ACCOUNT_LINKING = 'account_linking',
  USER_INFO = 'user_info',
  PAYMENT = 'payment',
  CANCEL_PAYMENT = 'cancel_payment',
  REMINDER = 'reminder',
  DEPRECATED = 'deprecated',
  INVALID_PLATFORM = 'invalid_platform',

  // event
  DIRECTIVE = 'directive',
  EVENT = 'event',

  MARKUP_TEXT = 'markup_text',
  MARKUP_IMAGE = 'markup_image',
}

export const PERMISSIONS = [
  {
    name: 'User Email',
    value: PermissionType.ALEXA_PROFILE_EMAIL_READ,
    variableMap: true,
  },
  {
    name: 'User Name',
    value: PermissionType.ALEXA_PROFILE_NAME_READ,
    variableMap: true,
  },
  {
    name: 'User Phone Number',
    value: PermissionType.ALEXA_PROFILE_MOBILE_NUMBER_READ,
    variableMap: true,
  },
  {
    name: 'Location Services',
    value: PermissionType.ALEXA_DEVICES_ALL_GEOLOCATION_READ,
    variableMap: true,
  },
  {
    name: 'Reminders',
    value: PermissionType.ALEXA_ALERTS_REMINDERS_SKILL_READ_WRITE,
  },
  {
    name: 'Lists Read',
    value: PermissionType.ALEXA_HOUSEHOLD_LISTS_READ,
  },
  {
    name: 'Lists Write',
    value: PermissionType.ALEXA_HOUSEHOLD_LISTS_WRITE,
  },
  {
    name: 'Notifications',
    value: PermissionType.ALEXA_DEVICES_ALL_NOTIFICATIONS_WRITE,
  },
  {
    name: 'Skill Personalization',
    value: PermissionType.ALEXA_PERSON_ID_READ,
    variableMap: true,
  },
  {
    name: 'Account Linking',
    value: PermissionType.UNOFFICIAL_ACCOUNT_LINKING,
    variableMap: true,
  },
  {
    name: 'Product',
    value: PermissionType.UNOFFICIAL_PRODUCT,
  },
  {
    name: 'ISP',
    value: PermissionType.UNOFFICIAL_ISP,
  },
  // Removed for now, amazon pay permissions broken
];

export const PERMISSIONS_WITH_VARIABLE_MAPS = PERMISSIONS.filter(({ variableMap }) => variableMap).map(({ value }) => value);

export const PERMISSION_LABELS: Record<PermissionType, string> = PERMISSIONS.reduce<Record<string, string>>(
  (acc, permission) => Object.assign(acc, { [permission.value]: permission.name }),
  {}
);

export const ReminderType = {
  TIMER: 'timer',
  SCHEDULED: 'scheduled',
};

export { CardType } from '@voiceflow/alexa-types/build/nodes/card';

export enum DialogType {
  AUDIO = 'audio',
  VOICE = 'voice',
}

export enum VoiceType {
  ALEXA = 'Alexa',
}

export const KeyCodes = {
  ENTER: 13,
};

const EMPTY_KEY_VALUE_ITEM = {
  key: '',
  val: '',
};

// Integration default data models
export const INTEGRATION_DATA_MODELS = {
  CUSTOM_API: {
    url: '',
    body: [EMPTY_KEY_VALUE_ITEM],
    name: IntegrationType.CUSTOM_API,
    headers: [EMPTY_KEY_VALUE_ITEM],
    mapping: [{ path: '', var: null }],
    content: '',
    parameters: [EMPTY_KEY_VALUE_ITEM],
    bodyInputType: APIBodyType.FORM_DATA,
    selectedAction: APIActionType.GET,
    selectedIntegration: IntegrationType.CUSTOM_API,
  } as NodeData.CustomApi,
  GOOGLE_SHEETS: {
    name: IntegrationType.GOOGLE_SHEETS,
    selectedIntegration: IntegrationType.GOOGLE_SHEETS,
    selectedAction: '',
    user: {},
    spreadsheet: null,
    sheet: null,
    header_column: null,
    match_value: [],
    row_values: [],
    row_number: [],
    mapping: [],
    start_row: [],
    end_row: [],
  },
  ZAPIER: {
    name: IntegrationType.ZAPIER,
    user: {},
    value: '',
    selectedAction: ZapierActionType.START_A_ZAP,
    selectedIntegration: IntegrationType.ZAPIER,
  } as NodeData.Zapier,
};

export const PLAN_INFO_LINK = 'https://www.voiceflow.com/pricing';

export enum PlanType {
  OLD_STARTER = 'old_starter',
  OLD_PRO = 'old_pro',
  OLD_ENTERPRISE = 'old_enterprise',
  OLD_TEAM = 'old_team',
  STARTER = 'starter',
  STUDENT = 'student',
  PRO = 'pro',
  TEAM = 'team',
  ENTERPRISE = 'enterprise',
  CREATOR = 'creator',
}

export enum PromoType {
  STUDENT = 'student',
  CREATOR = 'creator',
}

export const RESPONSE_COLOR_CODES = {
  GREEN: '#349d51',
  YELLOW: '#e1d40b',
  RED: '#e91e63',
};

export enum RepromptType {
  TEXT = 'text',
  AUDIO = 'audio',
}

export enum BillingPeriod {
  MONTHLY = 'MO',
  ANNUALLY = 'YR',
}

export const PERIOD_NAME = {
  [BillingPeriod.MONTHLY]: 'Monthly',
  [BillingPeriod.ANNUALLY]: 'Annually',
};

export const VALID_VARIABLE_NAME = /^[A-Za-z]\w{0,16}$/;

export const AUDIO_FILE_BUCKET_NAME = 'https://s3.amazonaws.com/com.getstoryflow.audio.sandbox';

export const IMAGE_FILE_FORMATS = ['image/jpeg', 'image/png'];

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

export enum ModalType {
  PAYMENT = 'payment',
  COLLABORATORS = 'collaborators',
  BILLING = 'billing',

  BOARD_DELETE = 'board-delete',
  BOARD_SETTINGS = 'board-settings',

  API_KEY_CREATE = 'api-key-create',

  SUCCESS = 'success',

  SLOT_EDIT = 'slot-edit',
  INTERACTION_MODEL = 'interaction-model',

  APL_PREVIEW = 'apl-preview',

  ONBOARDING = 'onboarding',

  FREE_PROJECT_LIMIT = 'free-project-limit',
  REALTIME_DENIED = 'realtime-denied',
  PROJECT_DOWNLOAD = 'project-download',
  TESTABLE_LINKS = 'testable-links',
  CANVAS_EXPORT = 'canvas-export',
  CANVAS_MARKUP = 'canvas-markup',
  SHARE_MENU = 'share-menu',

  SHORTCUTS = 'shortcuts',

  IMPORT_SLOTS = 'import-slots',
  IMPORT_PROJECT = 'import-project',
  IMPORT_UTTERANCES = 'import-utterances',
  IMPORT_BULK_DENIED = 'import-bulk-denied',

  LOADING = 'loading',
  REFRESH = 'refresh',

  CONNECT = 'connect',
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  LIBRARY = 'library',
  OWNER = 'owner',
}

export const EDITOR_SEAT_ROLES = [UserRole.EDITOR, UserRole.ADMIN];

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

export const SPACE_REGEXP = / /g;

export const SSML_TAG_REGEX = /<\/?[^>]+(>|$)/g;

export const HTTPS_URL_REGEX = /https:\/\/(www\.)?[\w#%+-.:=@~]{2,256}\.[a-z]{2,10}\b([\w#%&+-./:=?@~]*)/;

export const APL_TOOL_LINK = 'https://developer.amazon.com/alexa/console/ask/displays';

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

export enum IconVariant {
  STANDARD = 'standard',
  POPOVER = 'popover',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  BLUE = 'blue',
  WHITE = 'white',
}

export enum KeyCode {
  ENTER = 13,
}

export const UNLIMITED_EDITORS_CONST = 100;

export const PLAN_TYPE_META = {
  [PlanType.OLD_STARTER]: {
    label: 'Starter',
    color: 'linear-gradient(to bottom, rgba(141, 162, 181, 0.85), #8da2b5)',
  },
  [PlanType.STARTER]: {
    label: 'Starter',
    color: 'linear-gradient(to bottom, rgba(141, 162, 181, 0.85), #8da2b5)',
  },
  [PlanType.STUDENT]: {
    label: 'Student',
    color: 'linear-gradient(rgb(92, 107, 192, 0.85), #5c6bc0)',
  },
  [PlanType.OLD_PRO]: {
    label: 'Pro',
    color: 'linear-gradient(to bottom, rgba(39, 151, 69, 0.85), #279745)',
  },
  [PlanType.PRO]: {
    label: 'Pro',
    color: 'linear-gradient(to bottom, rgba(39, 151, 69, 0.85), #279745)',
  },
  [PlanType.OLD_ENTERPRISE]: {
    label: 'Enterprise',
    color: 'linear-gradient(rgba(19, 33, 68, 0.85), rgb(19, 33, 68))',
  },
  [PlanType.ENTERPRISE]: {
    label: 'Enterprise',
    color: 'linear-gradient(rgba(19, 33, 68, 0.85), rgb(19, 33, 68))',
  },
  [PlanType.OLD_TEAM]: {
    label: 'Team',
    color: 'linear-gradient(to bottom, rgba(85, 137, 235, 0.85) -25%, #5589eb 75%)',
  },
  [PlanType.TEAM]: {
    label: 'Team',
    color: 'linear-gradient(to bottom, rgba(85, 137, 235, 0.85) -25%, #5589eb 75%)',
  },
  [PlanType.CREATOR]: {
    label: 'Creator',
    color: 'linear-gradient(rgb(92, 107, 192, 0.85), #5c6bc0)',
  },
};

export enum MarkupModeType {
  TEXT = 'text',
  IMAGE = 'image',
}

export const ROOT_NODES = [BlockType.COMBINED, BlockType.START, BlockType.COMMENT];
export const INTERNAL_NODES = [BlockType.DEPRECATED, BlockType.COMMAND, ...ROOT_NODES];

export const MARKUP_NODES = [BlockType.MARKUP_TEXT, BlockType.MARKUP_IMAGE];

export const COPY_NODES = [...MARKUP_NODES, BlockType.COMBINED];

export const DIAGRAM_REFERENCE_NODES = [BlockType.COMMAND, BlockType.FLOW];

export enum ExportFormat {
  PNG = 'png',
  PDF = 'pdf',
  JSON = 'json',
  VF = 'vf',
}

export enum TextAlignment {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export enum DiagramState {
  IDLE = 'IDLE',
  CHANGED = 'CHANGED',
  SAVING = 'SAVING',
  SAVED = 'SAVED',
}

export enum InteractionModelTabType {
  SLOTS = 'slots',
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

export enum GooglePromptType {
  CONSENT = 'consent',
  SELECT_ACCOUNT = 'select_account',
}

export const GOOGLE_SPREADSHEETS_INTEGRATION_SCOPES = [
  'profile',
  'email',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
];

export const START_BLOCK_ID = 'start00000000000000000000';

export const DEVICE_LABEL_MAP: Record<DeviceType, string> = {
  [DeviceType.MOBILE]: 'Mobile',
  [DeviceType.TABLET]: 'Tablet',
  [DeviceType.DESKTOP]: 'Desktop',
  [DeviceType.SMART_WATCH]: 'Smart Watch',
  [DeviceType.TELEVISION]: 'Television',
  [DeviceType.IN_CAR_DISPLAY]: 'In-Car Display',
  [DeviceType.ECHO_SPOT]: 'Echo Spot',
  [DeviceType.ECHO_SHOW_8]: 'Echo Show 8',
  [DeviceType.ECHO_SHOW_10]: 'Echo Show 10',
  [DeviceType.FIRE_HD_8]: 'Fire HD 8',
  [DeviceType.FIRE_HD_10]: 'Fire HD 10',
  [DeviceType.FIRE_TV_CUBE]: 'Fire TV Cube',
  [DeviceType.GOOGLE_NEST_HUB]: 'Google Nest Hub',
};

export const DOCS_LINK = 'https://docs.voiceflow.com';

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
