import cuid from 'cuid';

import { textEditorContentAdapter } from '@/client/adapters/textEditor';
import { createAdapter } from '@/client/adapters/utils';
import { ChoiceElseType, DialogType } from '@/constants';
import { isBuiltInIntent } from '@/utils/intent';

import { createBlockAdapter, repromptAdapter, slotMappingAdapter } from './utils';

const getChoiceByIndex = (choices, index) => ({
  id: cuid.slug(),
  intent: choices[index]?.intent?.key || choices[index]?.intent?.value || null,
  mappings: slotMappingAdapter.fromDB(choices[index]?.mappings),
});

// For backwards compatibility with old Choice block
const createElseDataDefaults = () => ({
  type: ChoiceElseType.PATH,
  randomize: false,
  reprompts: [],
});

export const noMatchAdapter = createAdapter(
  ({ randomize, reprompts }) => ({
    randomize,
    reprompts: reprompts.map((dbData) =>
      dbData.type === DialogType.AUDIO ? dbData : { ...dbData, content: textEditorContentAdapter.fromDB(dbData.content) }
    ),
  }),
  ({ randomize, reprompts }) => ({
    randomize,
    reprompts: reprompts.map((uiData) =>
      uiData.type === DialogType.AUDIO ? uiData : { ...uiData, content: textEditorContentAdapter.toDB(uiData.content) }
    ),
  })
);

export const elseAdapter = createAdapter(
  ({ type, ...props }) => ({
    type,
    ...noMatchAdapter.fromDB(props),
  }),

  ({ type, ...props }) => ({
    type,
    ...noMatchAdapter.toDB(props),
  })
);

const mapChoiceToDB = ({ intent, mappings }) => ({
  intent: intent
    ? {
        key: intent,
        value: intent,
        built_in: isBuiltInIntent(intent),
      }
    : null,
  mappings: slotMappingAdapter.toDB(mappings),
});

const interactionBlockAdapter = createBlockAdapter(
  ({ name, alexa, google, reprompt, else: elseData }) => ({
    name,
    choices: Array.from({ length: Math.max(alexa.choices.length, google.choices.length) }, (_, i) => ({
      alexa: getChoiceByIndex(alexa.choices, i),
      google: getChoiceByIndex(google.choices, i),
    })),
    reprompt: repromptAdapter.fromDB(reprompt),
    else: elseAdapter.fromDB(elseData || createElseDataDefaults()),
  }),
  ({ name, choices, reprompt, else: elseData }) => ({
    name,
    alexa: { choices: choices.map(({ alexa }) => mapChoiceToDB(alexa)) },
    google: { choices: choices.map(({ google }) => mapChoiceToDB(google)) },
    reprompt: repromptAdapter.toDB(reprompt),
    else: elseAdapter.toDB(elseData),
  })
);

export default interactionBlockAdapter;
