import { createBlockAdapter, repromptAdapter } from './utils';

const choiceBlockAdapter = createBlockAdapter(
  ({ choices, inputs, reprompt }) => ({
    choices: choices.map(({ open }, index) => {
      const synonyms = inputs[index]
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean);

      return {
        synonyms,
        open,
      };
    }),
    reprompt: repromptAdapter.fromDB(reprompt),
  }),
  ({ choices, reprompt }) => ({
    choices: choices.map(({ open }) => ({ open })),
    inputs: choices.map(({ synonyms = [] }) => synonyms.join('\n')),
    reprompt: repromptAdapter.toDB(reprompt),
  })
);

export default choiceBlockAdapter;
