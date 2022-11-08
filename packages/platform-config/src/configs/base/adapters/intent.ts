import { PlatformType } from '@platform-config/constants';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';
import { Optional, Required } from 'utility-types';

import * as Models from '../models';
import { hasValue } from './utils';

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

export type KeyRemap = [['key', 'id']];
export type ToDBOptions = [];
export type FromDBOptions = [{ platform: PlatformType }];

export const smart = createSmartMultiAdapter<
  Omit<BaseModels.Intent, 'slots'>,
  Omit<Models.Intent.Model, 'slots'>,
  FromDBOptions,
  ToDBOptions,
  KeyRemap
>(
  (dbIntent, { platform }) => ({
    ...(hasValue(dbIntent, 'key') && { id: dbIntent.key }),
    ...(hasValue(dbIntent, 'name') && { name: dbIntent.name }),
    ...(hasValue(dbIntent, 'noteID') && { noteID: dbIntent.noteID }),
    ...(hasValue(dbIntent, 'inputs') && { inputs: dbIntent.inputs.map(inputSanitizer) }),
    platform,
  }),
  (intent) => ({
    ...(hasValue(intent, 'id') && { key: intent.id }),
    ...(hasValue(intent, 'name') && { name: intent.name }),
    ...(hasValue(intent, 'noteID') && { noteID: intent.noteID }),
    ...(hasValue(intent, 'inputs') && { inputs: intent.inputs.map(inputSanitizer) }),
  })
);

export const simple = createMultiAdapter<Omit<BaseModels.Intent, 'slots'>, Omit<Models.Intent.Model, 'slots'>, [{ platform: PlatformType }]>(
  ({ inputs = [], ...baseIntent }, ...args) => smart.fromDB({ inputs, ...baseIntent }, ...args),
  smart.toDB
);
