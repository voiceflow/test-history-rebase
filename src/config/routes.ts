export const toPath = (...routes: string[]) => routes.map((route) => `/${route}`).join('');

export enum RootRoute {
  PROJECT = 'project',
  SSML = 'ssml',
  RESET = 'reset',
  LOGIN = 'login',
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
}

export enum SSORoute {
  CALLBACK = 'callback',
  ADOPT = 'adopt',
}

export enum ProjectRoute {
  CANVAS = 'canvas',
  PROTOTYPE = 'prototype',
  TOOLS = 'tools',
  MIGRATE = 'migrate',
  PUBLISH = 'publish',
  SETTINGS = 'settings',
  PROTOTYPE_WEBHOOK = 'webhook', // TODO: temporary page, remove after updated
}

export enum CanvasRoute {
  MODEL = 'model',
  MARKUP = 'markup',
  COMMENTING = 'commenting',
}

export enum PublishRoute {
  ALEXA = 'alexa',
  GOOGLE = 'google',
  EXPORT = 'export',
  GENERAL = 'general',
}

export enum ToolsRoute {
  PRODUCT = 'product',
  PRODUCTS = 'products',
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
  TEMPLATE = 'template',
}

export const Path = {
  HOME: '/',

  SSML: toPath(RootRoute.SSML),

  RESET: toPath(RootRoute.RESET),
  RESET_PASSWORD: toPath(RootRoute.RESET, ':id'),

  LOGIN: toPath(RootRoute.LOGIN),
  LOGIN_MATTEL: toPath(RootRoute.LOGIN, LoginRoute.MATTEL),
  LOGIN_SSO_CALLBACK: toPath(RootRoute.LOGIN, LoginRoute.SSO, SSORoute.CALLBACK),

  SSO_ADOPT: toPath(RootRoute.SSO, SSORoute.ADOPT),

  SIGNUP: toPath(RootRoute.SIGNUP),
  PROMO_SIGNUP: toPath(RootRoute.SIGNUP, SignupRoute.PROMO),

  ONBOARDING: toPath(RootRoute.ONBOARDING),

  CREATOR_TERMS: [toPath(RootRoute.CREATOR, CreatorRoute.TERMS), toPath(RootRoute.CREATOR, CreatorRoute.PRIVACY_POLICY)],

  WORKSPACE: toPath(RootRoute.WORKSPACE),
  WORKSPACE_DASHBOARD: toPath(RootRoute.WORKSPACE, ':workspaceID?'),
  NEW_WORKSPACE: toPath(RootRoute.WORKSPACE, WorkspaceRoute.NEW),
  WORKSPACE_TEMPLATE: toPath(RootRoute.WORKSPACE, WorkspaceRoute.TEMPLATE),

  DASHBOARD: toPath(RootRoute.DASHBOARD),

  ACCOUNT: toPath(RootRoute.ACCOUNT),

  INVITE: toPath(RootRoute.INVITE),

  RUNTIME: toPath(RootRoute.RUNTIME),

  PUBLIC_PROTOTYPE: toPath(RootRoute.PROTOTYPE, ':versionID'),
  PROJECT_DEMO: toPath(RootRoute.DEMO, ':versionID'),
  PROJECT_CANVAS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CANVAS, ':diagramID?'),
  PROJECT_PROTOTYPE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PROTOTYPE, ':diagramID?'),
  PROJECT_TOOLS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.TOOLS),
  PROJECT_MIGRATE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.MIGRATE),
  PROJECT_PUBLISH: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH),
  PROJECT_SETTINGS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.SETTINGS),

  CANVAS_MARKUP: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CANVAS, ':diagramID', CanvasRoute.MARKUP),
  CANVAS_COMMENTING: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CANVAS, ':diagramID', CanvasRoute.COMMENTING),
  CANVAS_MODEL: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CANVAS, ':diagramID', CanvasRoute.MODEL, ':modelType?'),
  CANVAS_MODEL_ENTITY: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CANVAS, ':diagramID', CanvasRoute.MODEL, ':modelType', ':modelEntityID?'),

  PRODUCT_DETAILS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.TOOLS, ToolsRoute.PRODUCT, ':id'),
  PRODUCT_LIST: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.TOOLS, ToolsRoute.PRODUCTS),

  PUBLISH_GOOGLE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.GOOGLE),
  PUBLISH_ALEXA: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.ALEXA),

  PROTOTYPE_WEBHOOK: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PROTOTYPE_WEBHOOK),
};

export const LegacyPath = {
  WORKSPACE_DASHBOARD: toPath('team', ':team_id?'),

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
  PROJECT_VERSION: toPath(RootRoute.PROJECT, ':versionID'),
  PROJECT_TEST: toPath(RootRoute.PROJECT, ':versionID', 'test', ':diagramID?'),
  PROJECT_EXPORT: toPath(RootRoute.PROJECT, ':versionID', 'export', ':diagramID'),
};
