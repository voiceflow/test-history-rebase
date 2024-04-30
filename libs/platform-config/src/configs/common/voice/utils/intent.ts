import { Utils } from '@voiceflow/common';
import type { Optional, Required } from 'utility-types';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import type * as Models from '../models';

export const promptSanitizer = ({ text, slots, voice }: Optional<Models.Intent.Prompt> = {}): Models.Intent.Prompt => ({
  text: text || '',
  slots: slots || [],
  voice,
});

export const slotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  ...baseDialog
}: Optional<Models.Intent.SlotDialog> = {}): Models.Intent.SlotDialog => ({
  ...Base.Utils.Intent.slotDialogSanitizer(baseDialog),
  prompt: prompt.map(promptSanitizer),
  confirm: confirm.map(promptSanitizer),
});

export const slotSanitizer = ({
  dialog,
  ...baseIntentSlot
}: Required<Optional<Models.Intent.Slot>, 'id'>): Models.Intent.Slot => ({
  ...Base.Utils.Intent.slotSanitizer(baseIntentSlot),
  dialog: slotDialogSanitizer(dialog),
});

export const isPrompt = (value?: unknown): value is Models.Intent.Prompt => {
  if (!Utils.object.isObject(value)) return false;

  return Utils.object.hasProperty(value, 'text') && typeof value.text === 'string';
};

export type PromptFactoryOptions = Base.Utils.Intent.PromptFactoryOptions;

export const promptFactory = ({ defaultVoice }: PromptFactoryOptions): Models.Intent.Prompt => ({
  text: '',
  slots: [],
  voice: defaultVoice ?? '',
});

export const isPromptEmpty = (prompt?: Models.Intent.Prompt): boolean => {
  if (!prompt) return true;

  return !prompt.text?.trim();
};

export const CONFIG = Base.Utils.Intent.extend({
  isPrompt,

  slotFactory: slotSanitizer,

  slotSanitizer,

  promptFactory,

  isPromptEmpty,

  promptSanitizer,

  slotDialogSanitizer,
})(Base.Utils.Intent.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
