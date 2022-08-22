import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export * from './block';
export * from './platform';
export * from './variable';

export const PROTOCOL_KEY = 'protocol';
export const CREATOR_KEY = 'creator';
export const WORKSPACE_KEY = 'workspace';
export const PROJECT_KEY = 'project';
export const PROJECT_LIST_KEY = 'project_list';
export const VERSION_KEY = 'version';
export const SCHEMA_KEY = 'schema';
export const DIAGRAM_KEY = 'diagram';
export const DOMAIN_KEY = 'domain';
export const INTENT_KEY = 'intent';
export const THREAD_KEY = 'thread';
export const SLOT_KEY = 'slot';
export const PRODUCT_KEY = 'product';
export const NODE_KEY = 'node';
export const BLOCK_KEY = 'block';
export const ACTIONS_KEY = 'actions';
export const STEP_KEY = 'step';
export const LINK_KEY = 'link';
export const PORT_KEY = 'port';
export const AWARENESS_KEY = 'awareness';
export const LOCAL_KEY = 'local';
export const SETTINGS_KEY = 'settings';
export const DEFAULT_STEP_COLORS_KEY = 'default_step_colors';
export const SESSION_KEY = 'session';
export const PUBLISHING_KEY = 'publishing';
export const PLATFORM_DATA_KEY = 'platform_data';
export const PROTOTYPE_KEY = 'prototype';
export const MEMBER_KEY = 'member';
export const INVITE_KEY = 'invite';
export const VARIABLES_KEY = 'variables';
export const TOPIC_KEY = 'topic';
export const TOPICS_KEY = 'topics';
export const COMPONENT_KEY = 'component';
export const COMPONENTS_KEY = 'components';
export const CANVAS_TEMPLATE_KEY = 'canvas_template';
export const TEMPLATE_DIAGRAM_KEY = 'template_diagram';
export const RPC_KEY = 'rpc';
export const NOTE_KEY = 'note';
export const VARIABLE_STATE_KEY = 'variable_state';
export const VIEWPORT_KEY = 'viewport';

export const DEFAULT_PROJECT_LIST_NAME = 'Default List';

export const CUSTOM_SLOT_TYPE = 'Custom';
export const LEGACY_CUSTOM_SLOT_TYPE = 'CUSTOM';

export const PLATFORMS_WITH_INVOCATION_NAME = [VoiceflowConstants.PlatformType.ALEXA, VoiceflowConstants.PlatformType.GOOGLE] as const;

export enum DialogType {
  AUDIO = 'audio',
  VOICE = 'voice',
}

export enum VoicePromptType {
  TEXT = 'text',
  AUDIO = 'audio',
}

export const START_NODE_COLOR = '#2b2f32';
export const CURRENT_PROJECT_VERSION = 1.2;
