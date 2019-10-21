import { createBlockAdapter, repromptAdapter } from './utils';

const captureBlockAdapter = createBlockAdapter(
  ({ variable, slot_type, slot_inputs, reprompt }) => ({
    variable: variable || null,
    slot: slot_type ? slot_type.label : null,
    examples: slot_inputs,
    reprompt: repromptAdapter.fromDB(reprompt),
  }),
  ({ variable, slot, examples, reprompt }) => ({
    variable,
    slot_type: { label: slot },
    slot_inputs: examples,
    reprompt: repromptAdapter.toDB(reprompt),
  })
);

export default captureBlockAdapter;
