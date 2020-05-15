import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import { createSimpleAdapter } from '@/client/adapters/utils';
import { PLATFORMS, RepromptType } from '@/constants';

export const createBlockAdapter = createSimpleAdapter;

export const repromptAdapter = {
  fromDB: (reprompt) => {
    if (!reprompt) return null;
    let type = reprompt.type || RepromptType.TEXT;
    if (reprompt.voice === 'audio') {
      type = RepromptType.AUDIO;
    }

    let content = reprompt.content;
    if (typeof reprompt.content === 'string') {
      content = textEditorContentAdapter.toDB(reprompt.content);
    }

    return reprompt
      ? {
          type,
          audio: type === RepromptType.TEXT ? null : textEditorContentAdapter.fromDB(content),
          content: type === RepromptType.TEXT ? textEditorContentAdapter.fromDB(content) : '',
          voice: type === RepromptType.TEXT ? reprompt.voice : null,
        }
      : null;
  },
  toDB: (reprompt) =>
    reprompt
      ? {
          content:
            reprompt.type === RepromptType.TEXT ? textEditorContentAdapter.toDB(reprompt.content) : textEditorContentAdapter.toDB(reprompt.audio),
          voice: reprompt.type === RepromptType.TEXT ? reprompt.voice : 'audio',
          type: reprompt.type,
        }
      : null,
};

export const platformDependentAdapter = (adapter) => {
  const perKeyAdapter = (transform, incoming) => (data) =>
    PLATFORMS.reduce((acc, key) => {
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
