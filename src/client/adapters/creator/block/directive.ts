import { createBlockAdapter } from './utils';

const directiveBlockAdapter = createBlockAdapter(
  ({ directive }: { directive: string }) => ({
    directive,
  }),
  ({ directive }: { directive: string }) => ({
    directive,
  })
);

export default directiveBlockAdapter;
