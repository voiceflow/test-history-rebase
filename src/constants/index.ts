/* eslint-disable camelcase */
import { constants } from '@voiceflow/common';

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
}

export const ProductType = {
  ENTITLEMENT: 'ENTITLEMENT',
  CONSUMABLE: 'CONSUMABLE',
  SUBSCRIPTION: 'SUBSCRIPTION',
};

export const PLATFORMS = [PlatformType.ALEXA, PlatformType.GOOGLE];

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
  MARKUP_SHAPE = 'markup_shape',
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

export enum ExpressionType {
  PLUS = 'plus',
  MINUS = 'minus',
  TIMES = 'times',
  DIVIDE = 'divide',
  EQUALS = 'equals',
  GREATER = 'greater',
  LESS = 'less',
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  VALUE = 'value',
  VARIABLE = 'variable',
  ADVANCE = 'advance',
}

export const ReminderType = {
  TIMER: 'timer',
  SCHEDULED: 'scheduled',
};

export enum CardType {
  SIMPLE = 'simple',
  STANDARD = 'standard',
}

export enum DialogType {
  AUDIO = 'audio',
  VOICE = 'voice',
}

export enum ChoiceElseType {
  PATH = 'path',
  REPROMPT = 'reprompt',
}

export enum VoiceType {
  ALEXA = 'Alexa',
}

export const KeyCodes = {
  ENTER: 13,
};

export enum IntegrationType {
  CUSTOM_API = 'Custom API',
  GOOGLE_SHEETS = 'Google Sheets',
  ZAPIER = 'Zapier',
}

export const IntegrationActionType: Record<string, { [key: string]: string }> = {
  CUSTOM_API: {
    GET: 'Make a GET Request',
    POST: 'Make a POST Request',
    PUT: 'Make a PUT Request',
    DELETE: 'Make a DELETE Request',
    PATCH: 'Make a PATCH Request',
  },
  GOOGLE_SHEETS: {
    RETRIEVE_DATA: 'Retrieve Data',
    CREATE_DATA: 'Create Data',
    UPDATE_DATA: 'Update Data',
    DELETE_DATA: 'Delete Data',
  },
  ZAPIER: {
    START_A_ZAP: 'Start a Zap',
  },
};

const EMPTY_KEY_VALUE_ITEM = {
  key: [],
  val: '',
};

// Integration default data models
export const INTEGRATION_DATA_MODELS = {
  CUSTOM_API: {
    name: IntegrationType.CUSTOM_API,
    selectedIntegration: IntegrationType.CUSTOM_API,
    headers: [EMPTY_KEY_VALUE_ITEM],
    url: '',
    mapping: [
      {
        path: [],
        var: null,
      },
    ],
    bodyInputType: 'formData',
    body: [EMPTY_KEY_VALUE_ITEM],
    parameters: [EMPTY_KEY_VALUE_ITEM],
    content: '',
    selectedAction: IntegrationActionType.CUSTOM_API.GET,
  },
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
    selectedIntegration: IntegrationType.ZAPIER,
    selectedAction: IntegrationActionType.ZAPIER.START_A_ZAP,
    value: [],
  },
};

export enum PlanType {
  OLD_STARTER = 'old_starter',
  OLD_PRO = 'old_pro',
  OLD_TEAM = 'old_team',
  OLD_ENTERPRISE = 'old_enterprise',

  STARTER = 'starter',
  PRO = 'pro',
  TEAM = 'team',
  ENTERPRISE = 'enterprise',
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
  INTENTS = 'intents',
  INTERACTION_MODEL = 'interaction-model',

  DISPLAY_PREVIEW = 'display-preview',

  ONBOARDING = 'onboarding',

  FREE_PROJECT_LIMIT = 'free-project-limit',
  REALTIME_DENIED = 'realtime-denied',
  PROJECT_DOWNLOAD = 'project-download',
  TESTABLE_LINKS = 'testable-links',
  CANVAS_EXPORT = 'canvas-export',
  SHARE_MENU = 'share-menu',

