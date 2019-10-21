import { isBuiltInIntent } from '@/utils/intent';

import { createBlockAdapter, platformDependentAdapter, slotMappingAdapter } from './utils';

const intentBlockAdapter = platformDependentAdapter(
  createBlockAdapter(
    ({ intent, mappings }) => ({
      intent: intent?.value || intent?.key || null,
      mappings: slotMappingAdapter.fromDB(mappings),
    }),
    ({ intent, mappings }) => ({
      intent: intent ? { value: intent, key: intent, built_in: isBuiltInIntent(intent) } : null,
      mappings: slotMappingAdapter.toDB(mappings),
    })
  )
);

export default intentBlockAdapter;
