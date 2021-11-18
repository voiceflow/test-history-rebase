import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter, createOutPortsAdapter, nextOnlyOutPortsAdapter } from '../utils';

const permissionAdapter = createBlockAdapter<Node.Permission.StepData, NodeData.Permission>(
  ({ permissions }) => ({ permissions }),
  ({ permissions }) => ({
    permissions: (permissions?.map((permission) => permission.trim()).filter(Boolean) as Node.PermissionType[]) ?? [],
  })
);

export const permissionOutPortAdapter = createOutPortsAdapter<NodeData.PermissionBuiltInPorts, NodeData.Permission>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default permissionAdapter;
