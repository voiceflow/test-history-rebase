import cuid from 'cuid';

import { isBuiltInIntent } from '@/utils/intent';

import { createBlockAdapter, slotMappingAdapter } from './utils';

const getChoiceByIndex = (choices, index) => ({
  id: cuid.slug(),
  intent: choices[index]?.intent?.key || choices[index]?.intent?.value || null,
  mappings: slotMappingAdapter.fromDB(choices[index]?.mappings),
});

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
  ({ name, alexa, google }) => ({
    name,
    choices: Array.from({ length: Math.max(alexa.choices.length, google.choices.length) }, (_, i) => ({
      alexa: getChoiceByIndex(alexa.choices, i),
      google: getChoiceByIndex(google.choices, i),
    })),
  }),
  ({ name, choices }) => ({
    name,
    alexa: { choices: choices.map(({ alexa }) => mapChoiceToDB(alexa)) },
    google: { choices: choices.map(({ google }) => mapChoiceToDB(google)) },
  })
);

export default interactionBlockAdapter;
