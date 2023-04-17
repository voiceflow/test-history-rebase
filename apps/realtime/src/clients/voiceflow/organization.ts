import { ExtraOptions } from './types';
import createResourceClient from './utils/resource';

const Client = ({ api }: ExtraOptions) => ({
  ...createResourceClient(api, 'organizations'),
});

export default Client;

export type OrganizationClient = ReturnType<typeof Client>;
