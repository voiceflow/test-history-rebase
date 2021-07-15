import { Plugin } from './types';

const auth: Plugin = (server) =>
  server.auth((_ctx) => {
    return true;
  });

export default auth;
