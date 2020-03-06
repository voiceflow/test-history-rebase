import { denormalize, normalize } from '@/utils/normalized';

import { createAdapter } from './utils';

export enum Platform {
  ALEXA = 'alexa',
  GOOGLE = 'gooogle',
}

export interface IntentText {
  text: string;
  slots: string[];
}

export interface IntentSlot {
  id: string;
  dialog: {
    prompt: IntentText[];
    utterances: IntentText[];
    confirm: IntentText[];
    confirmEnabled: boolean;
  };
  required: boolean;
}

export interface RawIntent {
  key: string;
  name: string;
  slots?: IntentSlot[];
  inputs: IntentText[];
  _platform: Platform;
}

export interface Intent {
  id: string;
  name: string;
  slots: {
    allKeys: string[];
    byKey: Record<string, IntentSlot>;
  };
  inputs: IntentText[];
  platform: Platform;
}

const intentAdapter = createAdapter<RawIntent, Intent>(
  ({ key, name, inputs, slots = [], _platform }) => ({
    id: key,
    name,
    slots: normalize(slots),
    inputs: inputs.map(({ text = '', slots = [] }) => ({ text, slots })),
    platform: _platform,
  }),
  ({ id, name, slots, inputs, platform }) => ({
    key: id,
    name,
    slots: denormalize(slots),
    inputs,
    _platform: platform,
  })
);

export default intentAdapter;
