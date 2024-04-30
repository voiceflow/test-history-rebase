import type { Optional, Required } from 'utility-types';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

import * as PromptAdapter from '../adapters/prompt';
import type * as Models from '../models';
import * as PromptUtils from './prompt';

export const slotDialogSanitizer = ({
  prompt = [],
  confirm = [],
  ...baseDialog
}: Optional<Models.Intent.SlotDialog> = {}): Models.Intent.SlotDialog => ({
  ...Base.Utils.Intent.slotDialogSanitizer(baseDialog),
  prompt: PromptAdapter.simple.mapFromDB(prompt),
  confirm: PromptAdapter.simple.mapFromDB(confirm),
});

export const slotSanitizer = ({
  dialog,
  ...baseIntentSlot
}: Required<Optional<Models.Intent.Slot>, 'id'>): Models.Intent.Slot => ({
  ...Base.Utils.Intent.slotSanitizer(baseIntentSlot),
  dialog: slotDialogSanitizer(dialog),
});

export const CONFIG = Base.Utils.Intent.extend({
  slotFactory: slotSanitizer,

  slotSanitizer,

  isPrompt: PromptUtils.isPrompt,

  promptFactory: PromptUtils.factory,

  isPromptEmpty: PromptUtils.isEmpty,

  slotDialogSanitizer,
})(Base.Utils.Intent.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
