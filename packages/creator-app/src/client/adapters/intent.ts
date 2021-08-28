import { Intent as DBIntent } from '@voiceflow/api-sdk';
import { PlatformType } from '@voiceflow/internal';

import { createAdapter } from '@/client/adapters/utils';
import { Intent } from '@/models';
import { denormalize, normalize } from '@/utils/normalized';

const IntentInputSanitizer = ({ text, slots, voice }: any): any => ({
  text: text || '',
  slots: slots || [],
  voice,
});

const IntentSlotSanitizer = ({ id, dialog: { prompt = [], confirm = [], utterances = [], confirmEnabled = false }, required = false }: any): any => ({
  id,
  dialog: {
    prompt: prompt.map(IntentInputSanitizer),
    confirm: confirm.map(IntentInputSanitizer),
    utterances: utterances.map(IntentInputSanitizer),
    confirmEnabled,
  },
  required,
});

const intentAdapter = (platform: PlatformType) =>
  createAdapter<DBIntent, Intent>(
    ({ key, name, inputs, slots = [] }) => ({
      id: key,
      name,
      slots: normalize(slots.map(IntentSlotSanitizer)),
      inputs: inputs.map(({ text = '', slots = [] }) => ({ text, slots })),
      platform,
    }),
    ({ id, name, slots, inputs }) => ({
      key: id,
      name,
      slots: denormalize(slots as any).map(IntentSlotSanitizer),
      inputs,
    })
  );

export default intentAdapter;
