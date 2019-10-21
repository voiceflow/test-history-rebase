import { createBlockAdapter } from './utils';

const randomBlockAdapter = createBlockAdapter(
  ({ paths, smart }) => ({
    paths,
    noDuplicates: smart,
  }),
  ({ paths, noDuplicates }) => ({
    paths,
    smart: noDuplicates,
  })
);

export default randomBlockAdapter;
