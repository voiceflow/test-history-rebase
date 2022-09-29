export const toPath = (...routes: string[]) => routes.map((route) => `/${route}`).join('');

export enum RootRoute {
  PROJECT = 'project',
  RESET = 'reset',
  LOGIN = 'login',
  LOGOUT = 'logout',
  SIGNUP = 'signup',
  ONBOARDING = 'onboarding',
  CREATOR = 'creator',
  WORKSPACE = 'workspace',
  DASHBOARD = 'dashboard',
  ACCOUNT = 'account',
  DEMO = 'demo',
  PROTOTYPE = 'prototype',
  CANVAS = 'canvas',
  INVITE = 'invite',
  RUNTIME = 'runtime',
  SSO = 'sso',
}

export enum LoginRoute {
  SSO = 'sso',
  MATTEL = 'mattel',
  MOTOROLA = 'motorola',
  OIN = 'oin',
}

export enum SSORoute {
  CALLBACK = 'callback',
  ADOPT = 'adopt',
}

export enum ProjectRoute {
  DOMAIN = 'domain',
  PROTOTYPE = 'prototype',
  TOOLS = 'tools',
  MIGRATE = 'migrate',
  PUBLISH = 'publish',
  CONVERSATIONS = 'transcripts',
  NLU_MANAGER = 'nlu',
  SETTINGS = 'settings',
  PROTOTYPE_WEBHOOK = 'webhook', // TODO: temporary page, remove after updated
  EXPORT = 'export',
}

export enum DomainRoute {
  CANVAS = 'canvas',
}

export enum CanvasRoute {
  NODE = 'node',
  MODEL = 'model',
  MARKUP = 'markup',
  COMMENTING = 'commenting',
}

export enum PublishRoute {
  ALEXA = 'alexa',
  GOOGLE = 'google',
  DIALOGFLOW = 'dialogflow',
  API = 'api',
  EXPORT = 'export',
  GENERAL = 'general',
}

export enum ToolsRoute {
  PRODUCT = 'product',
  PRODUCTS = 'products',
}

export enum NLURoute {
  INTENTS = 'intents',
  ENTITIES = 'entities',
  UNCLASSIFIED = 'unclassified',
}

export enum ProductRoute {
  NEW = 'new',
}

export enum SignupRoute {
  PROMO = 'promo',
}

export enum CreatorRoute {
  TERMS = 'terms',
  PRIVACY_POLICY = 'privacy_policy',
}

export enum WorkspaceRoute {
  NEW = 'new',
  SETTINGS = 'settings',
  TEMPLATE = 'template',
}

export enum WorkspaceSettingsRoute {
  GENERAL = 'general',
  BILLING = 'billing',
  DEVELOPER = 'developer',
  SSO = 'sso',
}

export enum ProjectSettingsRoute {
  GENERAL = 'general',
  VERSION = 'version',
}

export enum AccountSettingsRoute {
  PROFILE = 'profile',
  INTEGRATIONS = 'integrations',
}

