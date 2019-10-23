import _ from 'lodash';

import { draftJSContentAdapter } from '@/client/adapters/draft';
import { DialogType } from '@/constants';

import { createBlockAdapter } from './utils';

const speakBlockAdapter = createBlockAdapter(
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map(({ audio, voice, rawContent, open }) => ({
      open: typeof open === 'boolean' ? open : true,
      ...(_.isString(audio)
        ? {
            type: DialogType.AUDIO,
            url: audio,
          }
        : {
            type: DialogType.VOICE,
            voice: voice || 'Alexa',
            content: draftJSContentAdapter.fromDB(rawContent),
          }),
    })),
  }),
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map((dialog) => ({
      index: '',
      open: dialog.open,
      ...(dialog.type === DialogType.AUDIO
        ? {
            audio: dialog.url || '',
          }
        : {
            voice: dialog.voice,
            rawContent: draftJSContentAdapter.toDB(dialog.content),
          }),
    })),
  })
);

export default speakBlockAdapter;
