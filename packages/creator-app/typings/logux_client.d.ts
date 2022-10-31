import { Client as LoguxClient, ClientMeta } from '@logux/client';
import { Log } from '@logux/core';

declare module '@logux/client' {
  export class Client<Headers extends object = {}, ClientLog extends Log = Log<ClientMeta>> extends LoguxClient<Headers, ClientLog> {
    protected subscriptions: Record<string, number>;
  }
}
