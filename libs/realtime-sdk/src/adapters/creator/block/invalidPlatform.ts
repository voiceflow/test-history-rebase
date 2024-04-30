import type { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

export type InvalidPlatformNodeData = NodeData<unknown> & { invalidPlatformType: NodeData<unknown>['type'] };

const invalidPlatformBlockAdapter = createBlockAdapter<NodeData<unknown>, InvalidPlatformNodeData>(
  (data) => ({ ...data, invalidPlatformType: data.type }),
  ({ invalidPlatformType, ...data }) => ({ ...data, type: invalidPlatformType })
);
export default invalidPlatformBlockAdapter;
