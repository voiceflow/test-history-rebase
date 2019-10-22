import { createBlockAdapter, repromptAdapter } from './utils';

const choiceBlockAdapter = createBlockAdapter(
  ({ choices, inputs, reprompt }) => ({
    choices: choices.map(({ open }, index) => {
      const [value, ...synonyms] = inputs[index].split('\n');

      return {
        value: value || null,
        synonyms,
        open,
      };
    }),
    reprompt: repromptAdapter.fromDB(reprompt),
  }),
  ({ choices, reprompt }) => ({
    choices: choices.map(({ open }) => ({ open })),
    inputs: choices.map(({ value, synonyms }) => [value, ...synonyms].join('\n')),
    reprompt: repromptAdapter.toDB(reprompt),
  })
);

export default choiceBlockAdapter;
