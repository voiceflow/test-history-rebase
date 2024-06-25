import { HEARTBEAT_EXPIRE_TIMEOUT } from '@/constants';

import { AbstractControl } from '../../control';

class LockService extends AbstractControl {
  private static getNodesKey({ versionID, lockID }: { versionID: string; lockID: string }): string {
    return `locks:${versionID}:${lockID}:nodes`;
  }

  private static getTypesKey({ versionID, lockID }: { versionID: string; lockID: string }): string {
    return `locks:${versionID}:${lockID}:types`;
  }

  private static getNodeTypesKey({
    versionID,
    lockID,
    nodeID,
  }: {
    versionID: string;
    lockID: string;
    nodeID: string;
  }): string {
    return `locks:${versionID}:${lockID}:nodes:${nodeID}:types`;
  }

  private static getNodeEntitiesKey({
    versionID,
    lockID,
    nodeID,
  }: {
    versionID: string;
    lockID: string;
    nodeID: string;
  }): string {
    return `locks:${versionID}:${lockID}:nodes:${nodeID}:entities`;
  }

  private static getTypeLocksKey({
    versionID,
    lockID,
    type,
  }: {
    versionID: string;
    lockID: string;
    type: string;
  }): string {
    return `locks:${versionID}:${lockID}:types:${type}:locks`;
  }

  public async lockEntities(
    versionID: string,
    lockID: string,
    nodeID: string,
    type: string,
    entityIDs: string[]
  ): Promise<void> {
    await this.clients.redis
      .pipeline()

      .sadd(LockService.getTypesKey({ versionID, lockID }), type)
      .expire(LockService.getTypesKey({ versionID, lockID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .sadd(LockService.getNodesKey({ versionID, lockID }), nodeID)
      .expire(LockService.getNodesKey({ versionID, lockID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .sadd(LockService.getNodeTypesKey({ versionID, lockID, nodeID }), type)
      .expire(LockService.getNodeTypesKey({ versionID, lockID, nodeID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .sadd(LockService.getNodeEntitiesKey({ versionID, lockID, nodeID }), ...entityIDs)
      .expire(LockService.getNodeEntitiesKey({ versionID, lockID, nodeID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .hset(
        LockService.getTypeLocksKey({ versionID, lockID, type }),
        Object.fromEntries(entityIDs.map((entityID) => [entityID, nodeID]))
      )
      .expire(LockService.getTypeLocksKey({ versionID, lockID, type }), HEARTBEAT_EXPIRE_TIMEOUT)

      .exec();
  }

  public async unlockEntities(
    versionID: string,
    lockID: string,
    nodeID: string,
    type: string,
    entityIDs: string[]
  ): Promise<void> {
    await this.clients.redis
      .pipeline()

      .expire(LockService.getTypesKey({ versionID, lockID }), HEARTBEAT_EXPIRE_TIMEOUT)
      .expire(LockService.getNodesKey({ versionID, lockID }), HEARTBEAT_EXPIRE_TIMEOUT)
      .expire(LockService.getNodeTypesKey({ versionID, lockID, nodeID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .hdel(LockService.getTypeLocksKey({ versionID, lockID, type }), ...entityIDs)
      .expire(LockService.getTypeLocksKey({ versionID, lockID, type }), HEARTBEAT_EXPIRE_TIMEOUT)

      .srem(LockService.getNodeEntitiesKey({ versionID, lockID, nodeID }), ...entityIDs)
      .expire(LockService.getNodeEntitiesKey({ versionID, lockID, nodeID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .exec();

    const typeLen = await this.clients.redis.hlen(LockService.getTypeLocksKey({ versionID, lockID, type }));

    if (typeLen !== 0) return;

    await this.clients.redis
      .pipeline()
      .srem(LockService.getTypesKey({ versionID, lockID }), type)
      .srem(LockService.getNodeTypesKey({ versionID, lockID, nodeID }), type)
      .exec();
  }

  public async unlockAllNodeEntities(versionID: string, lockID: string, nodeID: string): Promise<void> {
    const [types, entityIDs] = await Promise.all([
      this.clients.redis.smembers(LockService.getNodeTypesKey({ versionID, lockID, nodeID })),
      this.clients.redis.smembers(LockService.getNodeEntitiesKey({ versionID, lockID, nodeID })),
    ]);

    const pipe = this.clients.redis
      .pipeline()

      .expire(LockService.getTypesKey({ versionID, lockID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .unlink(LockService.getNodeTypesKey({ versionID, lockID, nodeID }))
      .unlink(LockService.getNodeEntitiesKey({ versionID, lockID, nodeID }))

      .srem(LockService.getNodesKey({ versionID, lockID }), nodeID)
      .expire(LockService.getNodesKey({ versionID, lockID }), HEARTBEAT_EXPIRE_TIMEOUT);

    types.forEach((type) =>
      pipe
        // just for better formatting
        .hdel(LockService.getTypeLocksKey({ versionID, lockID, type }), ...entityIDs)
        .expire(LockService.getTypeLocksKey({ versionID, lockID, type }), HEARTBEAT_EXPIRE_TIMEOUT)
    );

    await pipe.exec();
  }

  public async unlockAllEntities(versionID: string, lockID: string): Promise<void> {
    const [types, nodesIDs] = await Promise.all([
      this.clients.redis.smembers(LockService.getTypesKey({ versionID, lockID })),
      this.clients.redis.smembers(LockService.getNodesKey({ versionID, lockID })),
    ]);

    const keysToUnlink = [
      LockService.getTypesKey({ versionID, lockID }),
      LockService.getNodesKey({ versionID, lockID }),
      ...nodesIDs.map((nodeID) => LockService.getNodeTypesKey({ versionID, lockID, nodeID })),
      ...nodesIDs.map((nodeID) => LockService.getNodeEntitiesKey({ versionID, lockID, nodeID })),
      ...types.map((type) => LockService.getTypeLocksKey({ versionID, lockID, type })),
    ];

    this.clients.redis.unlink(keysToUnlink);
  }

  public async getAllLocks<Type extends string>(
    versionID: string,
    lockID: string
  ): Promise<Record<Type, Record<string, string>>> {
    const types = await this.clients.redis.smembers(LockService.getTypesKey({ versionID, lockID }));
    const locksPerType = await Promise.all(
      types.map((type) => this.clients.redis.hgetall(LockService.getTypeLocksKey({ versionID, lockID, type })))
    );

    return Object.fromEntries(types.map((type, index) => [type, locksPerType[index]])) as Record<
      Type,
      Record<string, string>
    >;
  }

  public async isEntityLockedByType(
    currentNodeID: string,
    versionID: string,
    lockID: string,
    entityID: string,
    type: string
  ): Promise<boolean> {
    const nodeID = await this.clients.redis.hget(LockService.getTypeLocksKey({ versionID, lockID, type }), entityID);

    return !!nodeID && nodeID !== currentNodeID;
  }

  public async isEntityLockedByAnyType(
    currentNodeID: string,
    versionID: string,
    lockID: string,
    entityID: string
  ): Promise<boolean> {
    const types = await this.clients.redis.smembers(LockService.getTypesKey({ versionID, lockID }));
    const nodeIDs = await Promise.all(
      types.map((type) => this.clients.redis.hget(LockService.getTypeLocksKey({ versionID, lockID, type }), entityID))
    );

    return nodeIDs.some((nodeID) => !!nodeID && nodeID !== currentNodeID);
  }
}

export default LockService;
