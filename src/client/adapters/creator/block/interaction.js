import cuid from 'cuid';

import { isBuiltInIntent } from '@/utils/intent';

import { createBlockAdapter, platformDependentAdapter, slotMappingAdapter } from './utils';

const interactionBlockAdapter = platformDependentAdapter(
  createBlockAdapter(
    ({ choices }) =>
      choices.map(({ intent, mappings, open }) => ({
        id: cuid.slug(),
        intent: intent?.key || intent?.value || null,
        mappings: slotMappingAdapter.fromDB(mappings),
        open,
      })),
    (choices) => {
      return {
        choices: choices.map(({ intent, open, mappings }) => ({
          intent: intent
            ? {
                key: intent,
                value: intent,
                built_in: isBuiltInIntent(intent),
              }
            : null,
          mappings: slotMappingAdapter.toDB(mappings),
          open,
        })),
      };
    }
  )
);

export default interactionBlockAdapter;
