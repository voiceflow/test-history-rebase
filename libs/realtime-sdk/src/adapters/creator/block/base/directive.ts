import type { NodeData } from '@realtime-sdk/models';
import type { BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextOnlyOutPortsAdapter,
  nextOnlyOutPortsAdapterV2,
} from '../utils';

const directiveDataAdapter = createBlockAdapter<BaseNode.Directive.StepData, NodeData.Directive>(
  ({ directive }) => ({ directive }),
  ({ directive }) => ({ directive })
);

export const directiveOutPortsAdapter = createOutPortsAdapter<NodeData.DirectiveBuiltInPorts, NodeData.Directive>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const directiveOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.DirectiveBuiltInPorts, NodeData.Directive>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default directiveDataAdapter;
