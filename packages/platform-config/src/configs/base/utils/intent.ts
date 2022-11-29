import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { Optional, Required } from 'utility-types';

import * as Models from '../models';

export const inputSanitizer = ({ text, slots }: Partial<Models.Intent.Input> = {}): Models.Intent.Input => ({ text: text || '', slots: slots || [] });

export const slotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  utterances = [],
  confirmEnabled = false,
}: Partial<Models.Intent.SlotDialog> = {}): Models.Intent.SlotDialog => ({
  prompt,
  confirm,
  utterances: utterances.map(inputSanitizer),
  confirmEnabled,
});

export const slotSanitizer = ({ id, dialog, required = false }: Required<Optional<Models.Intent.Slot>, 'id'>): Models.Intent.Slot => ({
  id,
  dialog: slotDialogSanitizer(dialog),
  required,
});

export interface PromptFactoryOptions {
  defaultVoice?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const promptFactory = (_options: PromptFactoryOptions): unknown => ({});

export interface Config {
  slotFactory: typeof slotSanitizer;

  slotSanitizer: typeof slotSanitizer;

  promptFactory: typeof promptFactory;

  inputSanitizer: typeof inputSanitizer;

  slotDialogSanitizer: typeof slotDialogSanitizer;
}

export const CONFIG = Types.satisfies<Config>()({
  slotFactory: slotSanitizer,

  slotSanitizer,

  promptFactory,

  inputSanitizer,

  slotDialogSanitizer,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
