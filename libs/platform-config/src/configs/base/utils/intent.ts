import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { Utils } from '@voiceflow/common';
import { DeepPartial, Required } from 'utility-types';

import * as Models from '../models';

export const isPrompt = (_value?: unknown): _value is unknown => false;

export const isPromptEmpty = () => true;

export const promptFactory = (): unknown => ({});

export const inputSanitizer = ({ text, slots }: DeepPartial<Models.Intent.Input> = {}): Models.Intent.Input => ({
  text: text || '',
  slots: slots?.filter(Utils.array.isNotNullish) || [],
});

export const slotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  utterances = [],
  confirmEnabled = false,
}: DeepPartial<Models.Intent.SlotDialog> = {}): Models.Intent.SlotDialog => ({
  prompt,
  confirm,
  utterances: utterances.map(inputSanitizer),
  confirmEnabled,
});

export const slotSanitizer = ({ id, dialog, required = false }: Required<DeepPartial<Models.Intent.Slot>, 'id'>): Models.Intent.Slot => ({
  id,
  dialog: slotDialogSanitizer(dialog),
  required,
});

export interface PromptFactoryOptions {
  defaultVoice?: string | null;
}

export interface Config {
  isPrompt: typeof isPrompt;

  slotFactory: typeof slotSanitizer;

  slotSanitizer: typeof slotSanitizer;

  promptFactory: (options: PromptFactoryOptions) => unknown;

  isPromptEmpty: (prompt?: unknown) => boolean;

  inputSanitizer: typeof inputSanitizer;

  slotDialogSanitizer: typeof slotDialogSanitizer;
}

export const CONFIG = Types.satisfies<Config>()({
  isPrompt,

  slotFactory: slotSanitizer,

  slotSanitizer,

  promptFactory,

  isPromptEmpty,

  inputSanitizer,

  slotDialogSanitizer,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
