import * as Platform from '@voiceflow/platform-config/backend';

export * from './block';
export * from './knowledge-base';
export * from './platform';
export * from './user';

export const PROTOCOL_KEY = 'protocol';
export const CREATOR_KEY = 'creator';
export const WORKSPACE_KEY = 'workspace';
export const PROJECT_KEY = 'project';
export const PROJECT_LIST_KEY = 'project_list';
export const VERSION_KEY = 'version';
export const SCHEMA_KEY = 'schema';
export const DIAGRAM_KEY = 'diagram';
export const NODE_KEY = 'node';
export const BLOCK_KEY = 'block';
export const ACTIONS_KEY = 'actions';
export const STEP_KEY = 'step';
export const LINK_KEY = 'link';
export const PORT_KEY = 'port';
export const AWARENESS_KEY = 'awareness';
export const SETTINGS_KEY = 'settings';
export const DEFAULT_STEP_COLORS_KEY = 'default_step_colors';
export const SESSION_KEY = 'session';
export const PUBLISHING_KEY = 'publishing';
export const PROTOTYPE_KEY = 'prototype';
export const MEMBER_KEY = 'member';
export const INVITE_KEY = 'invite';
export const CANVAS_TEMPLATE_KEY = 'canvas_template';
export const TEMPLATE_DIAGRAM_KEY = 'template_diagram';
export const RPC_KEY = 'rpc';
export const VARIABLE_STATE_KEY = 'variable_state';
export const VIEWPORT_KEY = 'viewport';
export const TRANSCRIPT_KEY = 'transcript';
export const CUSTOM_BLOCK_KEY = 'custom_block';
export const NLU_KEY = 'nlu';
export const QUOTAS_KEY = 'quotas';
export const WORKSPACE_SETTINGS_KEY = 'workspace_settings';
export const DASHBOARD_KANBAN_KEY = 'dashboard_kanban';
export const ORGANIZATION_KEY = 'organization';
export const FEATURES_KEY = 'feature';

export const DEFAULT_PROJECT_LIST_NAME = 'Default List';

export const CUSTOM_SLOT_TYPE = 'Custom';
export const LEGACY_CUSTOM_SLOT_TYPE = 'CUSTOM';

export const PLATFORMS_WITH_EDITABLE_NO_REPLY_DELAY = [
  Platform.Constants.PlatformType.VOICEFLOW,
  Platform.Constants.PlatformType.WEBCHAT,
] as const;

export enum DialogType {
  AUDIO = 'audio',
  VOICE = 'voice',
}

export const START_NODE_ID = 'start00000000000000000000';
export const START_NODE_COLOR = '#43494E';
export const START_NODE_POSITION: [number, number] = [360, 120];
export const CURRENT_PROJECT_VERSION = 1.2;

export enum WorkspaceActivationState {
  LOCKED = 'LOCKED',
  WARNING = 'WARNING',
}
