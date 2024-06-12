import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { Reference, ReferenceResource } from '@voiceflow/dtos';
import { DatabaseTarget, ReferenceORM, ReferenceResourceORM } from '@voiceflow/orm-designer';

import { AssistantLoadCreatorResponse } from '@/assistant/dtos/assistant-load-creator.response';
import { MutableService } from '@/common/mutable.service';

import { ReferenceBuilderUtil } from './reference-builder.util';
import { ReferenceCacheService } from './reference-cache.service';

@Injectable()
export class ReferenceService extends MutableService<ReferenceORM> {
  private readonly logger = new Logger(ReferenceService.name);

  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(ReferenceORM)
    protected readonly orm: ReferenceORM,
    @Inject(ReferenceResourceORM)
    protected readonly referenceResourceORM: ReferenceResourceORM,
    @Inject(ReferenceCacheService)
    protected readonly referenceCache: ReferenceCacheService,
    @Optional()
    protected readonly ReferenceBuilder: typeof ReferenceBuilderUtil = ReferenceBuilderUtil
  ) {
    super();
  }

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const [references, referenceResources] = await Promise.all([
      this.orm.findManyByEnvironment(environmentID),
      this.referenceResourceORM.findManyByEnvironment(environmentID),
    ]);

    return {
      references,
      referenceResources,
    };
  }

  async deleteManyWithSubResourcesByEnvironment(environmentID: string) {
    await this.referenceResourceORM.deleteManyByEnvironment(environmentID);
    await this.orm.deleteManyByEnvironment(environmentID);
  }

  async createManyWithSubResourcesByEnvironment({
    references,
    referenceResources,
  }: {
    references: Reference[];
    referenceResources: ReferenceResource[];
  }) {
    await this.referenceResourceORM.createMany(referenceResources);
    await this.orm.createMany(references);
  }

  async buildForCreator(
    payload: AssistantLoadCreatorResponse,
    { exitOnAcquireLockFail = false }: { exitOnAcquireLockFail?: boolean } = {}
  ): Promise<{ references: Reference[]; referenceResources: ReferenceResource[] }> {
    const environmentID = payload.version._id;

    const isCacheValid = await this.referenceCache.isValid(environmentID);

    if (isCacheValid) {
      return this.findManyWithSubResourcesByEnvironment(environmentID);
    }

    try {
      // locking the references cache
      await this.referenceCache.acquireLock(environmentID);
    } catch {
      if (exitOnAcquireLockFail) {
        throw new Error('failed to acquire lock');
      }

      // someone else is building the references, wait until they finish
      await this.referenceCache.waitUntilUnlocked(environmentID);

      // try again
      return this.buildForCreator(payload, { exitOnAcquireLockFail: true });
    }

    try {
      const { references, referenceResources } = new this.ReferenceBuilder(payload).build();

      await this.postgresEM.transactional(async () => {
        await this.deleteManyWithSubResourcesByEnvironment(environmentID);

        await this.createManyWithSubResourcesByEnvironment({ references, referenceResources });
      });

      // release the lock at the end
      await this.referenceCache.setExpire(environmentID);

      return { references, referenceResources };
    } catch (error) {
      this.logger.error(error);

      // release the lock in case of an error
      await this.referenceCache.resetLockAndExpire(environmentID);

      throw new Error('failed to build references');
    }
  }
}
