import { NodeData } from '../../../models';
import { createBlockAdapter } from './utils';

const invalidPlatformBlockAdapter = createBlockAdapter<NodeData<unknown>, NodeData<unknown> & { invalidPlatformType: NodeData<unknown>['type'] }>(
  (data) => ({ ...data, invalidPlatformType: data.type }),
  ({ invalidPlatformType, ...data }) => ({ ...data, type: invalidPlatformType })
);
export default invalidPlatformBlockAdapter;
