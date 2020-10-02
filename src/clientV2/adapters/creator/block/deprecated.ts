import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const deprecatedBlockAdapter = createBlockAdapter<NodeData<unknown>, NodeData<unknown> & { deprecatedType: NodeData<unknown>['type'] }>(
  (data) => ({ ...data, deprecatedType: data.type }),
  ({ deprecatedType, ...data }) => ({ ...data, type: deprecatedType })
);
export default deprecatedBlockAdapter;
