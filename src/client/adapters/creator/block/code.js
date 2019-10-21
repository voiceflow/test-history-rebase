import { createBlockAdapter } from './utils';

const codeBlockAdapter = createBlockAdapter(
  ({ code }) => ({
    code,
  }),
  ({ code }) => ({
    code,
  })
);

export default codeBlockAdapter;
