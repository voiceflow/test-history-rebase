import { Constants } from '@voiceflow/general-types';

export * from './block';
export * from './variable';

export const PROTOCOL_KEY = 'protocol';
export const USER_KEY = 'user';
export const CREATOR_KEY = 'creator';
export const WORKSPACE_KEY = 'workspace';
export const PROJECT_KEY = 'project';
export const PROJECT_LIST_KEY = 'project_list';
export const VERSION_KEY = 'version';
export const DIAGRAM_KEY = 'diagram';
export const INTENT_KEY = 'intent';
export const SLOT_KEY = 'slot';
export const PRODUCT_KEY = 'product';
export const NODE_KEY = 'node';
export const LINK_KEY = 'link';
export const AWARENESS_KEY = 'awareness';
export const LOCAL_KEY = 'local';
export const SETTINGS_KEY = 'settings';
export const SESSION_KEY = 'session';
export const PUBLISHING_KEY = 'publishing';
export const PLATFORM_DATA_KEY = 'platform_data';
export const MEMBER_KEY = 'member';
export const INVITE_KEY = 'invite';
export const VARIABLES_KEY = 'variables';
export const TOPIC_KEY = 'topic';
export const COMPONENT_KEY = 'component';
export const RPC_KEY = 'rpc';

export const DEFAULT_PROJECT_LIST_NAME = 'Default List';

export const CUSTOM_SLOT_TYPE = 'Custom';
export const LEGACY_CUSTOM_SLOT_TYPE = 'CUSTOM';

export const GENERAL_PLATFORMS = [
  Constants.PlatformType.GENERAL,
  Constants.PlatformType.IVR,
  Constants.PlatformType.MOBILE_APP,
  Constants.PlatformType.CHATBOT,
] as const;

export const DIALOGFLOW_PLATFORMS = [Constants.PlatformType.DIALOGFLOW_ES_CHAT, Constants.PlatformType.DIALOGFLOW_ES_VOICE] as const;

export const DISTINCT_PLATFORMS = [Constants.PlatformType.ALEXA, Constants.PlatformType.GOOGLE, Constants.PlatformType.GENERAL] as const;

export type DistinctPlatform = Constants.PlatformType.ALEXA | Constants.PlatformType.GOOGLE | Constants.PlatformType.GENERAL;

export enum DialogType {
  AUDIO = 'audio',
  VOICE = 'voice',
}

export enum RepromptType {
  TEXT = 'text',
  AUDIO = 'audio',
}

export enum PortType {
  NEXT = 'next',
  PAUSE = 'pause',
  PREVIOUS = 'previous',
}

export enum BlockVariant {
  STANDARD = 'standard',
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  PURPLE = 'purple',
}
