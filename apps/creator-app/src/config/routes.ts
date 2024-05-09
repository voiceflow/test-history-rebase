import { Enum } from '@voiceflow/dtos';

type ToPatch<T extends unknown[]> = T extends [infer F, ...infer R] ? `/${F & string}${ToPatch<R>}` : '';

export const toPath = <T extends string[]>(...routes: T) => `/${routes.join('/')}` as ToPatch<T>;
export const toParam = <T extends string, O extends boolean = false>(param: T, optional?: O) =>
  `:${param}${optional ? '?' : ''}` as `:${T}${O extends true ? '?' : ''}`;

export const RouteParam = {
  NODE_ID: 'nodeID',
  THREAD_ID: 'threadID',
  DOMAIN_ID: 'domainID',
  DIAGRAM_ID: 'diagramID',
  COMMENT_ID: 'commentID',
  VERSION_ID: 'versionID',
  RESOURCE_ID: 'resourceID',
  WORKSPACE_ID: 'workspaceID',
  RESOURCE_TYPE: 'resourceType',
  TRANSCRIPT_ID: 'transcriptID',
} as const;

export const RootRoute = {
  SSO: 'sso',
  DEMO: 'demo',
  RESET: 'reset',
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  CANVAS: 'canvas',
  INVITE: 'invite',
  RUNTIME: 'runtime',
  PROJECT: 'project',
  ACCOUNT: 'account',
  WORKSPACE: 'workspace',
  DASHBOARD: 'dashboard',
  PROTOTYPE: 'prototype',
  ONBOARDING: 'onboarding',
  INTEGRATIONS: 'integrations',
} as const;

export type RootRoute = Enum<typeof RootRoute>;

export const LoginRoute = {
  SSO: 'sso',
} as const;

export const LoginSSORoute = {
  CALLBACK: 'callback',
} as const;

export const IntegrationsRoute = {
  ZENDESK: 'zendesk',
} as const;

export const ProjectRoute = {
  CMS: 'cms',
  CANVAS: 'canvas',
  EXPORT: 'export',
  MIGRATE: 'migrate',
  PUBLISH: 'publish',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics',
  PROTOTYPE: 'prototype',
  CONVERSATIONS: 'transcripts',
  ASSISTANT_OVERVIEW: 'assistant-overview',

  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
   */
  DOMAIN: 'domain',
} as const;

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const DomainRoute = {
  CANVAS: 'canvas',
} as const;

export const CanvasRoute = {
  NODE: 'node',
  MODEL: 'model',
  MARKUP: 'markup',
  COMMENTING: 'commenting',
} as const;

export const PublishRoute = {
  SMS: 'sms',
  API: 'api',
  ALEXA: 'alexa',
  GOOGLE: 'google',
  EXPORT: 'export',
  GENERAL: 'general',
  WEBCHAT: 'webchat',
  WHATSAPP: 'whatsapp',
  DIALOGFLOW: 'dialogflow',
  PROJECT_API: 'project/api',
  PROTOTYPE_SMS: 'prototype/sms',
  MICROSOFT_TEAMS: 'microsoft_teams',
  PROTOTYPE_WHATSAPP: 'prototype/whatsapp',
} as const;

export const CMSRoute = {
  FLOW: 'flow',
  INTENT: 'intent',
  ENTITY: 'entity',
  FUNCTION: 'function',
  VARIABLE: 'variable',
  WORKFLOW: 'workflow',
  KNOWLEDGE_BASE: 'knowledge-base',
} as const;

export type CMSRoute = Enum<typeof CMSRoute>;

export const WorkspaceRoute = {
  PROFILE: 'profile',
  MEMBERS: 'members',
  BILLING: 'billing',
  SETTINGS: 'settings',
  TEMPLATE: 'template',
  INTEGRATIONS: 'integrations',
  ORGANIZATION: 'organization',
  ACCEPT_INVITE: 'accept-invite',
} as const;

export const WorkspaceOrganizationRoute = {
  SSO: 'sso',
  MEMBERS: 'members',
  SETTINGS: 'settings',
} as const;

export const ProjectSettingsRoute = {
  BACKUP: 'backup',
  GENERAL: 'general',
  VERSION: 'version',
  ENVIRONMENT: 'environment',
} as const;

export const AccountRoute = {
  PROFILE: 'profile',
  VERIFY_EMAIL: 'verify-email',
  INTEGRATIONS: 'integrations',
  CONFIRM_EMAIL: 'confirm-email',
} as const;

