import { isBuiltInIntent } from '@/utils/intent';

import { createBlockAdapter, platformDependentAdapter, slotMappingAdapter } from './utils';

const commandBlockAdapter = platformDependentAdapter(
  createBlockAdapter(
    ({ intent, mappings, resume, diagram_id }) => ({
      intent: intent ? intent.value : null,
      resume,
      inputs: [],
      outputs: [],
      mappings: slotMappingAdapter.fromDB(mappings),
      diagramID: diagram_id,
    }),
    ({ intent, mappings, resume, diagramID }) => ({
      intent: intent ? { key: intent, value: intent, built_in: isBuiltInIntent(intent) } : null,
      resume,
      inputs: [],
      outputs: [],
      mappings: slotMappingAdapter.toDB(mappings),
      diagram_id: diagramID,
    })
  )
);

export default commandBlockAdapter;
