import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';

const permissionAdapter = createBlockAdapter<Node.Permission.StepData, NodeData.Permission>(
  ({ permissions }) => ({ permissions }),
  ({ permissions }) => ({
    permissions: (permissions?.map((permission) => permission.trim()).filter(Boolean) as Node.PermissionType[]) ?? [],
  })
);

export default permissionAdapter;
