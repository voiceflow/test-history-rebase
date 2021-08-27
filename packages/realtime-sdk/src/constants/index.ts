import { PlatformType } from '@voiceflow/internal';

export * from './block';

export const CREATOR_KEY = 'creator';
export const WORKSPACE_KEY = 'workspace';
export const PROJECT_KEY = 'project';
export const PROJECT_LIST_KEY = 'project_list';
export const VERSION_KEY = 'version';
export const DIAGRAM_KEY = 'diagram';
export const NODE_KEY = 'node';
export const LINK_KEY = 'link';
export const AWARENESS_KEY = 'awareness';
export const LOCAL_KEY = 'local';

export const DEFAULT_PROJECT_LIST_NAME = 'Default List';

export const CUSTOM_SLOT_TYPE = 'Custom';
export const LEGACY_CUSTOM_SLOT_TYPE = 'CUSTOM';

export const GENERAL_PLATFORMS = [PlatformType.GENERAL, PlatformType.IVR, PlatformType.MOBILE_APP, PlatformType.CHATBOT] as const;

export const DISTINCT_PLATFORMS = [PlatformType.ALEXA, PlatformType.GOOGLE, PlatformType.GENERAL] as const;

export type DistinctPlatform = PlatformType.ALEXA | PlatformType.GOOGLE | PlatformType.GENERAL;

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
