import type { PermissionType } from '@voiceflow/alexa-types';
import type { StepData } from '@voiceflow/alexa-types/build/nodes/permission';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const interactionAdapter = createBlockAdapter<StepData, NodeData.Permission>(
  ({ permissions }) => ({ permissions }),
  ({ permissions }) => ({
    permissions: (permissions?.map((permission) => permission.trim()).filter(Boolean) as PermissionType[]) ?? [],
  })
);

export default interactionAdapter;
