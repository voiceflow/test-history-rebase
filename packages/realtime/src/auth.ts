import { Plugin } from './types';

const auth: Plugin = (server) =>
  server.auth(() => {
    return true;
  });

export default auth;
