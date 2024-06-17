/* eslint-disable max-params */
import type { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { Flow } from '@voiceflow/dtos';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import type {
  DiagramObject,
  FlowJSON,
  FlowObject,
  ReferenceObject,
  ReferenceResourceObject,
} from '@voiceflow/orm-designer';
import { AssistantORM, DatabaseTarget, FlowORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { CMSTabularService } from '@/common';
import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { DiagramService } from '@/diagram/diagram.service';
import { ReferenceService } from '@/reference/reference.service';
import { CMSBroadcastMeta, CMSContext } from '@/types';

import type { FlowExportImportDataDTO } from './dtos/flow-export-import-data.dto';
import type { FlowCreateData } from './flow.interface';

@Injectable()
export class FlowService extends CMSTabularService<FlowORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    protected readonly postgresEM: EntityManager,
    @Inject(FlowORM)
    protected readonly orm: FlowORM,
    @Inject(AssistantORM)
    protected readonly assistantORM: AssistantORM,
    @Inject(LoguxService)
    protected readonly logux: LoguxService,
    @Inject(DiagramService)
    protected readonly diagram: DiagramService,
    @Inject(HashedIDService)
    protected readonly hashedID: HashedIDService,
    @Inject(ReferenceService)
    protected readonly reference: ReferenceService
  ) {
    super();
  }

  /* Update */

  async updateOneByDiagramIDAndBroadcast(diagramID: string, patch: { updatedByID: number }, meta: CMSBroadcastMeta) {
    const flowID = await this.orm.updateOneByDiagramIDAndReturnID(meta.context.environmentID, diagramID, patch);

    // flow was not found
    if (flowID === null) return;

    await this.logux.processAs(
      Actions.Flow.PatchOne({
        id: flowID,
        patch: Utils.object.omit(patch, ['updatedByID']),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  /* Find */

  async findManyWithSubResourcesByEnvironment(environmentID: string) {
    const flows = await this.findManyByEnvironment(environmentID);

    return {
      flows,
    };
  }

  /* Export */

  toJSONWithSubResources({ flows }: { flows: FlowObject[] }) {
    return {
      flows: this.mapToJSON(flows),
    };
  }

  fromJSONWithSubResources({ flows }: FlowExportImportDataDTO) {
    return {
      flows: this.mapFromJSON(flows),
    };
  }

  prepareExportData(data: { flows: FlowObject[] }, { backup }: { backup?: boolean } = {}): FlowExportImportDataDTO {
    const json = this.toJSONWithSubResources(data);

    if (backup) {
      return json;
    }

    return {
      flows: json.flows.map((item) => Utils.object.omit(item, ['assistantID', 'environmentID'])),
    };
  }

  /* Clone */

  async cloneManyWithSubResourcesForEnvironment({
    targetAssistantID,
    sourceEnvironmentID,
    targetEnvironmentID,
  }: {
    targetAssistantID: string;
    sourceEnvironmentID: string;
    targetEnvironmentID: string;
  }) {
    const { flows: sourceFlows } = await this.findManyWithSubResourcesByEnvironment(sourceEnvironmentID);

    return this.importManyWithSubResources({
      flows: sourceFlows.map((flow) => ({
        ...flow,
        assistantID: targetAssistantID,
        environmentID: targetEnvironmentID,
      })),
    });
  }

  /* Import */

  prepareImportData(
    { flows }: FlowExportImportDataDTO,
    {
      userID,
      backup,
      assistantID,
      environmentID,
    }: { userID: number; backup?: boolean; assistantID: string; environmentID: string }
  ): { flows: FlowJSON[] } {
    const createdAt = new Date().toJSON();

    if (backup) {
      return {
        flows: flows.map((item) => ({
          ...item,
          assistantID,
          environmentID,
        })),
      };
    }

    return {
      flows: flows.map((item) => ({
        ...item,
        createdAt,
        updatedAt: createdAt,
        createdByID: userID,
        updatedByID: userID,
        assistantID,
        environmentID,
      })),
    };
  }

  async importManyWithSubResources(data: { flows: FlowObject[] }) {
    const flows = await this.createMany(data.flows);

    return {
      flows,
    };
  }

  async importManyWithSubResourcesFromJSON({ flows }: FlowExportImportDataDTO) {
    await this.importManyWithSubResources(this.fromJSONWithSubResources({ flows }));
  }

  /* Create */

  async createManyAndSync(data: FlowCreateData[], { userID, context }: { userID: number; context: CMSContext }) {
    const diagrams = await this.diagram.createManyComponents(
      data.map(({ name, diagram }) => ({ ...diagram, name })),
      { userID, context }
    );

    const flows = await this.createManyForUser(
      userID,
      data.map((item, index) => ({
        ...Utils.object.omit(item, ['diagram']),
        diagramID: diagrams[index].diagramID.toJSON(),
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      }))
    );

    const referenceResult = await this.reference.createManyWithSubResourcesForDiagrams({
      userID,
      diagrams: this.diagram.mapToJSON(diagrams),
      assistantID: context.assistantID,
      environmentID: context.environmentID,
    });

    return {
      ...referenceResult,
      add: { ...referenceResult.add, flows, diagrams },
    };
  }

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        flows: FlowObject[];
        diagrams: DiagramObject[];
        references: ReferenceObject[];
        referenceResources: ReferenceResourceObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    const assistant = await this.assistantORM.findOneOrFail(meta.context.assistantID);

    await Promise.all([
      this.logux.processAs(
        Actions.Flow.AddMany({
          data: this.mapToJSON(add.flows),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
      this.diagram.broadcastAddMany(add.diagrams, {
        ...meta,
        context: { ...meta.context, workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspaceID) },
      }),
      this.reference.broadcastAddMany({ add: Utils.object.pick(add, ['references', 'referenceResources']) }, meta),
    ]);
  }

  async createManyAndBroadcast(data: FlowCreateData[], meta: CMSBroadcastMeta) {
    const result = await this.createManyAndSync(data, { userID: meta.auth.userID, context: meta.context });

    await this.broadcastAddMany(result, meta);

    return result.add.flows;
  }

  /* Delete */

  async collectRelationsToDelete(flows: FlowObject[]) {
    const diagrams = await this.diagram.findMany(
      flows.map((flow) => ({ diagramID: flow.diagramID, versionID: flow.environmentID }))
    );

    return {
      diagrams,
    };
  }

  async deleteManyAndSync(ids: string[], { context }: { context: CMSContext }) {
    return this.postgresEM.transactional(async () => {
      const flows = await this.findManyByEnvironmentAndIDs(context.environmentID, ids);

      const diagramIDs = flows.map((flow) => flow.diagramID);
      const diagrams = await this.diagram.findManyByVersionIDAndDiagramIDs(context.environmentID, diagramIDs);

      await this.diagram.deleteManyByVersionIDAndDiagramIDs(context.environmentID, diagramIDs);
      await this.deleteMany(flows);

      return {
        delete: { flows, diagrams },
      };
    });
  }

  async broadcastDeleteMany(
    {
      delete: del,
    }: {
      delete: {
        flows: FlowObject[];
        diagrams: DiagramObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    const assistant = await this.assistantORM.findOneOrFail(meta.context.assistantID);

    await Promise.all([
      this.logux.processAs(
        Actions.Flow.DeleteMany({
          ids: toPostgresEntityIDs(del.flows),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
      this.diagram.broadcastDeleteMany(del.diagrams, {
        ...meta,
        context: {
          ...meta.context,
          workspaceID: this.hashedID.encodeWorkspaceID(assistant.workspaceID),
        },
      }),
    ]);
  }

  async deleteManyAndBroadcast(ids: string[], meta: CMSBroadcastMeta): Promise<void> {
    const result = await this.deleteManyAndSync(ids, meta);

    await this.broadcastDeleteMany(result, meta);
  }

  /* Duplicate */

  async duplicateManyAndSync(
    sourceFlows: FlowObject[],
    {
      userID,
      context,
      sourceEnvironmentID,
    }: {
      userID: number;
      context: CMSContext;
      sourceEnvironmentID?: string;
    }
  ) {
    const sourceDiagrams = await this.diagram.findManyByVersionIDAndDiagramIDs(
      sourceEnvironmentID ?? context.environmentID,
      sourceFlows.map((flow) => flow.diagramID)
    );

    const diagrams = await this.diagram.createManyComponents(
      sourceDiagrams.map((diagram, index) => ({
        type: diagram.type,
        zoom: diagram.zoom,
        name: sourceFlows[index]?.name ?? diagram.name,
        nodes: diagram.nodes,
        offsetX: diagram.offsetX,
        offsetY: diagram.offsetY,
        modified: diagram.modified,
        variables: diagram.variables,
      })),
      { userID, context }
    );

    const isNewEnvironment = sourceEnvironmentID && sourceEnvironmentID !== context.environmentID;

    const flows = await this.createManyForUser(
      userID,
      sourceFlows.map(({ name, folderID, description }, index) => ({
        name: isNewEnvironment ? name : `${name} (copy)`,
        folderID: isNewEnvironment ? null : folderID,
        diagramID: diagrams[index].diagramID.toJSON(),
        description,
        assistantID: context.assistantID,
        environmentID: context.environmentID,
      }))
    );

    const referenceResult = await this.reference.createManyWithSubResourcesForDiagrams({
      userID,
      diagrams: this.diagram.mapToJSON(diagrams),
      assistantID: context.assistantID,
      environmentID: context.environmentID,
    });

    return {
      ...referenceResult,
      add: { ...referenceResult.add, flows, diagrams },
    };
  }

  async copyPasteManyAndBroadcast(data: Actions.Flow.CopyPasteMany.Request['data'], meta: CMSBroadcastMeta) {
    const sourceFlows = await this.orm.findManyByDiagramIDs(data.sourceEnvironmentID, data.sourceDiagramIDs);

    const result = await this.duplicateManyAndSync(sourceFlows, {
      userID: meta.auth.userID,
      context: meta.context,
      sourceEnvironmentID: data.sourceEnvironmentID,
    });

    await this.broadcastAddMany(result, meta);

    return result.add.flows;
  }

  async duplicateOneAndBroadcast(data: { flowID: string }, meta: CMSBroadcastMeta) {
    const flow = await this.findOneOrFail({ id: data.flowID, environmentID: meta.context.environmentID });

    const result = await this.duplicateManyAndSync([flow], {
      userID: meta.auth.userID,
      context: meta.context,
    });

    await this.broadcastAddMany(result, meta);

    return result.add.flows[0];
  }

  /* Upsert */

  async upsertManyWithSubResources(
    data: { flows: Flow[] },
    meta: { userID: number; assistantID: string; environmentID: string }
  ) {
    const { flows } = this.prepareImportData(data, meta);

    await this.upsertMany(this.mapFromJSON(flows));
  }
}
