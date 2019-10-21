import { constants } from '@voiceflow/common';

export const SLOT_TYPES = constants.slots;
export const CUSTOM_SLOT_TYPE = 'Custom';
export const LEGACY_CUSTOM_SLOT_TYPE = 'CUSTOM';

export const ROOT_DIAGRAM_NAME = 'ROOT';
export const DIAGRAM_ID_SEPARATOR = '::';

export const NEW_PRODUCT_ID = 'new';
export const DEFAULT_PRODUCT_PHRASE = 'Alexa, ';

export const FlowTab = {
  STRUCTURE: 'structure',
  FLOW: 'flow',
};

export const BlockCategoryType = {
  BASIC: 'basic',
  LOGIC: 'logic',
  ADVANCED: 'advanced',
  VISUAL: 'visual',
  USER: 'user',
};

export const DragItem = {
  BLOCK_MENU: 'blockMenu',
};

export const SessionType = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  BASIC_AUTH: 'session',
  SIGN_UP: 'user',
};

export const PlatformType = {
  ALEXA: 'alexa',
  GOOGLE: 'google',
};

export const ProductType = {
  ENTITLEMENT: 'ENTITLEMENT',
  CONSUMABLE: 'CONSUMABLE',
  SUBSCRIPTION: 'SUBSCRIPTION',
};

export const PLATFORMS = [PlatformType.ALEXA, PlatformType.GOOGLE];

export const GlobalVariable = {
  SESSIONS: 'sessions',
  USER_ID: 'user_id',
  TIMESTAMP: 'timestamp',
  PLATFORM: 'platform',
  LOCALE: 'locale',
};

export const GLOBAL_VARIABLES = [
  GlobalVariable.SESSIONS,
  GlobalVariable.USER_ID,
  GlobalVariable.TIMESTAMP,
  GlobalVariable.PLATFORM,
  GlobalVariable.LOCALE,
];

export const BlockType = {
  // internal
  START: 'start',
  COMBINED: 'combined',
  COMMAND: 'command',
  COMMENT: 'comment',
  // basic
  SPEAK: 'speak',
  CHOICE: 'choice',
  // logic
  SET: 'set',
  IF: 'if',
  CAPTURE: 'capture',
  RANDOM: 'random',
  // advanced
  INTERACTION: 'interaction',
  INTENT: 'intent',
  STREAM: 'stream',
  INTEGRATION: 'integration',
  FLOW: 'flow',
  CODE: 'code',
  EXIT: 'exit',
  // visuals
  CARD: 'card',
  DISPLAY: 'display',
  // user
  PERMISSION: 'permission',
  USER_INFO: 'user_info',
  PAYMENT: 'payment',
  CANCEL_PAYMENT: 'cancel_payment',
  REMINDER: 'reminder',
  DEPRECATED: 'deprecated',
};

export const INTERNAL_BLOCKS = [BlockType.START, BlockType.COMBINED, BlockType.COMMAND, BlockType.COMMENT];
export const NO_EDITOR_BLOCKS = [...INTERNAL_BLOCKS, BlockType.DEPRECATED];

export const PermissionType = {
  USER_EMAIL: 'alexa::profile:email:read',
  USER_NAME: 'alexa::profile:name:read',
  USER_PHONE: 'alexa::profile:mobile_number:read',
  REMINDERS: 'alexa::alerts:reminders:skill:readwrite',
  NOTIFICATIONS: 'alexa::devices:all:notifications:write',
  ACCOUNT_LINKING: 'UNOFFICIAL::account_linking',
  PRODUCT: 'UNOFFICIAL::product',
  ISP: 'UNOFFICIAL::isp',
};

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
    name: 'Reminders',
    value: PermissionType.REMINDERS,
  },
  {
    name: 'Notifications',
    value: PermissionType.NOTIFICATIONS,
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

export const PERMISSION_LABELS = PERMISSIONS.reduce((acc, permission) => {
  acc[permission.value] = permission.name;
  return acc;
}, {});

export const ExpressionType = {
  PLUS: 'plus',
  MINUS: 'minus',
  TIMES: 'times',
  DIVIDE: 'divide',
  EQUALS: 'equals',
  GREATER: 'greater',
  LESS: 'less',
  AND: 'and',
  OR: 'or',
  NOT: 'not',
  VALUE: 'value',
  VARIABLE: 'variable',
  ADVANCE: 'advance',
};

export const ReminderType = {
  TIMER: 'timer',
  SCHEDULED: 'scheduled',
};

export const CardType = {
  SIMPLE: 'simple',
  STANDARD: 'standard',
};

export const DialogType = {
  AUDIO: 'audio',
  VOICE: 'voice',
};

export const KeyCodes = {
  ENTER: 13,
};

export const IntegrationType = {
  CUSTOM_API: 'Custom API',
  GOOGLE_SHEETS: 'Google Sheets',
  ZAPIER: 'Zapier',
};

export const IntegrationActionType = {
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
  val: [],
};

// Integration default data models
export const INTEGRATION_DATA_MODELS = {
  CUSTOM_API: {
    selectedIntegration: 'Custom API',
    headers: [EMPTY_KEY_VALUE_ITEM],
    url: [],
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
    selectedIntegration: 'Google Sheets',
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
    user: {},
    selectedIntegration: 'Zapier',
    selectedAction: IntegrationActionType.ZAPIER.START_A_ZAP,
    value: [],
  },
};

export const RESPONSE_COLOR_CODES = {
  GREEN: '#349d51',
  YELLOW: '#e1d40b',
  RED: '#e91e63',
};

export const REPROMPT_TYPE = {
  TEXT: 'text',
  AUDIO: 'audio',
};

export const VALID_VARIABLE_NAME = /^[A-Za-z]\w{0,16}$/;

export const AUDIO_FILE_BUCKET_NAME = 'https://s3.amazonaws.com/com.getstoryflow.audio.sandbox';
