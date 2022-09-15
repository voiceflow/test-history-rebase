import { KeyValueCache } from '@voiceflow/socket-utils';
import { MultiAdapter } from 'bidirectional-adapter';
import { PickByValue } from 'utility-types';

import type { ClientMap } from '@/clients';
import type { Client as Voiceflow } from '@/clients/voiceflow';
import type { ResourceClient } from '@/clients/voiceflow/utils/resource';
import type { ServiceMap } from '@/services';

const CACHE_EXPIRY = 60;

type KeyFactory = (options: { resourceID: string; creatorID: number }) => string;
type AccessAdapter = MultiAdapter<string, boolean, [], []>;

class AccessCache {
  constructor(private resource: keyof PickByValue<Voiceflow, ResourceClient>, private clients: ClientMap, private services: ServiceMap) {}

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
        return cachedCanRead;
      }

      const client = await this.services.voiceflow.getClientByUserID(creatorID);
      const canRead = await client[this.resource][accessType](creatorID, resourceID);

      await cache.set({ resourceID, creatorID }, canRead);

      return canRead;
    };
  }

  private getCanReadKey = this.createKeyFactory('can-read');

  private getCanWriteKey = this.createKeyFactory('can-write');

  private canReadCache = this.createCacheFactory(this.getCanReadKey);

  private canWriteCache = this.createCacheFactory(this.getCanWriteKey);

  public canRead = this.createAccessResolver(this.canReadCache, 'canRead');

  public canWrite = this.createAccessResolver(this.canWriteCache, 'canWrite');
}

export default AccessCache;
