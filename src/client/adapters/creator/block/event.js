import { createBlockAdapter } from './utils';

const eventBlockAdapter = createBlockAdapter(
  ({ requestName, mappings }) => ({
    requestName,
    mappings,
  }),
  ({ requestName, mappings }) => ({
    requestName,
    mappings,
  })
);

export default eventBlockAdapter;
