import { Models as BaseModels } from '@voiceflow/base-types';
import { Types as ChatTypes } from '@voiceflow/chat-types';
import { Constants } from '@voiceflow/general-types';
import { Types as VoiceTypes } from '@voiceflow/voice-types';

import { Normalized } from '../utils/normalized';
import { AnyVersionPlatformData } from './Version';

export type IntentInput = BaseModels.IntentInput;
export type BaseIntentSlot = BaseModels.IntentSlot;
export type BaseIntentSlotDialog = BaseModels.IntentSlotDialog;

export interface VoiceIntentSlotDialog<V = string> extends BaseIntentSlotDialog {
  prompt: VoiceTypes.IntentPrompt<V>[];
  confirm: VoiceTypes.IntentPrompt<V>[];
}

export interface ChatIntentSlotDialog extends BaseIntentSlotDialog {
  prompt: ChatTypes.Prompt[];
  confirm: ChatTypes.Prompt[];
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
  platform: Constants.PlatformType;
}

export interface VoiceIntent<V = string> extends BaseIntent {
  slots: Normalized<VoiceIntentSlot<V>>;
}

export interface ChatIntent extends BaseIntent {
  slots: Normalized<ChatIntentSlot>;
}

export interface IntentPerPlatform {
  [Constants.PlatformType.CHATBOT]: ChatIntent;
}

export type PlatformIntent<T extends Constants.PlatformType> = T extends keyof IntentPerPlatform ? IntentPerPlatform[T] : VoiceIntent;

export type Intent = ChatIntent | VoiceIntent;

export type IntentSlot = VoiceIntentSlot | ChatIntentSlot;

export type IntentSlotDialog = VoiceIntentSlotDialog | ChatIntentSlotDialog;

export type DBIntent = AnyVersionPlatformData['intents'][number];

export type AnyDBIntent = VoiceTypes.Intent<string> | ChatTypes.Intent;
