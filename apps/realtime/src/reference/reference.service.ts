import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { Diagram, DiagramNode, Reference, ReferenceResource, ReferenceResourceType } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import {
  DatabaseTarget,
  DiagramORM,
  FunctionORM,
  IntentORM,
  ObjectId,
  ProjectORM,
  ReferenceORM,
  ReferenceResourceORM,
} from '@voiceflow/orm-designer';
import { FeatureFlag } from '@voiceflow/realtime-sdk/backend';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { AssistantLoadCreatorResponse } from '@/assistant/dtos/assistant-load-creator.response';
import { MutableService } from '@/common/mutable.service';
import { CMSBroadcastMeta } from '@/types';

import { ReferenceBuilderUtil } from './reference-builder.util';
import { ReferenceBuilderCacheUtil } from './reference-builder-cache.util';
import { ReferenceCacheService } from './reference-cache.service';
import { ReferenceDiagramBuilderUtil } from './reference-diagram-builder.util';
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
    @Inject(IntentORM)
    protected readonly intentORM: IntentORM,
    @Inject(ProjectORM)
    protected readonly projectORM: ProjectORM,
    @Inject(DiagramORM)
    protected readonly diagramORM: DiagramORM,
    @Inject(FunctionORM)
    protected readonly functionORM: FunctionORM,
    @Inject(ReferenceResourceORM)
    protected readonly referenceResourceORM: ReferenceResourceORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(UnleashFeatureFlagService)
    protected readonly unleash: UnleashFeatureFlagService,
    @Inject(ReferenceCacheService)
    protected readonly referenceCache: ReferenceCacheService,
    @Optional()
    protected readonly ReferenceBuilder: typeof ReferenceBuilderUtil = ReferenceBuilderUtil,
    @Optional()
    protected readonly ReferenceNodeBuilder: typeof ReferenceNodeBuilderUtil = ReferenceNodeBuilderUtil,
    @Optional()
    protected readonly ReferenceBuilderCache: typeof ReferenceBuilderCacheUtil = ReferenceBuilderCacheUtil,
    @Optional()
    protected readonly ReferenceDiagramBuilder: typeof ReferenceDiagramBuilderUtil = ReferenceDiagramBuilderUtil
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

  async cleanupByEnvironmentID(environmentID: string) {
    await this.deleteManyWithSubResourcesByEnvironment(environmentID);
    await this.referenceCache.resetLockAndExpire(environmentID);
  }

  async createManyWithSubResources({
    references,
    referenceResources,
  }: {
    references: Reference[];
    referenceResources: ReferenceResource[];
  }) {
    const newReferenceResources = await this.referenceResourceORM.createMany(referenceResources);
    const newReferences = await this.orm.createMany(references);

    return {
      references: newReferences,
      referenceResources: newReferenceResources,
    };
  }

  async createManyWithSubResourcesAndSync({
    references,
    referenceResources,
  }: {
    references: Reference[];
    referenceResources: ReferenceResource[];
  }) {
    const referencesWithSubResources = await this.postgresEM.transactional(() =>
      this.createManyWithSubResources({ references, referenceResources })
    );

    return { add: referencesWithSubResources };
  }

  async broadcastAddMany(
    { add }: { add: { references: Reference[]; referenceResources: ReferenceResource[] } },
    meta: CMSBroadcastMeta
  ) {
    await this.logux.processAs(Actions.Reference.AddMany({ data: add, context: meta.context }), meta.auth);
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
      const dataToCreate = await new this.ReferenceBuilder(payload).build();

      const result = await this.postgresEM.transactional(async () => {
        await this.deleteManyWithSubResourcesByEnvironment(environmentID);

        return this.createManyWithSubResources(dataToCreate);
      });

      // release the lock at the end
      await this.referenceCache.setExpire(environmentID);

      return result;
    } catch (error) {
      this.logger.error(error);

      // release the lock in case of an error
      await this.referenceCache.resetLockAndExpire(environmentID);

      throw new Error('failed to build references');
    }
  }

  async createManyWithSubResourcesForDiagramNodes({
    nodes,
    diagramID,
    assistantID,
    environmentID,
  }: {
    nodes: DiagramNode[];
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

    const nodeBuilder = new this.ReferenceNodeBuilder({
      nodes,
      diagramID,
      assistantID,
      environmentID,
      diagramResourceID: diagramResource.id,
      intentResourceCache: new this.ReferenceBuilderCache(async (intentID) => {
        const { isNew, resource } = await this.findOrCreateIntentResource({ intentID, assistantID, environmentID });

        if (isNew && resource) {
          newReferenceResources.push(resource);
        }

        return resource;
      }),
      diagramResourceCache: new this.ReferenceBuilderCache(async (diagramID) => {
        const { isNew, resource } = await this.findOrCreateDiagramResource({ diagramID, assistantID, environmentID });

        if (isNew && resource) {
          newReferenceResources.push(resource);
        }

        return resource;
      }),
      functionResourceCache: new this.ReferenceBuilderCache(async (functionID) => {
        const { isNew, resource } = await this.findOrCreateFunctionResource({ functionID, assistantID, environmentID });

        if (isNew && resource) {
          newReferenceResources.push(resource);
        }

        return resource;
      }),
    });

    const result = await nodeBuilder.build();

    newReferences.push(...result.references);
    newReferenceResources.push(...result.referenceResources);

    return this.createManyWithSubResourcesAndSync({
      references: newReferences,
      referenceResources: newReferenceResources,
    });
  }

  async createManyWithSubResourcesForDiagramNodesAndBroadcast(
    { nodes, diagramID }: { nodes: DiagramNode[]; diagramID: string },
    meta: CMSBroadcastMeta
  ) {
    const result = await this.createManyWithSubResourcesForDiagramNodes({
      nodes,
      diagramID,
      assistantID: meta.context.assistantID,
      environmentID: meta.context.environmentID,
    });

    await this.broadcastAddMany(result, meta);
  }

  async createManyWithSubResourcesAndSyncForDiagrams({
    userID,
    diagrams,
    assistantID,
    environmentID,
  }: {
    userID: number;
    diagrams: Diagram[];
    assistantID: string;
    environmentID: string;
  }) {
    const project = await this.projectORM.findOneOrFail(assistantID, { fields: ['teamID'] });

    if (!this.unleash.isEnabled(FeatureFlag.REFERENCE_SYSTEM, { userID, workspaceID: project.teamID })) {
      return { add: { references: [], referenceResources: [] } };
    }

    const newReferences: Reference[] = [];
    const newReferenceResources: ReferenceResource[] = [];

    const builder = new this.ReferenceDiagramBuilder({
      diagrams,
      assistantID,
      environmentID,
      intentResourceCache: new this.ReferenceBuilderCache(async (intentID) => {
        const { isNew, resource } = await this.findOrCreateIntentResource({ intentID, assistantID, environmentID });

        if (isNew && resource) {
          newReferenceResources.push(resource);
        }

        return resource;
      }),
      diagramResourceCache: new this.ReferenceBuilderCache(async (diagramID) => {
        const { isNew, resource } = await this.findOrCreateDiagramResource({ diagramID, assistantID, environmentID });

        if (isNew && resource) {
          newReferenceResources.push(resource);
        }

        return resource;
      }),
      functionResourceCache: new this.ReferenceBuilderCache(async (functionID) => {
        const { isNew, resource } = await this.findOrCreateFunctionResource({ functionID, assistantID, environmentID });

        if (isNew && resource) {
          newReferenceResources.push(resource);
        }

        return resource;
      }),
    });

    const result = await builder.build();

    newReferences.push(...result.references);
    newReferenceResources.push(...result.referenceResources);

    return this.createManyWithSubResourcesAndSync({
      references: newReferences,
      referenceResources: newReferenceResources,
    });
  }

  async deleteManyWithSubResourcesAndSyncByDiagramNodeIDs({
    nodeIDs,
    diagramID,
    environmentID,
  }: {
    nodeIDs: string[];
    diagramID: string;
    environmentID: string;
  }) {
    const referenceResources = await this.referenceResourceORM.deleteManyByTypeDiagramIDAndResourceIDs({
      type: ReferenceResourceType.NODE,
      diagramID,
      resourceIDs: nodeIDs,
      environmentID,
    });

    return {
      delete: {
        references: [],
        referenceResources,
      },
    };
  }

  async deleteManyWithSubResourcesAndSyncByDiagramIDs({
    userID,
    diagramIDs,
    assistantID,
    environmentID,
  }: {
    // delete with REFERENCE_SYSTEM ff
    userID: number;
    diagramIDs: string[];
    // delete with REFERENCE_SYSTEM ff
    assistantID: string;
    environmentID: string;
  }) {
    const project = await this.projectORM.findOneOrFail(assistantID, { fields: ['teamID'] });

    if (
      !this.unleash.isEnabled(FeatureFlag.REFERENCE_SYSTEM, { userID, workspaceID: project.teamID }) ||
      !diagramIDs.length
    ) {
      return { delete: { references: [], referenceResources: [] } };
    }

    const diagramReferenceResources = await this.referenceResourceORM.deleteManyByTypeDiagramIDAndResourceIDs({
      type: ReferenceResourceType.DIAGRAM,
      diagramID: null,
      resourceIDs: diagramIDs,
      environmentID,
    });

    const nodeReferenceResources = await this.referenceResourceORM.deleteManyByTypeAndDiagramIDs({
      type: ReferenceResourceType.NODE,
      diagramIDs,
      environmentID,
    });

    return {
      delete: {
        references: [],
        referenceResources: [...diagramReferenceResources, ...nodeReferenceResources],
      },
    };
  }

  async deleteManyWithSubResourcesAndSyncByIntentIDs({
    userID,
    intentIDs,
    assistantID,
    environmentID,
  }: {
    // delete with REFERENCE_SYSTEM ff
    userID: number;
    intentIDs: string[];
    // delete with REFERENCE_SYSTEM ff
    assistantID: string;
    environmentID: string;
  }) {
    const project = await this.projectORM.findOneOrFail(assistantID, { fields: ['teamID'] });

    if (
      !this.unleash.isEnabled(FeatureFlag.REFERENCE_SYSTEM, { userID, workspaceID: project.teamID }) ||
      !intentIDs.length
    ) {
      return { delete: { references: [], referenceResources: [] } };
    }

    const referenceResources = await this.referenceResourceORM.deleteManyByTypeDiagramIDAndResourceIDs({
      type: ReferenceResourceType.INTENT,
      diagramID: null,
      resourceIDs: intentIDs,
      environmentID,
    });

    return {
      delete: {
        references: [],
        referenceResources,
      },
    };
  }

  async deleteManyWithSubResourcesAndSyncByFunctionIDs({
    userID,
    functionIDs,
    assistantID,
    environmentID,
  }: {
    // delete with REFERENCE_SYSTEM ff
    userID: number;
    functionIDs: string[];
    // delete with REFERENCE_SYSTEM ff
    assistantID: string;
    environmentID: string;
  }) {
    const project = await this.projectORM.findOneOrFail(assistantID, { fields: ['teamID'] });

    if (
      !this.unleash.isEnabled(FeatureFlag.REFERENCE_SYSTEM, { userID, workspaceID: project.teamID }) ||
      !functionIDs.length
    ) {
      return { delete: { references: [], referenceResources: [] } };
    }

    const referenceResources = await this.referenceResourceORM.deleteManyByTypeDiagramIDAndResourceIDs({
      type: ReferenceResourceType.FUNCTION,
      diagramID: null,
      resourceIDs: functionIDs,
      environmentID,
    });

    return {
      delete: {
        references: [],
        referenceResources,
      },
    };
  }

  async broadcastDeleteMany(
    { delete: del }: { delete: { references: Reference[]; referenceResources: ReferenceResource[] } },
    meta: CMSBroadcastMeta
  ) {
    await this.logux.processAs(Actions.Reference.DeleteMany({ data: del, context: meta.context }), meta.auth);
  }

  async deleteManyWithSubResourcesByDiagramNodeIDsAndBroadcast(
    {
      nodeIDs,
      diagramID,
    }: {
      nodeIDs: string[];
      diagramID: string;
    },
    meta: CMSBroadcastMeta
  ) {
    const result = await this.deleteManyWithSubResourcesAndSyncByDiagramNodeIDs({
      nodeIDs,
      diagramID,
      environmentID: meta.context.environmentID,
    });

    await this.broadcastDeleteMany(result, meta);
  }

  private async findOrCreateIntentResource({
    intentID,
    assistantID,
    environmentID,
  }: {
    intentID: string;
    assistantID: string;
    environmentID: string;
  }) {
    let isNew = false;

    // check if the intent exists
    const intent = await this.intentORM.findOne({ id: intentID, environmentID });

    if (!intent) return { isNew: false, resource: null };

    let intentResource = await this.referenceResourceORM.findOneByTypeDiagramIDAndResourceID({
      type: ReferenceResourceType.INTENT,
      diagramID: null,
      resourceID: intentID,
      environmentID,
    });

    if (!intentResource) {
      isNew = true;

      intentResource = {
        id: new ObjectId().toJSON(),
        type: ReferenceResourceType.INTENT,
        metadata: null,
        diagramID: null,
        resourceID: intentID,
        assistantID,
        environmentID,
      };
    }

    return {
      isNew,
      resource: intentResource,
    };
  }

  private async findOrCreateDiagramResource({
    diagramID,
    assistantID,
    environmentID,
  }: {
    diagramID: string;
    assistantID: string;
    environmentID: string;
  }) {
    let isNew = false;

    // check if the diagram exists
    const diagram = await this.diagramORM.findOneByVersionIDAndDiagramID(environmentID, diagramID);

    if (!diagram) return { isNew: false, resource: null };

    let diagramResource = await this.referenceResourceORM.findOneByTypeDiagramIDAndResourceID({
      type: ReferenceResourceType.DIAGRAM,
      diagramID: null,
      resourceID: diagramID,
      environmentID,
    });

    if (!diagramResource) {
      isNew = true;

      diagramResource = {
        id: new ObjectId().toJSON(),
        type: ReferenceResourceType.DIAGRAM,
        metadata: null,
        diagramID: null,
        resourceID: diagramID,
        assistantID,
        environmentID,
      };
    }

    return {
      isNew,
      resource: diagramResource,
    };
  }

  private async findOrCreateFunctionResource({
    functionID,
    assistantID,
    environmentID,
  }: {
    functionID: string;
    assistantID: string;
    environmentID: string;
  }) {
    let isNew = false;

    // check if the function exists
    const fn = await this.functionORM.findOne({ id: functionID, environmentID });

    if (!fn) return { isNew: false, resource: null };

    let functionResource = await this.referenceResourceORM.findOneByTypeDiagramIDAndResourceID({
      type: ReferenceResourceType.FUNCTION,
      diagramID: null,
      resourceID: functionID,
      environmentID,
    });

    if (!functionResource) {
      isNew = true;

      functionResource = {
        id: new ObjectId().toJSON(),
        type: ReferenceResourceType.FUNCTION,
        metadata: null,
        diagramID: null,
        resourceID: functionID,
        assistantID,
        environmentID,
      };
    }

    return {
      isNew,
      resource: functionResource,
    };
  }
}
