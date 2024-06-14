import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { DiagramNode, Reference, ReferenceResource, ReferenceResourceType } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import { DatabaseTarget, ObjectId, ReferenceORM, ReferenceResourceORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { AssistantLoadCreatorResponse } from '@/assistant/dtos/assistant-load-creator.response';
import { MutableService } from '@/common/mutable.service';

import { ReferenceBuilderUtil } from './reference-builder.util';
import { ReferenceCacheService } from './reference-cache.service';
import { ReferenceNodeBuilderUtil } from './reference-node-builder.util';

@Injectable()
export class ReferenceService extends MutableService<ReferenceORM> {
  private readonly logger = new Logger(ReferenceService.name);

  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  // eslint-disable-next-line max-params
  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
    @Inject(ReferenceORM)
    protected readonly orm: ReferenceORM,
    @Inject(ReferenceResourceORM)
    protected readonly referenceResourceORM: ReferenceResourceORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(ReferenceCacheService)
    protected readonly referenceCache: ReferenceCacheService,
    @Optional()
    protected readonly ReferenceBuilder: typeof ReferenceBuilderUtil = ReferenceBuilderUtil,
    @Optional()
    protected readonly ReferenceNodeBuilder: typeof ReferenceNodeBuilderUtil = ReferenceNodeBuilderUtil
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

  async createManyWithSubResources({
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
      const { references, referenceResources } = await new this.ReferenceBuilder(payload).build();

      await this.postgresEM.transactional(async () => {
        await this.deleteManyWithSubResourcesByEnvironment(environmentID);

        await this.createManyWithSubResources({ references, referenceResources });
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

  async addManyDiagramNodes({
    nodes,
    authMeta,
    diagramID,
    assistantID,
    environmentID,
  }: {
    nodes: DiagramNode[];
    authMeta: AuthMetaPayload;
    diagramID: string;
    assistantID: string;
    environmentID: string;
  }) {
    const diagramResource = await this.referenceResourceORM.findOneByTypeDiagramIDAndResourceID({
      type: ReferenceResourceType.DIAGRAM,
      diagramID: null,
      resourceID: diagramID,
      environmentID,
    });

    if (!diagramResource) {
      throw new NotFoundException('diagram resource not found');
    }

    const newReferences: Reference[] = [];
    const newReferenceResources: ReferenceResource[] = [];
    const intentReferenceResourceByIntentID: Partial<Record<string, ReferenceResource>> = {};

    const nodeBuilder = new this.ReferenceNodeBuilder({
      nodes,
      diagramID,
      assistantID,
      environmentID,
      diagramResourceID: diagramResource.id,

      getIntentResource: async (intentID: string) => {
        let intentResource = intentReferenceResourceByIntentID[intentID] ?? null;

        if (!intentResource) {
          intentResource = await this.referenceResourceORM.findOneByTypeDiagramIDAndResourceID({
            type: ReferenceResourceType.INTENT,
            diagramID: null,
            resourceID: intentID,
            environmentID,
          });
        }

        if (!intentResource) {
          intentResource = {
            id: new ObjectId().toJSON(),
            type: ReferenceResourceType.INTENT,
            metadata: null,
            diagramID: null,
            resourceID: intentID,
            assistantID,
            environmentID,
          };

          newReferenceResources.push(intentResource);
          intentReferenceResourceByIntentID[intentID] = intentResource;
        }

        return intentResource;
      },
    });

    const result = await nodeBuilder.build();

    newReferences.push(...result.references);
    newReferenceResources.push(...result.referenceResources);

    await this.postgresEM.transactional(() =>
      this.createManyWithSubResources({ references: newReferences, referenceResources: newReferenceResources })
    );

    await this.logux.processAs(
      Actions.Reference.AddMany({
        data: { references: newReferences, referenceResources: newReferenceResources },
        context: { assistantID, environmentID },
      }),
      authMeta
    );
  }
}
