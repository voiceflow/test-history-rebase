import type { KnowledgeBaseSettings } from '@voiceflow/dtos';
import { KB_SETTINGS_DEFAULT } from '@voiceflow/realtime-sdk';

export type SettingsState = KnowledgeBaseSettings;

export const STATE_KEY = 'settings';

export const INITIAL_STATE: SettingsState = KB_SETTINGS_DEFAULT;
