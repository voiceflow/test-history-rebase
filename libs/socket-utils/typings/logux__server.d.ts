import { ServerMeta } from '@logux/server';
import { AnyAction } from 'typescript-fsa';

declare module '@logux/server' {
  class Server {
    protected denyAction(action: AnyAction, meta: ServerMeta): void;
  }
}
