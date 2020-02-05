import cuid from 'cuid';
import _isString from 'lodash/isString';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import { DialogType } from '@/constants';

import { createBlockAdapter } from './utils';

const speakBlockAdapter = createBlockAdapter(
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map(({ audio, voice, rawContent }) => ({
      id: cuid.slug(),
      ...(_isString(audio)
        ? {
            type: DialogType.AUDIO,
            url: audio,
          }
        : {
            type: DialogType.VOICE,
            voice: voice || 'Alexa',
            content: textEditorContentAdapter.fromDB(rawContent),
          }),
    })),
  }),
  ({ randomize, dialogs }) => ({
    randomize,
    dialogs: dialogs.map((dialog) => ({
      index: '',
      ...(dialog.type === DialogType.AUDIO
        ? {
            audio: dialog.url || '',
          }
        : {
            voice: dialog.voice,
            rawContent: textEditorContentAdapter.toDB(dialog.content),
          }),
    })),
  })
);

export default speakBlockAdapter;
