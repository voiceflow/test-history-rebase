/* eslint-disable camelcase */
import { IntegrationType } from '@voiceflow/alexa-types';
import { APIActionType, APIBodyType } from '@voiceflow/alexa-types/build/nodes/api';
import { ZapierActionType } from '@voiceflow/alexa-types/build/nodes/zapier';
import { constants } from '@voiceflow/common';

import { NodeData } from '@/models';
import { Icon } from '@/svgs/types';
import { Pair } from '@/types';

export { IntegrationType } from '@voiceflow/alexa-types';

export const SLOT_TYPES = constants.slots;
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

export enum BlockCategoryType {
  BASIC = 'basic',
  LOGIC = 'logic',
  ADVANCED = 'advanced',
  VISUAL = 'visual',
  USER = 'user',
}

export const DragItem = {
  BLOCK_MENU: 'blockMenu',
};

export enum SessionType {
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

export const ProductType = {
  ENTITLEMENT: 'ENTITLEMENT',
  CONSUMABLE: 'CONSUMABLE',
  SUBSCRIPTION: 'SUBSCRIPTION',
};

export const PLATFORMS = [PlatformType.ALEXA, PlatformType.GOOGLE, PlatformType.GENERAL];

export const PLATFORM_META: Record<PlatformType, { icon: Icon; hidden: boolean }> = {
  [PlatformType.ALEXA]: {
    icon: 'amazonAlexa',
    hidden: false,
  },
  [PlatformType.GOOGLE]: {
    icon: 'googleAssistant',
    hidden: false,
  },
  [PlatformType.GENERAL]: {
    icon: 'inFlow',
    hidden: true,
  },
};

export const PLATFORM_APP_NAME = <Record<PlatformType, string>>{
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
  DISPLAY = 'display',
  // user
  PERMISSION = 'permission',
  ACCOUNT_LINKING = 'account_linking',
  USER_INFO = 'user_info',
  PAYMENT = 'payment',
  CANCEL_PAYMENT = 'cancel_payment',
  REMINDER = 'reminder',
  DEPRECATED = 'deprecated',

  // event
  DIRECTIVE = 'directive',
  EVENT = 'event',

  MARKUP_TEXT = 'markup_text',
  MARKUP_IMAGE = 'markup_image',
}

export enum PermissionType {
  USER_EMAIL = 'alexa::profile:email:read',
  USER_NAME = 'alexa::profile:name:read',
  USER_PHONE = 'alexa::profile:mobile_number:read',
  USER_PERSON = 'alexa::person_id:read',
  USER_GEOLOCATION = 'alexa::devices:all:geolocation:read',
  REMINDERS = 'alexa::alerts:reminders:skill:readwrite',
  LISTS_READ = 'alexa::household:lists:read',
  LISTS_WRITE = 'alexa::household:lists:write',
  NOTIFICATIONS = 'alexa::devices:all:notifications:write',
  ACCOUNT_LINKING = 'UNOFFICIAL::account_linking',
  PRODUCT = 'UNOFFICIAL::product',
  ISP = 'UNOFFICIAL::isp',
}

export const PERMISSIONS = [
  {
    name: 'User Email',
    value: PermissionType.USER_EMAIL,
    variableMap: true,
  },
  {
    name: 'User Name',
    value: PermissionType.USER_NAME,
    variableMap: true,
  },
  {
    name: 'User Phone Number',
    value: PermissionType.USER_PHONE,
    variableMap: true,
  },
  {
    name: 'Location Services',
    value: PermissionType.USER_GEOLOCATION,
    variableMap: true,
  },
  {
    name: 'Reminders',
    value: PermissionType.REMINDERS,
  },
  {
    name: 'Lists Read',
    value: PermissionType.LISTS_READ,
  },
  {
    name: 'Lists Write',
    value: PermissionType.LISTS_WRITE,
  },
  {
    name: 'Notifications',
    value: PermissionType.NOTIFICATIONS,
  },
  {
    name: 'Skill Personalization',
    value: PermissionType.USER_PERSON,
    variableMap: true,
  },
  {
    name: 'Account Linking',
    value: PermissionType.ACCOUNT_LINKING,
    variableMap: true,
  },
  {
    name: 'Product',
    value: PermissionType.PRODUCT,
  },
  {
    name: 'ISP',
    value: PermissionType.ISP,
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

  SUCCESS = 'success',

  SLOT_EDIT = 'slot-edit',
  INTERACTION_MODEL = 'interaction-model',

  DISPLAY_PREVIEW = 'display-preview',

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
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  LIBRARY = 'library',
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

export const HTTPS_URL_REGEX = /https:\/\/(www\.)?[\w#%+-.:=@~]{2,256}\.[a-z]{2,10}\b([\w#%&+-./:=?@~]*)/;

export const APL_TOOL_LINK = 'https://developer.amazon.com/alexa/console/ask/displays';
export const SLOT_REGEXP = /{{\[([^ .[\]{}]*?)]\.([^ .[\]{}]*?)}}/g;
export const VARIABLE_REGEXP = /^{.*}$/;
export const VARIABLE_STRING_REGEXP = /{([^ .[\]{}]*?)}/g;

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

export enum DisplayType {
  SPLASH = 'splash',
  ADVANCED = 'advanced',
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

export enum ExportFormat {
  PNG = 'png',
  PDF = 'pdf',
  JSON = 'json',
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
