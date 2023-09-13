import { HEARTBEAT_EXPIRE_TIMEOUT } from '../../constants';
import { AbstractControl } from '../../control';

class LockService extends AbstractControl {
  private static getNodesKey({ lockID }: { lockID: string }): string {
    return `locks:${lockID}:nodes`;
  }

  private static getTypesKey({ lockID }: { lockID: string }): string {
    return `locks:${lockID}:types`;
  }

  private static getNodeTypesKey({ lockID, nodeID }: { lockID: string; nodeID: string }): string {
    return `locks:${lockID}:nodes:${nodeID}:types`;
  }

  private static getNodeEntitiesKey({ lockID, nodeID }: { lockID: string; nodeID: string }): string {
    return `locks:${lockID}:nodes:${nodeID}:entities`;
  }

  private static getTypeLocksKey({ type, lockID }: { type: string; lockID: string }): string {
    return `locks:${lockID}:types:${type}:locks`;
  }

  public async lockEntities(lockID: string, nodeID: string, type: string, entityIDs: string[]): Promise<void> {
    await this.clients.redis
      .pipeline()

      .sadd(LockService.getTypesKey({ lockID }), type)
      .expire(LockService.getTypesKey({ lockID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .sadd(LockService.getNodesKey({ lockID }), nodeID)
      .expire(LockService.getNodesKey({ lockID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .sadd(LockService.getNodeTypesKey({ lockID, nodeID }), type)
      .expire(LockService.getNodeTypesKey({ lockID, nodeID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .sadd(LockService.getNodeEntitiesKey({ lockID, nodeID }), ...entityIDs)
      .expire(LockService.getNodeEntitiesKey({ lockID, nodeID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .hset(LockService.getTypeLocksKey({ lockID, type }), Object.fromEntries(entityIDs.map((entityID) => [entityID, nodeID])))
      .expire(LockService.getTypeLocksKey({ lockID, type }), HEARTBEAT_EXPIRE_TIMEOUT)

      .exec();
  }

  public async unlockEntities(lockID: string, nodeID: string, type: string, entityIDs: string[]): Promise<void> {
    await this.clients.redis
      .pipeline()

      .expire(LockService.getTypesKey({ lockID }), HEARTBEAT_EXPIRE_TIMEOUT)
      .expire(LockService.getNodesKey({ lockID }), HEARTBEAT_EXPIRE_TIMEOUT)
      .expire(LockService.getNodeTypesKey({ lockID, nodeID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .hdel(LockService.getTypeLocksKey({ lockID, type }), ...entityIDs)
      .expire(LockService.getTypeLocksKey({ lockID, type }), HEARTBEAT_EXPIRE_TIMEOUT)

      .srem(LockService.getNodeEntitiesKey({ lockID, nodeID }), ...entityIDs)
      .expire(LockService.getNodeEntitiesKey({ lockID, nodeID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .exec();

    const typeLen = await this.clients.redis.hlen(LockService.getTypeLocksKey({ lockID, type }));

    if (typeLen !== 0) return;

    await this.clients.redis
      .pipeline()
      .srem(LockService.getTypesKey({ lockID }), type)
      .srem(LockService.getNodeTypesKey({ lockID, nodeID }), type)
      .exec();
  }

  public async unlockAllNodeEntities(lockID: string, nodeID: string): Promise<void> {
    const [types, entityIDs] = await Promise.all([
      this.clients.redis.smembers(LockService.getNodeTypesKey({ lockID, nodeID })),
      this.clients.redis.smembers(LockService.getNodeEntitiesKey({ lockID, nodeID })),
    ]);

    const pipe = this.clients.redis
      .pipeline()

      .expire(LockService.getTypesKey({ lockID }), HEARTBEAT_EXPIRE_TIMEOUT)

      .unlink(LockService.getNodeTypesKey({ lockID, nodeID }))
      .unlink(LockService.getNodeEntitiesKey({ lockID, nodeID }))

      .srem(LockService.getNodesKey({ lockID }), nodeID)
      .expire(LockService.getNodesKey({ lockID }), HEARTBEAT_EXPIRE_TIMEOUT);

    types.forEach((type) =>
      pipe
        // just for better formatting
        .hdel(LockService.getTypeLocksKey({ lockID, type }), ...entityIDs)
        .expire(LockService.getTypeLocksKey({ lockID, type }), HEARTBEAT_EXPIRE_TIMEOUT)
    );

    await pipe.exec();
  }

  public async unlockAllEntities(lockID: string): Promise<void> {
    const [types, nodesIDs] = await Promise.all([
      this.clients.redis.smembers(LockService.getTypesKey({ lockID })),
      this.clients.redis.smembers(LockService.getNodesKey({ lockID })),
    ]);

    const keysToUnlink = [
      LockService.getTypesKey({ lockID }),
      LockService.getNodesKey({ lockID }),
      ...nodesIDs.map((nodeID) => LockService.getNodeTypesKey({ lockID, nodeID })),
      ...nodesIDs.map((nodeID) => LockService.getNodeEntitiesKey({ lockID, nodeID })),
      ...types.map((type) => LockService.getTypeLocksKey({ lockID, type })),
    ];

    this.clients.redis.unlink(keysToUnlink);
  }

  public async getAllLocks<Type extends string>(lockID: string): Promise<Record<Type, Record<string, string>>> {
    const types = await this.clients.redis.smembers(LockService.getTypesKey({ lockID }));
    const locksPerType = await Promise.all(types.map((type) => this.clients.redis.hgetall(LockService.getTypeLocksKey({ lockID, type }))));

    return Object.fromEntries(types.map((type, index) => [type, locksPerType[index]])) as Record<Type, Record<string, string>>;
  }

  public async isEntityLockedByType(currentNodeID: string, lockID: string, entityID: string, type: string): Promise<boolean> {
    const nodeID = await this.clients.redis.hget(LockService.getTypeLocksKey({ lockID, type }), entityID);

    return !!nodeID && nodeID !== currentNodeID;
  }

  public async isEntityLockedByAnyType(currentNodeID: string, lockID: string, entityID: string): Promise<boolean> {
    const types = await this.clients.redis.smembers(LockService.getTypesKey({ lockID }));
    const nodeIDs = await Promise.all(types.map((type) => this.clients.redis.hget(LockService.getTypeLocksKey({ lockID, type }), entityID)));

    return nodeIDs.some((nodeID) => !!nodeID && nodeID !== currentNodeID);
  }
}

export default LockService;
