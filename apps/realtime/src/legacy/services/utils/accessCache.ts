import { Logger } from '@nestjs/common';
import { KeyValueCache } from '@voiceflow/socket-utils';
import { MultiAdapter } from 'bidirectional-adapter';
import { PickByValue } from 'utility-types';

import type { ClientMap } from '@/legacy/clients';
import type { Client as Voiceflow } from '@/legacy/clients/voiceflow';
import type { ResourceClient } from '@/legacy/clients/voiceflow/utils/resource';
import type { ServiceMap } from '@/legacy/services';

// cache has to be set lower than chrome's throttled heartbeat interval (60s)
const CACHE_EXPIRY = 55;
const DENIED_CACHE_EXPIRY = 10;

type KeyFactory = (options: { resourceID: string; creatorID: number }) => string;
type AccessAdapter = MultiAdapter<string, boolean, [], []>;

class AccessCache {
  public canRead: ReturnType<AccessCache['createAccessResolver']>;

  public canWrite: ReturnType<AccessCache['createAccessResolver']>;

  constructor(private resource: keyof PickByValue<Voiceflow, ResourceClient>, private clients: ClientMap, private services: ServiceMap) {
    const canReadCache = this.createCacheFactory(this.createKeyFactory('can-read'));

    const canWriteCache = this.createCacheFactory(this.createKeyFactory('can-write'));

    this.canRead = this.createAccessResolver(canReadCache, 'canRead');

    this.canWrite = this.createAccessResolver(canWriteCache, 'canWrite');
  }

  private createKeyFactory(action: string): KeyFactory {
    return ({ resourceID, creatorID }) => `${this.resource}:${resourceID}:${action}:${creatorID}`;
  }

  private createCacheFactory<Parameters>(keyCreator: (params: Parameters) => string) {
    return this.clients.cache.createKeyValue({
      expire: CACHE_EXPIRY,
      adapter: this.clients.cache.adapters.booleanAdapter,
      keyCreator,
    });
  }

  private createAccessResolver(cache: KeyValueCache<KeyFactory, AccessAdapter>, accessType: keyof ResourceClient) {
    return async (creatorID: number, resourceID: string) => {
      const cachedCanRead = await cache.get({ resourceID, creatorID });

      if (cachedCanRead !== null) {
        // TODO: remove this temporary logging after BUG-696
        if (!cachedCanRead) {
          new Logger().warn(`[cache access denied] ${creatorID}`, { resource: this.resource, resourceID, accessType, creatorID });
        }

        return cachedCanRead;
      }

      const client = await this.services.voiceflow.client.getByUserID(creatorID);
      const canRead = await client[this.resource][accessType](creatorID, resourceID);

      // TODO: remove this temporary logging after BUG-696
      if (!canRead) {
        new Logger().warn(`[access denied] ${creatorID}`, {
          resource: this.resource,
          resourceID,
          accessType,
          creatorID,
          token: (client as any).token || 'not_found',
        });
      }

      await cache.set({ resourceID, creatorID }, canRead, canRead ? undefined : { expire: DENIED_CACHE_EXPIRY });

      return canRead;
    };
  }
}

export default AccessCache;