export const Path = {
  HOME: '/',

  RESET: toPath(RootRoute.RESET),
  RESET_PASSWORD: toPath(RootRoute.RESET, ':id'),

  LOGIN: toPath(RootRoute.LOGIN),
  LOGIN_MATTEL: toPath(RootRoute.LOGIN, LoginRoute.MATTEL),
  LOGIN_MOTOROLA: toPath(RootRoute.LOGIN, LoginRoute.MOTOROLA),
  LOGIN_OIN: toPath(RootRoute.LOGIN, LoginRoute.OIN),
  LOGIN_SSO_CALLBACK: toPath(RootRoute.LOGIN, LoginRoute.SSO, SSORoute.CALLBACK),

  SSO_ADOPT: toPath(RootRoute.SSO, SSORoute.ADOPT),

  SIGNUP: toPath(RootRoute.SIGNUP),
  PROMO_SIGNUP: toPath(RootRoute.SIGNUP, SignupRoute.PROMO),

  ONBOARDING: toPath(RootRoute.ONBOARDING),

  CREATOR_TERMS: [toPath(RootRoute.CREATOR, CreatorRoute.TERMS), toPath(RootRoute.CREATOR, CreatorRoute.PRIVACY_POLICY)],

  WORKSPACE: toPath(RootRoute.WORKSPACE),
  WORKSPACE_DASHBOARD: toPath(RootRoute.WORKSPACE, ':workspaceID'),
  WORKSPACE_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS),
  WORKSPACE_GENERAL_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS, WorkspaceSettingsRoute.GENERAL),
  WORKSPACE_BILLING_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS, WorkspaceSettingsRoute.BILLING),
  WORKSPACE_DEVELOPER_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS, WorkspaceSettingsRoute.DEVELOPER),
  WORKSPACE_SSO_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS, WorkspaceSettingsRoute.SSO),
  NEW_WORKSPACE: toPath(RootRoute.WORKSPACE, WorkspaceRoute.NEW),

  DASHBOARD: toPath(RootRoute.DASHBOARD),

  ACCOUNT: toPath(RootRoute.ACCOUNT),
  ACCOUNT_PROFILE: toPath(RootRoute.ACCOUNT, AccountSettingsRoute.PROFILE),
  ACCOUNT_INTEGRATIONS: toPath(RootRoute.ACCOUNT, AccountSettingsRoute.INTEGRATIONS),

  CONFIRM_ACCOUNT: toPath(RootRoute.ACCOUNT, 'confirm', ':token'),

  CONFIRM_EMAIL_UPDATE: toPath(RootRoute.ACCOUNT, 'confirm-email'),

  LOGOUT: toPath(RootRoute.LOGOUT),

  INVITE: toPath(RootRoute.INVITE),

  RUNTIME: toPath(RootRoute.RUNTIME),

  PUBLIC_PROTOTYPE: toPath(RootRoute.PROTOTYPE, ':versionID'),
  PROJECT_DEMO: toPath(RootRoute.DEMO, ':versionID'),
  PROJECT_VERSION: toPath(RootRoute.PROJECT, ':versionID'),
  PROJECT_DOMAIN: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.DOMAIN, ':domainID?'),

  PROJECT_PROTOTYPE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PROTOTYPE),
  PROJECT_TOOLS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.TOOLS),
  PROJECT_MIGRATE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.MIGRATE),
  PROJECT_PUBLISH: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH),
  PROJECT_SETTINGS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.SETTINGS),
  PROJECT_GENERAL_SETTINGS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.SETTINGS, ProjectSettingsRoute.GENERAL),
  PROJECT_VERSION_SETTINGS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.SETTINGS, ProjectSettingsRoute.VERSION),
  PROJECT_EXPORT: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.EXPORT, ':diagramID'),

  CONVERSATIONS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CONVERSATIONS, ':transcriptID?'),

  NLU_MANAGER: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.NLU_MANAGER),
  NLU_MANAGER_INTENTS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.NLU_MANAGER, NLURoute.INTENTS, ':itemID?'),
  NLU_MANAGER_UNCLASSIFIED: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.NLU_MANAGER, NLURoute.UNCLASSIFIED, ':itemID?'),
  NLU_MANAGER_ENTITIES: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.NLU_MANAGER, NLURoute.ENTITIES, ':itemID?'),
  NLU_MANAGER_TAB: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.NLU_MANAGER, ':tab', ':itemID?'),

  DOMAIN_CANVAS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.DOMAIN, ':domainID', DomainRoute.CANVAS, ':diagramID?'),

  CANVAS_TEXT_MARKUP: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.DOMAIN, ':domainID', DomainRoute.CANVAS, ':diagramID', CanvasRoute.MARKUP),
  CANVAS_NODE: toPath(
    RootRoute.PROJECT,
    ':versionID',
    ProjectRoute.DOMAIN,
    ':domainID',
    DomainRoute.CANVAS,
    ':diagramID',
    CanvasRoute.NODE,
    ':nodeID'
  ),
  CANVAS_MODEL: toPath(
    RootRoute.PROJECT,
    ':versionID',
    ProjectRoute.DOMAIN,
    ':domainID',
    DomainRoute.CANVAS,
    ':diagramID',
    CanvasRoute.MODEL,
    ':modelType?'
  ),
  CANVAS_COMMENTING: toPath(
    RootRoute.PROJECT,
    ':versionID',
    ProjectRoute.DOMAIN,
    ':domainID',
    DomainRoute.CANVAS,
    ':diagramID',
    CanvasRoute.COMMENTING
  ),
  CANVAS_COMMENTING_THREAD: toPath(
    RootRoute.PROJECT,
    ':versionID',
    ProjectRoute.DOMAIN,
    ':domainID',
    DomainRoute.CANVAS,
    ':diagramID',
    CanvasRoute.COMMENTING,
    ':threadID',
    ':commentID?'
  ),
  CANVAS_MODEL_ENTITY: toPath(
    RootRoute.PROJECT,
    ':versionID',
    ProjectRoute.DOMAIN,
    ':domainID',
    DomainRoute.CANVAS,
    ':diagramID',
    CanvasRoute.MODEL,
    ':modelType',
    ':modelEntityID?'
  ),

  NEW_PRODUCT: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.TOOLS, ToolsRoute.PRODUCT),
  PRODUCT_DETAILS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.TOOLS, ToolsRoute.PRODUCT, ':productID'),
  PRODUCT_LIST: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.TOOLS, ToolsRoute.PRODUCTS),

  PUBLISH_GOOGLE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.GOOGLE),
  PUBLISH_DIALOGFLOW: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.DIALOGFLOW),
  PUBLISH_ALEXA: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.ALEXA),
  PUBLISH_GENERAL: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.GENERAL),
  PUBLISH_EXPORT: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.EXPORT),
  PUBLISH_API: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.API),

  PROTOTYPE_WEBHOOK: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PROTOTYPE_WEBHOOK),
};

export const LegacyPath = {
  CONFIRM_EMAIL_UPDATE: toPath(RootRoute.ACCOUNT, 'confirmEmail', ':token'),

  WORKSPACE_DASHBOARD: toPath('team', ':team_id?'),
  WORKSPACE_API_KEYS: toPath(RootRoute.WORKSPACE, ':workspaceID', 'api-keys'),

  CANVAS_DIAGRAM: toPath('canvas', ':versionID', ':diagramID?'),
  CANVAS_PREVIEW: toPath('preview', ':versionID', ':diagramID?'),
  CANVAS_TEST: toPath('test', ':versionID', ':diagramID?'),

  PRODUCT_DETAILS: toPath('tools', ':versionID', 'product', ':id'),
  PRODUCT_LIST: toPath('tools', ':versionID', 'products'),

  TOOLS: toPath('tools', ':versionID'),

  MIGRATE: toPath('migrate', ':versionID'),

  PUBLISH: toPath('publish', ':versionID'),
  PUBLISH_GOOGLE: toPath('publish', ':versionID', 'google'),
  PUBLISH_ALEXA: toPath('publish', ':versionID', 'alexa'),

  PROJECT_PUBLISH: toPath(RootRoute.PROJECT, ':versionID', 'publish'),
  PROJECT_TEST: toPath(RootRoute.PROJECT, ':versionID', 'test', ':diagramID?'),
  PROJECT_CANVAS: toPath(RootRoute.PROJECT, ':versionID', DomainRoute.CANVAS, ':diagramID?'),
};
