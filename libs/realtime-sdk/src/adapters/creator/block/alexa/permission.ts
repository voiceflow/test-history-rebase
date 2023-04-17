import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';

import { createBlockAdapter, createOutPortsAdapter, createOutPortsAdapterV2, nextOnlyOutPortsAdapter, nextOnlyOutPortsAdapterV2 } from '../utils';

const permissionAdapter = createBlockAdapter<AlexaNode.Permission.StepData, NodeData.Permission>(
  ({ permissions }) => ({ permissions }),
  ({ permissions }) => ({
    permissions: (permissions?.map((permission) => permission.trim()).filter(Boolean) as AlexaNode.PermissionType[]) ?? [],
  })
);

export const permissionOutPortAdapter = createOutPortsAdapter<NodeData.PermissionBuiltInPorts, NodeData.Permission>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const permissionOutPortAdapterV2 = createOutPortsAdapterV2<NodeData.PermissionBuiltInPorts, NodeData.Permission>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default permissionAdapter;