  SHORTCUTS = 'shortcuts',

  IMPORT_SLOTS = 'import-slots',
  IMPORT_PROJECT = 'import-project',
  IMPORT_UTTERANCES = 'import-utterances',
  IMPORT_BULK_DENIED = 'import-bulk-denied',

  LOADING = 'loading',
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  LIBRARY = 'library',
}

export enum FEATURE_IDS {
  ADD_COLLABORATORS = 'ADD_COLLABORATORS',
  WORKSPACE_SETTINGS = 'WORKSPACE_SETTINGS',
  UPGRADE_WORKSPACE = 'UPGRADE_WORKSPACE',
  EDIT_CANVAS = 'EDIT_CANVAS',
  INTERACTION_MODAL = 'INTERACTION_MODAL',
  DASHBOARD_LIST = 'DASHBOARD_LIST',
  DASHBOARD_PROJECT = 'DASHBOARD_PROJECT',
  MARKUP = 'MARKUP',
  COMMENTING = 'COMMENTING',
  EXPORT = 'EXPORT',
  BULK_UPLOAD = 'BULK_UPLOAD',
}

export const FEATURE_ROLE_PERMISSIONS = {
  ADD_COLLABORATORS: [UserRole.ADMIN],
  WORKSPACE_SETTINGS: [UserRole.ADMIN],
  UPGRADE_WORKSPACE: [UserRole.ADMIN],
  EDIT_CANVAS: [UserRole.ADMIN, UserRole.EDITOR],
  INTERACTION_MODAL: [UserRole.ADMIN, UserRole.EDITOR],
  DASHBOARD_LIST: [UserRole.ADMIN, UserRole.EDITOR],
  DASHBOARD_PROJECT: [UserRole.ADMIN, UserRole.EDITOR],
  MARKUP: [UserRole.ADMIN, UserRole.EDITOR],
  COMMENTING: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],
};

export const FEATURE_PLAN_PERMISSIONS = {
  [FEATURE_IDS.MARKUP]: [PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [FEATURE_IDS.EXPORT]: [PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [FEATURE_IDS.COMMENTING]: [PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
  [FEATURE_IDS.BULK_UPLOAD]: [PlanType.PRO, PlanType.OLD_PRO, PlanType.TEAM, PlanType.OLD_TEAM, PlanType.ENTERPRISE],
};

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

export const PLAN_NAMES = {
  [PlanType.OLD_PRO]: {
    label: 'Pro',
    color: '#42B761',
  },
  [PlanType.PRO]: {
    label: 'Pro',
    color: '#42B761',
  },
  [PlanType.OLD_STARTER]: {
    label: 'Starter',
    color: '#8da2b5',
  },
  [PlanType.STARTER]: {
    label: 'Starter',
    color: '#8da2b5',
  },
  [PlanType.OLD_TEAM]: {
    label: 'Team',
    color: '#5D9DF5',
  },
  [PlanType.TEAM]: {
    label: 'Team',
    color: '#5D9DF5',
  },
  [PlanType.OLD_ENTERPRISE]: {
    label: 'Enterprise',
    color: '#ff5733',
  },
  [PlanType.ENTERPRISE]: {
    label: 'Enterprise',
    color: '#ff5733',
  },
};

export enum MarkupShapeType {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  LINE = 'line',
  ARROW = 'arrow',
}

export enum MarkupModeType {
  TEXT = 'text',
  IMAGE = 'image',
}

export const MARKUP_SHAPES = [MarkupShapeType.RECTANGLE, MarkupShapeType.CIRCLE, MarkupShapeType.LINE, MarkupShapeType.ARROW];

export const ROOT_NODES = [BlockType.COMBINED, BlockType.START, BlockType.COMMENT];
export const INTERNAL_NODES = [BlockType.DEPRECATED, BlockType.COMMAND, ...ROOT_NODES];

export const MARKUP_NODES = [BlockType.MARKUP_TEXT, BlockType.MARKUP_IMAGE, BlockType.MARKUP_SHAPE];

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
