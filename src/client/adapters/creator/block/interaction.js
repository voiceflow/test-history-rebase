import { isBuiltInIntent } from '@/utils/intent';

import { createBlockAdapter, platformDependentAdapter, slotMappingAdapter } from './utils';

const interactionBlockAdapter = platformDependentAdapter(
  createBlockAdapter(
    ({ choices }) =>
      choices.map(({ intent, mappings, open }) => ({
        selected: intent?.key || intent?.value || null,
        mappings: slotMappingAdapter.fromDB(mappings),
        open,
      })),
    (choices) => {
      return {
        choices: choices.map(({ selected, open, mappings }) => ({
          intent: selected
            ? {
                key: selected,
                value: selected,
                built_in: isBuiltInIntent(selected),
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
