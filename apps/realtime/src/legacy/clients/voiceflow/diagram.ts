import type { ExtraOptions } from './types';
import createResourceClient from './utils/resource';

const Client = ({ api }: ExtraOptions) => ({
  ...createResourceClient(api, 'diagrams'),
});

export default Client;

export type DiagramClient = ReturnType<typeof Client>;
