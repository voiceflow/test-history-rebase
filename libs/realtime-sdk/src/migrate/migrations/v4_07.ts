import { Transform } from './types';

// fill postgres entities table
const migrateToV4_07: Transform = ({ entities }) => {
  // eslint-disable-next-line no-console
  console.log({ entities });
};

export default migrateToV4_07;