export const Path = {
  HOME: '/',

  // auth

  LOGIN: toPath(RootRoute.LOGIN),
  RESET: toPath(RootRoute.RESET),
  LOGOUT: toPath(RootRoute.LOGOUT),
  SIGNUP: toPath(RootRoute.SIGNUP),
  RESET_PASSWORD: toPath(RootRoute.RESET, ':id'),
  LOGIN_SSO_CALLBACK: toPath(RootRoute.LOGIN, LoginRoute.SSO, LoginSSORoute.CALLBACK),

  // other

  RUNTIME: toPath(RootRoute.RUNTIME),
  DASHBOARD: toPath(RootRoute.DASHBOARD),
  ONBOARDING: toPath(RootRoute.ONBOARDING),

  // account

  ACCOUNT: toPath(RootRoute.ACCOUNT),
  ACCOUNT_PROFILE: toPath(RootRoute.ACCOUNT, AccountRoute.PROFILE),
  ACCOUNT_VERIFY_EMAIL: toPath(RootRoute.ACCOUNT, AccountRoute.VERIFY_EMAIL),
  ACCOUNT_INTEGRATIONS: toPath(RootRoute.ACCOUNT, AccountRoute.INTEGRATIONS),
  ACCOUNT_CONFIRM_EMAIL: toPath(RootRoute.ACCOUNT, AccountRoute.CONFIRM_EMAIL),

  // workspace

  WORKSPACE: toPath(RootRoute.WORKSPACE),
  WORKSPACE_DASHBOARD: toPath(RootRoute.WORKSPACE, toParam(RouteParam.WORKSPACE_ID)),
  WORKSPACE_ACCEPT_INVITE: toPath(RootRoute.WORKSPACE, WorkspaceRoute.ACCEPT_INVITE),

  WORKSPACE_MEMBERS: toPath(RootRoute.WORKSPACE, toParam(RouteParam.WORKSPACE_ID), WorkspaceRoute.MEMBERS),
  WORKSPACE_BILLING: toPath(RootRoute.WORKSPACE, toParam(RouteParam.WORKSPACE_ID), WorkspaceRoute.BILLING),
  WORKSPACE_PROFILE: toPath(RootRoute.WORKSPACE, toParam(RouteParam.WORKSPACE_ID), WorkspaceRoute.PROFILE),
  WORKSPACE_SETTINGS: toPath(RootRoute.WORKSPACE, toParam(RouteParam.WORKSPACE_ID), WorkspaceRoute.SETTINGS),
  WORKSPACE_INTEGRATIONS: toPath(RootRoute.WORKSPACE, toParam(RouteParam.WORKSPACE_ID), WorkspaceRoute.INTEGRATIONS),

  WORKSPACE_ORGANIZATION: toPath(RootRoute.WORKSPACE, toParam(RouteParam.WORKSPACE_ID), WorkspaceRoute.ORGANIZATION),
  WORKSPACE_ORGANIZATION_SSO: toPath(
    RootRoute.WORKSPACE,
    toParam(RouteParam.WORKSPACE_ID),
    WorkspaceRoute.ORGANIZATION,
    WorkspaceOrganizationRoute.SSO
  ),
  WORKSPACE_ORGANIZATION_MEMBERS: toPath(
    RootRoute.WORKSPACE,
    toParam(RouteParam.WORKSPACE_ID),
    WorkspaceRoute.ORGANIZATION,
    WorkspaceOrganizationRoute.MEMBERS
  ),
  WORKSPACE_ORGANIZATION_SETTINGS: toPath(
    RootRoute.WORKSPACE,
    toParam(RouteParam.WORKSPACE_ID),
    WorkspaceRoute.ORGANIZATION,
    WorkspaceOrganizationRoute.SETTINGS
  ),

  // integrations

  INTEGRATION_ZENDESK_CALLBACK: toPath(RootRoute.INTEGRATIONS, IntegrationsRoute.ZENDESK),

  // public prototype

  PUBLIC_PROTOTYPE: toPath(RootRoute.PROTOTYPE, toParam(RouteParam.VERSION_ID)),

  // project

  PROJECT_VERSION: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID)),

  PROJECT_CMS: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CMS),
  PROJECT_CANVAS: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CANVAS, toParam(RouteParam.DIAGRAM_ID, true)),
  PROJECT_EXPORT: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.EXPORT, toParam(RouteParam.DIAGRAM_ID)),
  PROJECT_PUBLISH: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH),
  PROJECT_SETTINGS: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.SETTINGS),
  PROJECT_PROTOTYPE: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PROTOTYPE),
  PROJECT_ANALYTICS: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.ANALYTICS),
  PROJECT_CONVERSATIONS: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.CONVERSATIONS,
    toParam(RouteParam.TRANSCRIPT_ID, true)
  ),

  PROJECT_SETTINGS_BACKUP: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.SETTINGS, ProjectSettingsRoute.BACKUP),
  PROJECT_SETTINGS_GENERAL: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.SETTINGS, ProjectSettingsRoute.GENERAL),
  PROJECT_SETTINGS_VERSION: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.SETTINGS, ProjectSettingsRoute.VERSION),
  PROJECT_SETTINGS_ENVIRONMENT: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.SETTINGS, ProjectSettingsRoute.ENVIRONMENT),

  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
   */
  PROJECT_DOMAIN: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.DOMAIN, toParam(RouteParam.DOMAIN_ID, true)),
  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
   */
  PROJECT_ASSISTANT_OVERVIEW: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.ASSISTANT_OVERVIEW),

  // domain
  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
   */
  DOMAIN_CANVAS: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.DOMAIN,
    toParam(RouteParam.DOMAIN_ID),
    DomainRoute.CANVAS,
    toParam(RouteParam.DIAGRAM_ID, true)
  ),
  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
   */
  DOMAIN_CANVAS_TEXT_MARKUP: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.DOMAIN,
    toParam(RouteParam.DOMAIN_ID),
    DomainRoute.CANVAS,
    toParam(RouteParam.DIAGRAM_ID),
    CanvasRoute.MARKUP
  ),
  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
   */
  DOMAIN_CANVAS_NODE: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.DOMAIN,
    toParam(RouteParam.DOMAIN_ID),
    DomainRoute.CANVAS,
    toParam(RouteParam.DIAGRAM_ID),
    CanvasRoute.NODE,
    toParam(RouteParam.NODE_ID)
  ),
  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
   */
  DOMAIN_CANVAS_COMMENTING: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.DOMAIN,
    toParam(RouteParam.DOMAIN_ID),
    DomainRoute.CANVAS,
    toParam(RouteParam.DIAGRAM_ID),
    CanvasRoute.COMMENTING
  ),
  /**
   * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
   */
  DOMAIN_CANVAS_COMMENTING_THREAD: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.DOMAIN,
    toParam(RouteParam.DOMAIN_ID),
    DomainRoute.CANVAS,
    toParam(RouteParam.DIAGRAM_ID),
    CanvasRoute.COMMENTING,
    toParam(RouteParam.THREAD_ID),
    toParam(RouteParam.COMMENT_ID, true)
  ),

  // canvas
  CANVAS_NODE: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.CANVAS,
    toParam(RouteParam.DIAGRAM_ID),
    CanvasRoute.NODE,
    toParam(RouteParam.NODE_ID)
  ),
  CANVAS_COMMENTING: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.CANVAS,
    toParam(RouteParam.DIAGRAM_ID),
    CanvasRoute.COMMENTING
  ),
  CANVAS_TEXT_MARKUP: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.CANVAS,
    toParam(RouteParam.DIAGRAM_ID),
    CanvasRoute.MARKUP
  ),
  CANVAS_COMMENTING_THREAD: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.CANVAS,
    toParam(RouteParam.DIAGRAM_ID),
    CanvasRoute.COMMENTING,
    toParam(RouteParam.THREAD_ID),
    toParam(RouteParam.COMMENT_ID, true)
  ),

  // publish

  PUBLISH: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH),
  PUBLISH_API: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.API),
  PUBLISH_TEAMS: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.MICROSOFT_TEAMS),
  PUBLISH_EXPORT: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.EXPORT),
  PUBLISH_GENERAL: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.GENERAL),
  PUBLISH_WEBCHAT: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.WEBCHAT),
  PUBLISH_DIALOGFLOW: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.DIALOGFLOW),

  PUBLISH_SMS: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.SMS),
  PROTOTYPE_SMS: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.PROTOTYPE_SMS),

  PUBLISH_WHATSAPP: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.WHATSAPP),
  PROTOTYPE_WHATSAPP: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.PUBLISH, PublishRoute.PROTOTYPE_WHATSAPP),

  // cms

  CMS_RESOURCE: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CMS, toParam(RouteParam.RESOURCE_TYPE)),
  CMS_RESOURCE_ACTIVE: toPath(
    RootRoute.PROJECT,
    toParam(RouteParam.VERSION_ID),
    ProjectRoute.CMS,
    toParam(RouteParam.RESOURCE_TYPE),
    toParam(RouteParam.RESOURCE_ID)
  ),

  CMS_FLOW: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CMS, CMSRoute.FLOW),
  CMS_INTENT: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CMS, CMSRoute.INTENT),
  CMS_ENTITY: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CMS, CMSRoute.ENTITY),
  CMS_FUNCTION: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CMS, CMSRoute.FUNCTION),
  CMS_VARIABLE: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CMS, CMSRoute.VARIABLE),
  CMS_WORKFLOW: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CMS, CMSRoute.WORKFLOW),
  CMS_KNOWLEDGE_BASE: toPath(RootRoute.PROJECT, toParam(RouteParam.VERSION_ID), ProjectRoute.CMS, CMSRoute.KNOWLEDGE_BASE),
} as const;
