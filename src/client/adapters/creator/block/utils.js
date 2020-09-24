import _isString from 'lodash/isString';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import { createSimpleAdapter } from '@/client/adapters/utils';
import { PLATFORMS, PLATFORM_META, RepromptType } from '@/constants';

export const createBlockAdapter = createSimpleAdapter;

export const repromptAdapter = {
  fromDB: (reprompt) => {
    if (!reprompt) return null;
    let type = reprompt.type || RepromptType.TEXT;
    if (reprompt.voice === 'audio') {
      type = RepromptType.AUDIO;
    }

    let content = reprompt.content;
    // Catch old reprompt formats and convert them to an acceptable fromDB
    // format before feeding into the adapters below
    if (_isString(reprompt.content)) {
      content = textEditorContentAdapter.toDB(reprompt.content);
    }

    return reprompt
      ? {
          type,
          audio: type === RepromptType.TEXT ? null : reprompt.content,
          content: type === RepromptType.TEXT ? textEditorContentAdapter.fromDB(content) : '',
          voice: type === RepromptType.TEXT ? reprompt.voice : null,
          desc: reprompt.desc || '',
        }
      : null;
  },
  toDB: (reprompt) =>
    reprompt
      ? {
          content: reprompt.type === RepromptType.TEXT ? textEditorContentAdapter.toDB(reprompt.content) : reprompt.audio,
          voice: reprompt.type === RepromptType.TEXT ? reprompt.voice : 'audio',
          type: reprompt.type,
          desc: reprompt.type === RepromptType.TEXT ? undefined : reprompt.desc || undefined,
        }
      : null,
};

export const platformDependentAdapter = (adapter) => {
  const perKeyAdapter = (transform, incoming) => (data) =>
    PLATFORMS.reduce((acc, key) => {
      if (PLATFORM_META[key].hidden) {
        return acc;
      }
      acc[key] = transform(data[key]);
      if (data.reprompt) {
        acc.reprompt = incoming ? repromptAdapter.fromDB(data.reprompt) : repromptAdapter.toDB(data.reprompt);
      }

      return acc;
    }, {});

  return {
    fromDB: perKeyAdapter(adapter.fromDB, true),
    toDB: perKeyAdapter(adapter.toDB, false),
  };
};

export const slotMappingAdapter = {
  fromDB: (mappings) => mappings?.map(({ variable = null, slot }) => ({ variable, slot: slot?.value || slot?.key || null })) || [],
  toDB: (mappings) => mappings?.map(({ variable = null, slot = null }) => ({ variable, slot: slot ? { key: slot } : null })) || [],
};
