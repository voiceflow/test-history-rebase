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
  INTEGRATIONS = 'integrations',
}

export enum LoginRoute {
  SSO = 'sso',
}

export enum SSORoute {
  CALLBACK = 'callback',
}

export enum IntegrationsRoute {
  ZENDESK = 'zendesk',
}

export enum ProjectRoute {
  CMS = 'cms',
  DOMAIN = 'domain',
  PROTOTYPE = 'prototype',
  MIGRATE = 'migrate',
  PUBLISH = 'publish',
  CONVERSATIONS = 'transcripts',
  SETTINGS = 'settings',
  ANALYTICS = 'analytics',
  EXPORT = 'export',
  ASSISTANT_OVERVIEW = 'assistant-overview',
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
  PROJECT_API = 'project/api',
  KNOWLEDGE_BASE_API = 'knowledge-base/api',
  EXPORT = 'export',
  GENERAL = 'general',
  WEBCHAT = 'webchat',
  SMS = 'sms',
  PROTOTYPE_SMS = 'prototype/sms',
  WHATSAPP = 'whatsapp',
  PROTOTYPE_WHATSAPP = 'prototype/whatsapp',
  MICROSOFT_TEAMS = 'microsoft_teams',
}

export enum NLURoute {
  INTENTS = 'intents',
  ENTITIES = 'entities',
}

export enum ProductRoute {
  NEW = 'new',
}

export enum CMSRoute {
  INTENT = 'intent',
  ENTITY = 'entity',
  FLOW = 'flow',
  FUNCTION = 'function',
  VARIABLE = 'variable',
  KNOWLEDGE_BASE = 'knowledge-base',
}

export enum CreatorRoute {
  TERMS = 'terms',
  PRIVACY_POLICY = 'privacy_policy',
}

export enum WorkspaceRoute {
  PROFILE = 'profile',
  MEMBERS = 'members',
  BILLING = 'billing',
  SETTINGS = 'settings',
  TEMPLATE = 'template',
  INTEGRATIONS = 'integrations',
  ORGANIZATION = 'organization',
  ACCEPT_INVITE = 'accept-invite',
}

export enum WorkspaceOrganizationRoute {
  SSO = 'sso',
  MEMBERS = 'members',
  SETTINGS = 'settings',
}

/**
 * @deprecated should be removed after the dashboardV2 is released
 */
export enum WorkspaceSettingsRoute {
  GENERAL = 'general',
  BILLING = 'billing',
  DEVELOPER = 'developer',
  SSO = 'sso',
}

export enum ProjectSettingsRoute {
  GENERAL = 'general',
  VERSION = 'version',
  ENVIRONMENT = 'environment',
  BACKUP = 'backup',
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
  LOGIN_SSO_CALLBACK: toPath(RootRoute.LOGIN, LoginRoute.SSO, SSORoute.CALLBACK),

  SIGNUP: toPath(RootRoute.SIGNUP),

  ONBOARDING: toPath(RootRoute.ONBOARDING),

  CREATOR_TERMS: [toPath(RootRoute.CREATOR, CreatorRoute.TERMS), toPath(RootRoute.CREATOR, CreatorRoute.PRIVACY_POLICY)],

  WORKSPACE: toPath(RootRoute.WORKSPACE),
  WORKSPACE_DASHBOARD: toPath(RootRoute.WORKSPACE, ':workspaceID'),

