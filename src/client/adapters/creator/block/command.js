import { isBuiltInIntent } from '@/utils/intent';

import { createBlockAdapter, platformDependentAdapter, slotMappingAdapter } from './utils';

const commandBlockAdapter = platformDependentAdapter(
  createBlockAdapter(
    ({ intent, mappings, resume, diagram_id }) => ({
      intent: intent ? intent.value : null,
      mappings: slotMappingAdapter.fromDB(mappings),
      resume,
      diagramID: diagram_id,
    }),
    ({ intent, mappings, resume, diagramID }) => ({
      intent: intent
        ? {
            value: intent,
            built_in: isBuiltInIntent(intent),
          }
        : null,
      mappings: slotMappingAdapter.toDB(mappings),
      resume,
      diagram_id: diagramID,
    })
  )
);

export default commandBlockAdapter;
