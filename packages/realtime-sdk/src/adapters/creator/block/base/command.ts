import { BaseNode } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, emptyOutPortsAdapter, emptyOutPortsAdapterV2 } from '../utils';

const commandAdapter = createBlockAdapter<BaseNode.Command.StepData, NodeData.Command>(
  ({ intent, diagramID, name, mappings }) => ({ intent, diagramID: diagramID ?? null, mappings: mappings ?? [], name }),
  ({ name, intent, diagramID, mappings }) => ({
    name,
    next: null,
    intent: intent ?? '',
    mappings: mappings.map((mapping) => ({ variable: mapping.variable ?? '', slot: mapping.slot ?? '' })),
    diagramID: diagramID ?? '',
  })
);

export const commandOutPortsAdapter = emptyOutPortsAdapter;

export const commandOutPortsAdapterV2 = emptyOutPortsAdapterV2;

export default commandAdapter;