  WORKSPACE_MEMBERS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.MEMBERS),
  WORKSPACE_BILLING: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.BILLING),
  WORKSPACE_PROFILE: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.PROFILE),
  WORKSPACE_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS),
  WORKSPACE_INTEGRATIONS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.INTEGRATIONS),

  WORKSPACE_ORGANIZATION: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.ORGANIZATION),
  WORKSPACE_ORGANIZATION_SSO: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.ORGANIZATION, WorkspaceOrganizationRoute.SSO),
  WORKSPACE_ORGANIZATION_MEMBERS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.ORGANIZATION, WorkspaceOrganizationRoute.MEMBERS),
  WORKSPACE_ORGANIZATION_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.ORGANIZATION, WorkspaceOrganizationRoute.SETTINGS),

  WORKSPACE_GENERAL_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS, WorkspaceSettingsRoute.GENERAL),
  WORKSPACE_BILLING_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS, WorkspaceSettingsRoute.BILLING),
  WORKSPACE_DEVELOPER_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS, WorkspaceSettingsRoute.DEVELOPER),
  WORKSPACE_SSO_SETTINGS: toPath(RootRoute.WORKSPACE, ':workspaceID', WorkspaceRoute.SETTINGS, WorkspaceSettingsRoute.SSO),
  WORKSPACE_ACCEPT_INVITE: toPath(RootRoute.WORKSPACE, WorkspaceRoute.ACCEPT_INVITE),
  ZENDESK_CALLBACK: toPath(RootRoute.INTEGRATIONS, IntegrationsRoute.ZENDESK),

  DASHBOARD: toPath(RootRoute.DASHBOARD),

  ACCOUNT: toPath(RootRoute.ACCOUNT),
  ACCOUNT_PROFILE: toPath(RootRoute.ACCOUNT, AccountSettingsRoute.PROFILE),
  ACCOUNT_INTEGRATIONS: toPath(RootRoute.ACCOUNT, AccountSettingsRoute.INTEGRATIONS),

  VERIFY_SIGNUP_EMAIL: toPath(RootRoute.ACCOUNT, 'verify-email'),
  CONFIRM_EMAIL_UPDATE: toPath(RootRoute.ACCOUNT, 'confirm-email'),

  LOGOUT: toPath(RootRoute.LOGOUT),

  RUNTIME: toPath(RootRoute.RUNTIME),

  PUBLIC_PROTOTYPE: toPath(RootRoute.PROTOTYPE, ':versionID'),
  PROJECT_DEMO: toPath(RootRoute.DEMO, ':versionID'),
  PROJECT_VERSION: toPath(RootRoute.PROJECT, ':versionID'),
  PROJECT_DOMAIN: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.DOMAIN, ':domainID?'),

  PROJECT_PROTOTYPE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PROTOTYPE),
  PROJECT_PUBLISH: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH),
  PROJECT_SETTINGS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.SETTINGS),
  PROJECT_ASSISTANT_OVERVIEW: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.ASSISTANT_OVERVIEW),
  PROJECT_GENERAL_SETTINGS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.SETTINGS, ProjectSettingsRoute.GENERAL),
  PROJECT_VERSION_SETTINGS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.SETTINGS, ProjectSettingsRoute.VERSION),
  PROJECT_ENVIRONMENT_SETTINGS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.SETTINGS, ProjectSettingsRoute.ENVIRONMENT),
  PROJECT_BACKUP_SETTINGS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.SETTINGS, ProjectSettingsRoute.BACKUP),
  PROJECT_EXPORT: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.EXPORT, ':diagramID'),
  PROJECT_ANALYTICS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.ANALYTICS),
  PROJECT_CMS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CMS),

  CONVERSATIONS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CONVERSATIONS, ':transcriptID?'),

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

  PUBLISH_DIALOGFLOW: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.DIALOGFLOW),
  PUBLISH_GENERAL: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.GENERAL),
  PUBLISH_EXPORT: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.EXPORT),
  PUBLISH_WEBCHAT: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.WEBCHAT),
  PUBLISH_API: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.API),
  PUBLISH_PROJECT_API: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.PROJECT_API),
  PUBLISH_KNOWLEDGE_BASE_API: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.KNOWLEDGE_BASE_API),

  PUBLISH_SMS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.SMS),
  PROTOTYPE_SMS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.PROTOTYPE_SMS),

  PUBLISH_WHATSAPP: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.WHATSAPP),
  PROTOTYPE_WHATSAPP: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.PROTOTYPE_WHATSAPP),

  PUBLISH_TEAMS: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.PUBLISH, PublishRoute.MICROSOFT_TEAMS),

  CMS_INTENT: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CMS, CMSRoute.INTENT),
  CMS_ENTITY: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CMS, CMSRoute.ENTITY),
  CMS_FLOW: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CMS, CMSRoute.FLOW),
  CMS_FUNCTION: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CMS, CMSRoute.FUNCTION),
  CMS_VARIABLE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CMS, CMSRoute.VARIABLE),
  CMS_KNOWLEDGE_BASE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CMS, CMSRoute.KNOWLEDGE_BASE),

  CMS_RESOURCE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CMS, ':resourceType'),
  CMS_RESOURCE_ACTIVE: toPath(RootRoute.PROJECT, ':versionID', ProjectRoute.CMS, ':resourceType', ':resourceID'),
};

export const LegacyPath = {
  WORKSPACE_DASHBOARD: toPath('team', ':team_id?'),
  WORKSPACE_API_KEYS: toPath(RootRoute.WORKSPACE, ':workspaceID', 'api-keys'),

  CANVAS_DIAGRAM: toPath('canvas', ':versionID', ':diagramID?'),
  CANVAS_PREVIEW: toPath('preview', ':versionID', ':diagramID?'),
  CANVAS_TEST: toPath('test', ':versionID', ':diagramID?'),

  INVITE: toPath('invite'),

  MIGRATE: toPath('migrate', ':versionID'),

  PUBLISH: toPath('publish', ':versionID'),

  PROJECT_PUBLISH: toPath(RootRoute.PROJECT, ':versionID', 'publish'),
  PROJECT_TEST: toPath(RootRoute.PROJECT, ':versionID', 'test', ':diagramID?'),
  PROJECT_CANVAS: toPath(RootRoute.PROJECT, ':versionID', DomainRoute.CANVAS, ':diagramID?'),
};
