import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, createOutPortsAdapter, nextOnlyOutPortsAdapter } from '../utils';

const directiveDataAdapter = createBlockAdapter<BaseNode.Directive.StepData, NodeData.Directive>(
  ({ directive }) => ({ directive }),
  ({ directive }) => ({ directive })
);

export const directiveOutPortsAdapter = createOutPortsAdapter<NodeData.DirectiveBuiltInPorts, NodeData.Directive>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default directiveDataAdapter;
