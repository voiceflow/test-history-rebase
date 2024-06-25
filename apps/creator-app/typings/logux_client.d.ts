import type { ClientMeta } from '@logux/client';
import { Client as LoguxClient } from '@logux/client';
import type { Log } from '@logux/core';

declare module '@logux/client' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  export class Client<Headers extends object = {}, ClientLog extends Log = Log<ClientMeta>> extends LoguxClient<
    Headers,
    ClientLog
  > {
    protected subscriptions: Record<string, number>;
  }
}
