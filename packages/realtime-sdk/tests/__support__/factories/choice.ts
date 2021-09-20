import { Choice } from '@voiceflow/base-types/build/node/interaction';
import { define } from 'cooky-cutter';
import { lorem } from 'faker';

// eslint-disable-next-line import/prefer-default-export
export const choiceFactory = define<Choice>({
  intent: () => lorem.word(),
  mappings: () => [{ slot: lorem.word(), variable: lorem.word() }],
});
