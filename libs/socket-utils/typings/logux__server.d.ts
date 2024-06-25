import type { ServerMeta } from '@logux/server';
import type { AnyAction } from 'typescript-fsa';

declare module '@logux/server' {
  class Server {
    protected denyAction(action: AnyAction, meta: ServerMeta): void;
  }
}
