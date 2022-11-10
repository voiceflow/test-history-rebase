import { BaseModels } from '@voiceflow/base-types';
import { ChatModels } from '@voiceflow/chat-types';
import * as Platform from '@voiceflow/platform-config';
import { VoiceModels } from '@voiceflow/voice-types';
import { Normalized } from 'normal-store';

import { AnyVersionPlatformData } from './Version';

export type IntentInput = BaseModels.IntentInput;
export type BaseIntentSlot = BaseModels.IntentSlot;
export type BaseIntentSlotDialog = BaseModels.IntentSlotDialog;

export interface VoiceIntentSlotDialog<V = string> extends BaseIntentSlotDialog {
  prompt: VoiceModels.IntentPrompt<V>[];
  confirm: VoiceModels.IntentPrompt<V>[];
}

export interface ChatIntentSlotDialog extends BaseIntentSlotDialog {
  prompt: ChatModels.Prompt[];
  confirm: ChatModels.Prompt[];
}

export interface VoiceIntentSlot<V = string> extends BaseIntentSlot {
  dialog: VoiceIntentSlotDialog<V>;
}

export interface ChatIntentSlot extends BaseIntentSlot {
  dialog: ChatIntentSlotDialog;
}

export interface BaseIntent {
  id: string;
  name: string;
  slots: Normalized<BaseIntentSlot>;
  inputs: IntentInput[];
  noteID?: string;
}

export interface VoiceIntent<V = string> extends BaseIntent {
  slots: Normalized<VoiceIntentSlot<V>>;
}

export interface ChatIntent extends BaseIntent {
  slots: Normalized<ChatIntentSlot>;
}

export type ProjectTypeIntent<T extends Platform.Constants.ProjectType> = T extends Platform.Constants.ProjectType.CHAT ? ChatIntent : VoiceIntent;

export type Intent = ChatIntent | VoiceIntent;

export type IntentSlot = VoiceIntentSlot | ChatIntentSlot;

export type IntentSlotDialog = VoiceIntentSlotDialog | ChatIntentSlotDialog;

export type DBIntent = AnyVersionPlatformData['intents'][number];

export type AnyDBIntent = VoiceModels.Intent<string> | ChatModels.Intent;
