import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const permissionAdapter = createBlockAdapter<Node.Permission.StepData, NodeData.Permission>(
  ({ permissions }) => ({ permissions }),
  ({ permissions }) => ({
    permissions: (permissions?.map((permission) => permission.trim()).filter(Boolean) as Node.PermissionType[]) ?? [],
  })
);

export default permissionAdapter;
