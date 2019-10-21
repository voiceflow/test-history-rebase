import { createBlockAdapter } from './utils';

const deprecatedBlockAdapter = createBlockAdapter(
  (data) => ({ ...data, deprecatedType: data.type }),
  ({ deprecatedType, ...data }) => ({ ...data, type: deprecatedType })
);
export default deprecatedBlockAdapter;
